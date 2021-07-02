import React from 'react';
import { View, StyleSheet, TouchableWithoutFeedback, Text } from 'react-native';

import styleDefinitions from '../../helpers/styleDefinitions.js';

import GuidelineCurrentResistanceButtonIcon from './icons/GuidelineCurrentResistanceButtonIcon.js';
import GuidelineArrowRightIcon from './icons/GuidelineArrowRightIcon.js';

/**
 * Shows a currentResistance button on the diagnosis detail view.
 *
 * If the user clicks this button, we select the current diagnosis and go back to the matrix view.
 * There the user see, which resistances are recommended
 *
 * @extends {React.Component}
 */
export default class ShowResistancesForSelectedDiagnosisButton extends React.Component {

    constructor(...props) {
        super(...props);
        this.showResistancesForCurrentDiagnosis =
            this.showResistancesForCurrentDiagnosis.bind(this);
    }

    /**
     * Select the current diagnosis and go back to the matrix view.
     * There the user see, which resistances are recommended
     */
    showResistancesForCurrentDiagnosis() {
        this.props.selectedGuideline.selectDiagnosis(this.props.diagnosis);
        this.props.navigation.navigate('Main');
    }

    render() {

        return (

            <TouchableWithoutFeedback
                onPress={this.showResistancesForCurrentDiagnosis}
            >
                <View style={styles.button}>
                    <View style={styles.buttonIcon}>
                        <GuidelineCurrentResistanceButtonIcon
                            height={24}
                            width={24} />
                    </View>
                    <View style={styles.buttonDivider} />
                    <Text style={styles.buttonText}>
                        Show Resistances
                    </Text>
                    <GuidelineArrowRightIcon
                        height={11.7}
                        width={5.8}
                        stroke={styleDefinitions.colors.guidelines.darkBlue} />
                </View>
            </TouchableWithoutFeedback>
        );
    }

}

const styles = StyleSheet.create({
    button: {
        height: 50,
        width: 198,
        borderRadius: 25,
        backgroundColor: styleDefinitions.colors.white,
        ...styleDefinitions.shadows.primaryButton,

        flexDirection: 'row',
        paddingLeft: 19,
        paddingRight: 19,
        paddingTop: 13,
        paddingBottom: 13,

        justifyContent: 'space-between',
        alignItems: 'center',
    },
    buttonIcon: {},
    buttonText: {
        fontSize: 14,
        fontFamily: styleDefinitions.fonts.condensed.fontFamily,
    },
    buttonDivider: {
        height: 27,
        borderLeftWidth: 1,
        borderColor: styleDefinitions.colors.guidelines.darkBlue,
        opacity: 0.5,
    },
});
