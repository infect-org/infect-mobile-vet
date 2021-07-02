import React from 'react';
import { View, StyleSheet, TouchableWithoutFeedback, Text } from 'react-native';
import { observer } from 'mobx-react';
import { computed } from 'mobx';

import styleDefinitions from '../../helpers/styleDefinitions';

import GuidelineButtonIcon from './icons/GuidelineButtonIcon.js';
import GuidelineButtonTrashIcon from './icons/GuidelineButtonTrashIcon.js';

/**
 * Renders the guideline button:
 * open diagnosis list or clear selected diagnosis
 *
 * @extends {React.Component}
 */
export default @observer class GuidelineButton extends React.Component {

    constructor(...props) {
        super(...props);
        this.openGuidelinesDrawer = this.openGuidelinesDrawer.bind(this);
        this.removeSelectedDiagnosis = this.removeSelectedDiagnosis.bind(this);
    }

    /**
     * Opens the guideline drawer
     * the diagnosis list will get rendered.
     *
     * If a diagnosis is selected, directly render its detail view
     *
     */
    openGuidelinesDrawer() {
        const selectedDiagnosis = this.props.guidelines.getSelectedDiagnosis();

        if (selectedDiagnosis) {
            this.props.navigation.navigate('Guideline', {
                screen: 'DiagnosisDetail',
                // diagnosis: selectedDiagnosis,
                // drawer: this.props.drawer,
                params: {
                    selectedGuidelineID: this.props.guidelines.selectedGuideline.id,
                    selectedDiagnosisID: selectedDiagnosis.id,
                    // Needed to display name in header
                    selectedDiagnosisName: selectedDiagnosis.name,
                },
            });
        } else {
            this.props.navigation.navigate('Guideline', {
                screen: 'GuidelineList',
            });
        }

    }

    /**
     * Remove the selected diagnosis on the selected guideline:
     * - Matrix will not be filtere / highlighted anymore
     */
    removeSelectedDiagnosis() {
        this.props.guidelines.selectedGuideline.selectDiagnosis();
    }

    /**
     * Truncate the diagnosis name if it's longer then n
     *
     * @returns {String}
     */
    @computed get selectedDiagnosisName() {
        const { name } = this.props.guidelines.getSelectedDiagnosis();

        if (name.length > 12) {
            return `${name.substring(0, 12)}...`;
        }

        return name;
    }

    render() {
        const selectedDiagnosis = this.props.guidelines.getSelectedDiagnosis();

        return (

            <View style={styles.container}>
                {/* open diagnosis list */}
                <TouchableWithoutFeedback
                    onPress={this.openGuidelinesDrawer}
                >
                    <View style={selectedDiagnosis ? styles.guidelineButton : [
                        styles.guidelineButton,
                        styles.borderRadiusRight,
                    ]}>
                        <View style={styles.buttonIcon}>
                            <GuidelineButtonIcon
                                height={25}
                                width={40} />
                        </View>
                        <View style={styles.buttonDivider} />
                        <Text style={styles.buttonText}>
                            {selectedDiagnosis ? this.selectedDiagnosisName
                                : 'Guidelines'}
                        </Text>
                    </View>
                </TouchableWithoutFeedback>

                {/* remove current selected diagnosis */}
                {selectedDiagnosis &&
                    <TouchableWithoutFeedback
                        onPress={this.removeSelectedDiagnosis}
                    >
                        <View style={styles.deleteButton}>
                            <GuidelineButtonTrashIcon
                                width={22}
                                height={24.3}
                            />
                        </View>
                    </TouchableWithoutFeedback>
                }
            </View>

        );
    }

}

const styles = StyleSheet.create({
    container: {
        ...styleDefinitions.shadows.primaryButton,

        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    guidelineButton: {
        // borderRadius: 25,
        borderTopLeftRadius: 25,
        borderBottomLeftRadius: 25,
        backgroundColor: styleDefinitions.colors.guidelines.ligthBlue,

        flexDirection: 'row',
        paddingLeft: 16,
        paddingRight: 16,
        paddingTop: 13,
        paddingBottom: 13,

        justifyContent: 'space-between',
        alignItems: 'center',
    },
    borderRadiusRight: {
        borderTopRightRadius: 25,
        borderBottomRightRadius: 25,
    },
    deleteButton: {
        backgroundColor: styleDefinitions.colors.guidelines.buttonDarkBlue,
        paddingLeft: 16,
        paddingRight: 16,
        paddingTop: 14,
        paddingBottom: 14,

        borderTopRightRadius: 25,
        borderBottomRightRadius: 25,

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

        marginLeft: 5,
        marginRight: 5,
    },
});
