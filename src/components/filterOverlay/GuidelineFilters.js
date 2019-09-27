import React from 'react';
import { View, StyleSheet, TouchableWithoutFeedback, Text } from 'react-native';
import { transaction } from 'mobx';
import { observer } from 'mobx-react';
import { filterTypes } from 'infect-frontend-logic';
import FilterOverlayTitle from '../filterOverlayTitle/FilterOverlayTitle';
import FilterOverlaySwitchItem from '../filterOverlaySwitchItem/FilterOverlaySwitchItem';

import styleDefinitions from '../../helpers/styleDefinitions.js';

@observer
export default class GuidelineFilters extends React.Component {

    /**
     * «Dummy» filter item for the guideline filter
     */
    guidelineFilter = {
        identifier: 'guideline_filter',
        property: {
            entityType: 'guideline_filter',
        },
    }

    constructor(props) {
        super(props);

        this.toggleOnlyShowRelevantData = this.toggleOnlyShowRelevantData.bind(this);
        this.removeSelectedDiagnosis = this.removeSelectedDiagnosis.bind(this);
    }

    /**
     * Only show relevant bacteria and antibiotic which are part of the selected
     * guideline/diagnosis.
     *
     * - Get all relevant bacteria
     * - Get all relevant antibiotic
     * - Toggle (add or remove) those as filter to the selectedFilter list
     *
     */
    toggleOnlyShowRelevantData() {
        this.props.selectedFilters.toggleFilter(this.guidelineFilter);

        const bacteriumNames = this.props.selectedGuideline.selectedDiagnosis.inducingBacteria
            .map(bacterium => bacterium.name);

        const antibioticNames = this.props.selectedGuideline.selectedDiagnosis.therapies
            .map(therapy => therapy.recommendedAntibiotics)
            .reduce((accumulator, value) => accumulator.concat(value), [])
            .map(recommendedAntibiotic => recommendedAntibiotic.antibiotic.name);

        // We need to do it in a transaction, so all the filters get rendered properly
        transaction(() => {
            this.props.filterValues
                .getValuesForProperty(filterTypes.bacterium, 'name')
                .filter(item => bacteriumNames.includes(item.value))
                .forEach(bacteriumFilter => this.props.selectedFilters
                    .toggleFilter(bacteriumFilter));
        });

        // We need to do it in a transaction, so all the filters get rendered properly
        transaction(() => {
            this.props.filterValues
                .getValuesForProperty(filterTypes.antibiotic, 'name')
                .filter(item => antibioticNames.includes(item.value))
                .forEach(antibioticFilter => this.props.selectedFilters
                    .toggleFilter(antibioticFilter));
        });
    }

    /**
     * Remove the selected guideline/diagnosis:
     * - Remove all filters
     * - Set selectedDiagnosis to undefined
     */
    removeSelectedDiagnosis() {
        this.props.selectedFilters.removeAllFilters();
        this.props.selectedGuideline.selectDiagnosis();
    }

    render() {

        if (!this.props.selectedGuideline ||
            !this.props.selectedGuideline.selectedDiagnosis) return null;

        const { selectedDiagnosis } = this.props.selectedGuideline;

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

                <FilterOverlaySwitchItem
                    item={this.guidelineFilter}
                    selectedFilters={this.props.selectedFilters}
                    name="Only show relevant data"
                    borderTop={true}
                    hideCheckbox={false}
                    selectionChangeHandler={this.toggleOnlyShowRelevantData}

                    filterListItemStyles={{
                        backgroundColor: styleDefinitions.colors.guidelines.backgroundMiddleBlue,
                        borderColor: styleDefinitions.colors.lightBackgroundGrey,
                    }}
                    labelStyles={{
                        color: styleDefinitions.colors.mediumBackgroundGrey,
                    }}
                    checkboxCircleSelectedStyles={{
                        backgroundColor: styleDefinitions.colors.guidelines.darkBlue,
                    }}
                    checkboxCircleNotSelectedStyles={{
                        borderColor: styleDefinitions.colors.guidelines.darkBlue,
                        borderWidth: 1,
                    }}
                    filterOverlaySwitchItemCheckMarkStrokeColor={styleDefinitions.colors.guidelines.backgroundMiddleBlue}
                />

                <TouchableWithoutFeedback
                    onPress={this.removeSelectedDiagnosis}
                >
                    <View style={styles.removeFiltersButton}>
                        <View
                            style={
                                styleDefinitions.buttons.textContainer
                            }
                        >
                            <Text style={[
                                styleDefinitions.buttons.secondaryText,
                                styles.removeFiltersButtonText,
                            ]}>
                                Remove Guideline
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
    removeFiltersButton: {
        margin: 20,
        ...styleDefinitions.buttons.secondaryButton,
        backgroundColor: styleDefinitions.colors.guidelines.darkBlue,
    },
    removeFiltersButtonText: {
        color: styleDefinitions.colors.white,
    },
});
