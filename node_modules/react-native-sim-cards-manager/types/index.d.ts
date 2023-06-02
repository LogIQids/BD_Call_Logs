import { Rationale } from 'react-native';
export declare function requestCellularNetworkPermission(then: () => any, rationale?: Rationale): Promise<any>;
export declare type EsimConfig = {
    address: string;
    confirmationCode?: string;
    eid?: string;
    iccid?: string;
    matchingId?: string;
    oid?: string;
};
declare type SimManager = {
    getSimCards(rationale?: Rationale): Promise<Array<any>>;
    getSimCardsNative(): Promise<Array<any>>;
    setupEsim(config: EsimConfig): Promise<boolean | never>;
    isEsimSupported(): Promise<boolean | never>;
};
declare const _default: SimManager;
export default _default;
