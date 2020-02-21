import React from 'react';
import { View, StyleSheet, TouchableWithoutFeedback, Text } from 'react-native';
import { observer } from 'mobx-react';
import { computed } from 'mobx';
import FilterOverlayTitle from '../filterOverlayTitle/FilterOverlayTitle.js';

import styleDefinitions from '../../helpers/styleDefinitions.js';

@observer
export default class GuidelineFilters extends React.Component {

    constructor(props) {
        super(props);

        this.addDiagnosisFilters = this.addDiagnosisFilters.bind(this);
    }

    addDiagnosisFilters() {
        this.props.guidelineRelatedFilters.selectFiltersRelatedToSelectedDiagnosis();
    }

    @computed get areAllDiagnosisRelatedFiltersSelected() {
        return this.props.guidelineRelatedFilters.areAllDiagnosisRelatedFiltersSelected();
    }

    render() {

        if (!this.props.guidelines.getSelectedDiagnosis()) return null;

        const selectedDiagnosis = this.props.guidelines.getSelectedDiagnosis();

        return (
            <View style={styles.container}>
                <FilterOverlayTitle
                    title="Guidelines"
                    textColor={styleDefinitions.colors.darkBackgroundGrey}
                />

                <FilterOverlayTitle
                    title={selectedDiagnosis.name}
                    followsTitle={true}
                    level={2}
                    textColor={styleDefinitions.colors.mediumBackgroundGrey}
                />

                <TouchableWithoutFeedback
                    onPress={this.addDiagnosisFilters}
                    disabled={this.areAllDiagnosisRelatedFiltersSelected}
                >
                    <View style={[
                        styles.addFiltersButton,
                        {
                            backgroundColor: this.areAllDiagnosisRelatedFiltersSelected ?
                                styleDefinitions.colors.guidelines.ligthBlue :
                                styleDefinitions.colors.guidelines.darkBlue,
                        }
                    ]}>
                        <View
                            style={
                                styleDefinitions.buttons.textContainer
                            }
                        >
                            <Text style={[
                                styleDefinitions.buttons.secondaryText,
                                {
                                    color: this.areAllDiagnosisRelatedFiltersSelected ?
                                        styleDefinitions.colors.guidelines.middleBlue :
                                        styleDefinitions.colors.white,
                                },
                            ]}>
                                Filter Matrix by Diagnosis
                            </Text>
                        </View>
                    </View>
                </TouchableWithoutFeedback>

            </View>
        );
    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: styleDefinitions.colors.guidelines.middleBlue,
    },
    addFiltersButton: {
        margin: 20,
        ...styleDefinitions.buttons.secondaryButton,
    },
});
