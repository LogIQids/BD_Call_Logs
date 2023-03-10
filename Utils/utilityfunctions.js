import ImagePicker from 'react-native-image-crop-picker';
import storage from '@react-native-firebase/storage';

class UtilityFunctions {
  constructor() {}

  uploadImage() {
    return new Promise((resolve, reject) => {
      ImagePicker.openPicker({
        width: 300,
        height: 400,
        cropping: true,
      })
        .then(async image => {
          const filename = `userProfile_${Date.now()}.png`;
          const reference = storage().ref(filename);
          const pathToFile = `${image.path}`;
          // uploads file

          await reference.putFile(pathToFile);

          await storage()
            .ref(filename)
            .getDownloadURL()
            .then(url => {
              if (url) {
                return resolve(url);
              }
            });
        })
        .catch(error => {});
    });
  }
}
export default UtilityFunctions;
