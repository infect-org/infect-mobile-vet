import { Platform } from 'react-native';

import tenantColors from './tenantColors.js';

const bold = {
    fontFamily: Platform.OS === 'ios' ? 'Avenir-Heavy' : 'sans-serif-medium',
};

export default {
    // https://github.com/react-native-training/react-native-fonts
    fonts: {
        condensed: {
            fontFamily: Platform.OS === 'ios' ? 'AvenirNextCondensed-Medium' :
                'sans-serif-condensed',
        },
        bold,
    },
    // Deprecated, use fonts.condensed!
    base: {
        // https://github.com/react-native-training/react-native-fonts
        fontFamily: Platform.OS === 'ios' ? 'AvenirNextCondensed-Medium' : 'sans-serif-condensed',
    },
    label: {
        fontSize: 12,
        letterSpacing: -0.4,
    },
    colors: {
        ...tenantColors,
        error: '#d82222',
        white: '#ffffff',
        black: '#000000',
    },
    buttons: {
        primaryButton: {
            height: 50,
            borderRadius: 5,
        },
        primaryText: {
            ...bold,
            fontSize: 25,
            textAlign: 'center',
        },
        textContainer: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
        },
        secondaryButton: {
            height: 40,
            borderRadius: 4,
        },
        secondaryText: {
            ...bold,
            fontSize: 20,
            textAlign: 'center',
        },
    },
    shadows: {
        primaryButton: {
            elevation: 4,
            shadowColor: '#000',
            shadowRadius: 10,
            shadowOpacity: 0.5,
            shadowOffset: {
                width: 5,
                height: 5,
            },
        },
    },
};
