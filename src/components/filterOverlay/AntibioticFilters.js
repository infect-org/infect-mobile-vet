import React from 'react';
import { View, StyleSheet } from 'react-native';
import { computed } from 'mobx';
import { observer } from 'mobx-react';
import FilterOverlayTitle from '../filterOverlayTitle/FilterOverlayTitle';
import FilterOverlaySwitchItem from '../filterOverlaySwitchItem/FilterOverlaySwitchItem';
import log from '../../helpers/log';

@observer
export default class AntibioticFilters extends React.Component {

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
        if (this.isFilterSelected(item)) this.props.selectedFilters.removeFilter(item);
        else this.props.selectedFilters.addFilter(item);
    }


    render() {
        return (
            <View style={styles.container}>
                <FilterOverlayTitle title="Antibiotics"/>

                { /* Substances */ }
                <FilterOverlayTitle
                    title="Substances"
                    followsTitle={true}
                    level={2}
                />
                { this.sortedSubstanceFilters.map((substance, index) => (
                    <FilterOverlaySwitchItem
                        item={substance}
                        selectedFilters={this.props.selectedFilters}
                        key={substance.value}
                        name={substance.niceValue}
                        borderTop={index === 0}
                        selectionChangeHandler={
                            () => this.itemSelectionChangeHandler(substance)
                        }
                    />
                ))}

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
                        selectionChangeHandler={
                            () => this.itemSelectionChangeHandler(substanceClass)
                        }
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
                        selectionChangeHandler={
                            () => this.itemSelectionChangeHandler(application)
                        }
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
