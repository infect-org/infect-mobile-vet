import React from 'react';
import { View, StyleSheet } from 'react-native';
import { computed } from 'mobx';
import { observer } from 'mobx-react';
import { filterTypes } from '@infect/frontend-logic';
import FilterOverlayTitle from '../filterOverlayTitle/FilterOverlayTitle';
// import FilterOverlaySwitchItem from '../filterOverlaySwitchItem/FilterOverlaySwitchItem';
import FilterList from './FilterList';
import log from '../../helpers/log';


@observer
export default class AnimalFilters extends React.Component {

    @computed get ageAnimalFilters() {
        return this.props.filterValues
            .getValuesForProperty(filterTypes.animal, 'id');
    }

    render() {

        log('AnimalFilters: Render');

        if (this.ageAnimalFilters.length < 1) return null;

        return (
            <View style={styles.container}>
                <FilterOverlayTitle title="Animal"/>

                <FilterList
                    items={this.ageAnimalFilters}
                    selectedFilters={this.props.selectedFilters}
                    singleSelectionMode={true}
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
