import { Platform } from 'react-native';

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
        green: '#cbe264', // c7ed61
        // For use of fine stuff on white. Corresponds to green, darkened 25% using
        // https://pinetools.com/darken-color
        darkGreen: '#afcd26',
        blackGreen: '#31330b',
        error: '#d82222',
        highlightBackground: '#a9ddf2',
        darkBackgroundGrey: '#363636',
        mediumBackgroundGrey: '#4b4b4b',
        lightBackgroundGrey: '#848484',
        lightForegroundGrey: '#bcbcbc',
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
