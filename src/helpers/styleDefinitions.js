import { Platform } from 'react-native';

export default {
    // https://github.com/react-native-training/react-native-fonts
    fonts: {
        condensed: {
            fontFamily: Platform.OS === 'ios' ? 'AvenirNextCondensed-Medium' :
                'sans-serif-condensed',
        },
        bold: {
            fontFamily: Platform.OS === 'ios' ? 'Avenir-Heavy' : 'sans-serif-medium',
        },
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
        green: '#cbe264', // c7ed61
        error: '#d82222',
        blackGreen: '#31330b',
        highlightBackground: '#a9ddf2',
        darkBackgroundGrey: '#363636',
        mediumBackgroundGrey: '#4B4B4B',
        lightBackgroundGrey: '#848484',
        lightForegroundGrey: '#BCBCBC',
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
