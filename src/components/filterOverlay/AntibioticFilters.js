import React from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { computed, observable, action } from 'mobx';
import { observer } from 'mobx-react';
import FilterOverlayTitle from '../filterOverlayTitle/FilterOverlayTitle';
import FilterOverlaySwitchItem from '../filterOverlaySwitchItem/FilterOverlaySwitchItem';
import FilterOverlayPicker from '../filterOverlayPicker/FilterOverlayPicker';
import log from '../../helpers/log';

@observer
export default class AntibioticFilters extends React.Component {

    @observable isSubstancesPickerVisible = false;

    constructor(...props) {
        super(...props);
        this.toggleSubstancesPicker = this.toggleSubstancesPicker.bind(this);
        this.handleSubstanceClassPickerChange = this.handleSubstanceClassPickerChange.bind(this);
        this.itemSelectionChangeHandler = this.itemSelectionChangeHandler.bind(this);
    }

    componentDidMount() {
        log('AntibioticFilters: Mounted');
    }

    /**
     * Returns all substance classes, sorted by niceValue
     * @private
     */
    @computed get sortedSubstanceClassFilters() {
        return this.props.filterValues.getValuesForProperty('substanceClass', 'name')
            .sort(this.sortByProperty('niceValue'));
    }

    @computed get sortedSubstanceFilters() {
        const substances = this.props.filterValues.getValuesForProperty('antibiotic', 'name')
            .sort(this.sortByProperty('niceValue'));
        log('AntibioticFilters: Substances are', substances);
        return substances;
    }

    @computed get selectedSubstanceFilters() {
        return this.sortedSubstanceFilters.filter((name) => {
            const filterIsSelected = this.props.selectedFilters.isSelected(name);
            return filterIsSelected;
        });
    }

    @computed get applications() {
        const applications = [
            this.props.filterValues.getValuesForProperty('antibiotic', 'po')
                .find(item => item.value === true),
            this.props.filterValues.getValuesForProperty('antibiotic', 'iv')
                .find(item => item.value === true),
        ];
        log('AntibioticFilters: Applications are', applications);
        return applications;
    }

    /**
     * Sorts values by a given property
     * @private
     */
    sortByProperty(property) {
        return (a, b) => (a[property] < b[property] ? -1 : 1);
    }

    isFilterSelected(item) {
        log('AntibioticFilters: Is filter selected?', item);
        return this.props.selectedFilters.isSelected(item);
    }

    /**
     * Handles click on a filter: adds or removes item from/to selectedFilters
     * @private
     */
    itemSelectionChangeHandler(item) {
        this.props.selectedFilters.toggleFilter(item);
    }

    @action toggleSubstancesPicker() {
        this.isSubstancesPickerVisible = !this.isSubstancesPickerVisible;
    }

    /**
     * Invoked when substance in picker is changed; toggle filter, hide picker.
     * @param  {SubstanceClassMatrixView} substance
     */
    handleSubstanceClassPickerChange(substance) {
        // Get model from sub
        console.log('Toggle', substance);
        this.itemSelectionChangeHandler(substance);
        this.toggleSubstancesPicker();
    }

    @computed get substanceClassPickerHeight() {
        if (Platform.OS === 'android') return 50;
        // iOS:
        if (this.isSubstancesPickerVisible) return 200;
        return 0;
    }

    render() {

        log('AntibioticFilters: Render');

        return (
            <View style={styles.container}>
                <FilterOverlayTitle title="Antibiotics"/>

                { /* Substances */ }
                <FilterOverlayTitle
                    title="Substances"
                    followsTitle={true}
                    level={2}
                />
                { /* Selected substances: Checkbox */ }
                { this.selectedSubstanceFilters.map((substance, index) => (
                    <FilterOverlaySwitchItem
                        item={substance}
                        selectedFilters={this.props.selectedFilters}
                        key={substance.value}
                        name={substance.niceValue}
                        borderTop={index === 0}
                        selectionChangeHandler={this.itemSelectionChangeHandler}
                    />
                ))}
                { /* All substances: Dropdown/Picker */ }
                { Platform.OS === 'ios' &&
                    <FilterOverlaySwitchItem
                        item={{}}
                        selectedFilters={this.props.selectedFilters}
                        name="Select substances …"
                        // Only display top border if no elements are selected
                        borderTop={this.selectedSubstanceFilters.length === 0}
                        hideCheckbox={true}
                        selectionChangeHandler={this.toggleSubstancesPicker}
                    />
                }
                <View
                    style={[{
                        height: this.substanceClassPickerHeight,
                    }]}
                >
                    <FilterOverlayPicker
                        items={this.sortedSubstanceFilters}
                        selectionChangeHandler={this.handleSubstanceClassPickerChange}
                    />
                </View>

                { /* Substance Classes */ }
                <FilterOverlayTitle
                    title="Substance Classes"
                    level={2}
                />
                { this.sortedSubstanceClassFilters.map((substanceClass, index) => (
                    <FilterOverlaySwitchItem
                        item={substanceClass}
                        selectedFilters={this.props.selectedFilters}
                        key={substanceClass.value}
                        borderTop={index === 0}
                        selectionChangeHandler={this.itemSelectionChangeHandler}
                    />
                )) }

                { /* Application */ }
                <FilterOverlayTitle
                    title="Application"
                    level={2}
                />
                { this.applications.map((application, index) => (
                    <FilterOverlaySwitchItem
                        key={application.niceValue}
                        item={application}
                        selectedFilters={this.props.selectedFilters}
                        borderTop={index === 0}
                        selectionChangeHandler={this.itemSelectionChangeHandler}
                    />
                )) }

            </View>
        );
    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});
