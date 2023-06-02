"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requestCellularNetworkPermission = void 0;
const react_native_1 = require("react-native");
const LINKING_ERROR = `The package 'react-native-sim-cards-manager' doesn't seem to be linked. Make sure: \n\n` +
    react_native_1.Platform.select({ ios: "- You have run 'pod install'\n", default: '' }) +
    '- You rebuilt the app after installing the package\n' +
    '- You are not using Expo managed workflow\n';
const SimCardsManagerModule = react_native_1.NativeModules.SimCardsManager
    ? react_native_1.NativeModules.SimCardsManager
    : new Proxy({}, {
        get() {
            throw new Error(LINKING_ERROR);
        },
    });
async function requestCellularNetworkPermission(then, rationale) {
    if (react_native_1.Platform.OS == 'android') {
        const granted = await react_native_1.PermissionsAndroid.request(react_native_1.PermissionsAndroid.PERMISSIONS.READ_PHONE_STATE, rationale ?? {
            title: 'App Permission',
            message: 'App needs access to get informations of your cellular network',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
        });
        console.log(granted);
        console.log(react_native_1.PermissionsAndroid.RESULTS);
        if (granted === react_native_1.PermissionsAndroid.RESULTS.GRANTED ||
            granted === react_native_1.PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) {
            return then();
        }
        else {
            return Promise.reject({ code: '3', message: 'Permission not granted' });
        }
    }
    else {
        return then();
    }
}
exports.requestCellularNetworkPermission = requestCellularNetworkPermission;
SimCardsManagerModule.getSimCards = async () => {
    return await requestCellularNetworkPermission(react_native_1.NativeModules.SimCardsManager.getSimCardsNative);
};
exports.default = SimCardsManagerModule;
//# sourceMappingURL=index.js.map