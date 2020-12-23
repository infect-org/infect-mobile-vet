import styleDefinitions from '../../../helpers/styleDefinitions.js';

/**
 * Shared styles for guideline header (in navigation)
 */
export default {
    headerStyle: {
        backgroundColor: styleDefinitions.colors.guidelines.darkBlue,
    },
    headerTintColor: styleDefinitions.colors.white,
    headerTitleStyle: {
        fontWeight: 'bold',
        fontSize: 20,
        textAlign: 'center',
        flex: 1,
    },
    headerLeftContainerStyle: { marginTop: -16 },
    headerRightContainerStyle: { marginTop: -16 },
};
