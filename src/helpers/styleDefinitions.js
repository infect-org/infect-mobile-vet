import { Platform, StyleSheet } from 'react-native';

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
    fontSizes: {
        guidelines: {
            bigText: 20,
            regularText: 14,
        },
    },
    colors: {
        green: '#cbe264', // c7ed61
        // For use of fine stuff on white. Corresponds to green, darkened 25% using
        // https://pinetools.com/darken-color
        darkGreen: '#afcd26',
        blackGreen: '#31330b',
        error: '#d82222',
        errorText: '#a94442',
        warningBackground: '#fcf8e3',
        warningText: '#8a6d3b',
        notificationBackground: '#d9edf7',
        notificationText: '#31708f',
        highlightBackground: '#a9ddf2',
        darkBackgroundGrey: '#363636',
        mediumBackgroundGrey: '#4b4b4b',
        lightBackgroundGrey: '#848484',
        lightForegroundGrey: '#bcbcbc',
        white: '#ffffff',
        black: '#000000',
        red: '#DD1F1F',
        guidelines: {
            ligthBlue: '#A7CCEB',
            middleBlue: '#E2ECF5',
            darkBlue: '#3289CC',
            buttonDarkBlue: '#85BAE3',
            gray: '#6F6F6F',
            backgroundMiddleBlue: '#BED7ED',
            infoTextGray: '#585858',
        },
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
    markdownStyles: StyleSheet.create({
        // see
        // https://github.com/mientjan/react-native-markdown-renderer/blob/master/src/lib/styles.js
        // for a full list
        heading1: {
            fontSize: 18,
            fontWeight: 'bold',
        },
        heading2: {
            fontSize: 16,
            fontWeight: 'bold',
        },
        heading3: {
            fontSize: 16,
            fontWeight: 'bold',
            marginTop: 15,
            marginBottom: 5,
        },
        listUnorderedItemIcon: {
            marginLeft: 0,
            marginRight: 10,
            lineHeight: Platform.OS === 'ios' ? 16 : 19,
            // lineHeight: 16,
        },
        listUnorderedItemText: {
            fontSize: 20,
            lineHeight: 20,
        },
        paragraph: {
            // marginTop: 10,
            marginBottom: 5,
            flexWrap: 'wrap',
            flexDirection: 'row',
            alignItems: 'flex-start',
            justifyContent: 'flex-start',
        },
        codeInline: {
            borderWidth: 1,
            borderColor: '#E2ECF5',
            padding: 10,
            borderRadius: 4,
        },
    }),
    markdownDisclaimer: StyleSheet.create({
        // see
        // https://github.com/mientjan/react-native-markdown-renderer/blob/master/src/lib/styles.js
        // for a full list
        paragraph: {
            // marginTop: 10,
            // marginBottom: 5,
            flexWrap: 'wrap',
            flexDirection: 'row',
            alignItems: 'flex-start',
            justifyContent: 'flex-start',
        },
        text: {
            color: '#6F6F6F',
        },
        link: {
            color: '#3289CC',
            textDecorationLine: 'underline',
        },
    }),
};
