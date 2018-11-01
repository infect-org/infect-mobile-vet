import React from 'react';
import { View, StyleSheet } from 'react-native';
import { computed } from 'mobx';
import { observer } from 'mobx-react';
import { filterTypes } from 'infect-frontend-logic';
import FilterOverlayTitle from '../filterOverlayTitle/FilterOverlayTitle';
import FilterOverlaySwitchItem from '../filterOverlaySwitchItem/FilterOverlaySwitchItem';
import log from '../../helpers/log';

@observer
export default class PopulationFilters extends React.Component {

    componentDidMount() {
        log('PopulationFilters: Mounted');
    }

    @computed get regionFilters() {
        return this.props.filterValues.getValuesForProperty(filterTypes.region, 'id');
    }

    @computed get ageGroupFilters() {
        return this.props.filterValues.getValuesForProperty(filterTypes.ageGroup, 'id');
    }

    @computed get patientSettingFilters() {
        return this.props.filterValues.getValuesForProperty(filterTypes.hospitalStatus, 'id');
    }

    /**
     * Sorts values by a given property
     * @private
     */
    sortByProperty(property) {
        return (a, b) => (a[property] < b[property] ? -1 : 1);
    }

    isFilterSelected(item) {
        log('PopulationFilters: Is filter selected?', item);
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

        log('PopulationFilters: Render');

        return (
            <View style={styles.container}>
                <FilterOverlayTitle title="Population"/>

                { /* Region */ }
                <FilterOverlayTitle
                    title="Region"
                    followsTitle={true}
                    level={2}
                />
                { this.regionFilters.map((region, index) => (
                    <FilterOverlaySwitchItem
                        item={region}
                        selectedFilters={this.props.selectedFilters}
                        key={region.value}
                        borderTop={index === 0}
                        selectionChangeHandler={
                            () => this.itemSelectionChangeHandler(region)
                        }
                    />
                ))}

                { /* Age Group */ }
                <FilterOverlayTitle
                    title="Age Group"
                    level={2}
                />
                { this.ageGroupFilters.map((ageGroup, index) => (
                    <FilterOverlaySwitchItem
                        item={ageGroup}
                        selectedFilters={this.props.selectedFilters}
                        key={ageGroup.value}
                        borderTop={index === 0}
                        selectionChangeHandler={
                            () => this.itemSelectionChangeHandler(ageGroup)
                        }
                    />
                ))}

                { /* In/out patients */ }
                <FilterOverlayTitle
                    title="Patient Setting"
                    level={2}
                />
                { this.patientSettingFilters.map((patientSetting, index) => (
                    <FilterOverlaySwitchItem
                        item={patientSetting}
                        selectedFilters={this.props.selectedFilters}
                        key={patientSetting.value}
                        borderTop={index === 0}
                        selectionChangeHandler={
                            () => this.itemSelectionChangeHandler(patientSetting)
                        }
                    />
                ))}

            </View>
        );
    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});
