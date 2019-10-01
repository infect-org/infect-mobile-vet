import React from 'react';
import { Linking } from 'react-native';

/**
 * opens a url on the device like call, website, etc.
*/
export default (url) => {
    Linking.canOpenURL(url).then((supported) => {
        if (!supported) {
            console.log(`Can't handle url: ${url}, the URL format is not supported!`);
        } else {
            return Linking.openURL(url);
        }
    }).catch(err => console.error(`Can't open url: ${url}`, err));
};
