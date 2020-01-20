import { Linking } from 'react-native';

/**
 * opens a url on the device like call, website, etc.
*/
export default (url, notificationCenter) => {
    Linking.canOpenURL(url).then((supported) => {
        if (!supported) {
            notificationCenter.handle({
                message: `Can't handle url: ${url}, the URL format is not supported!`,
                severity: 'warning',
            });
        } else {
            return Linking.openURL(url);
        }
    }).catch((err) => {
        notificationCenter.handle({
            message: `Can't open url ${url}: ${err.message}`,
            severity: 'warning',
        });
    });
};
