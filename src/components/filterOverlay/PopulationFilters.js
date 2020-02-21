import React from 'react';
import { View, StyleSheet } from 'react-native';
import { computed } from 'mobx';
import { observer } from 'mobx-react';
import { filterTypes } from '@infect/frontend-logic';
import FilterOverlayTitle from '../filterOverlayTitle/FilterOverlayTitle';
// import FilterOverlaySwitchItem from '../filterOverlaySwitchItem/FilterOverlaySwitchItem';
import FilterList from './FilterList';
import log from '../../helpers/log';

/**
 * Get first number of a string, needed to sort age groups. '15-32' returns 15; '>=64' returns 64;
 * '<15' returns 14, as it needs to be placed before '15-32'.
 * @param  {String} ageGroup niceValue for an ageGroup, e.g. >15 or 15-32
 * @return {Number}
 */
function getFirstNumber(ageGroup) {
    const firstNumberMatch = ageGroup.match(/\d+/);
    if (!firstNumberMatch) return 0;
    const firstNumber = parseInt(firstNumberMatch[0], 10);
    if (ageGroup[0] === '<') return firstNumber - 1;
    return firstNumber;
}

@observer
export default class PopulationFilters extends React.Component {

    @computed get ageGroupFilters() {
        return this.props.filterValues
            .getValuesForProperty(filterTypes.ageGroup, 'id')
            .sort((a, b) => getFirstNumber(a.niceValue) - getFirstNumber(b.niceValue));
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
                <FilterList
                    property={filterTypes.region}
                    name="id"
                    sortProperty="niceValue"
                    filterValues={this.props.filterValues}
                    selectedFilters={this.props.selectedFilters}
                />

                { /* Age Group */ }
                <FilterOverlayTitle
                    title="Age Group"
                    level={2}
                />
                <FilterList
                    items={this.ageGroupFilters}
                    selectedFilters={this.props.selectedFilters}
                />

                { /* In/out patients */ }
                <FilterOverlayTitle
                    title="Patient Setting"
                    level={2}
                />
                <FilterList
                    property={filterTypes.hospitalStatus}
                    name="id"
                    filterValues={this.props.filterValues}
                    selectedFilters={this.props.selectedFilters}
                />

            </View>
        );
    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});
