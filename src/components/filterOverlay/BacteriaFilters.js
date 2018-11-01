import React from 'react';
import { View, StyleSheet } from 'react-native';
import { computed } from 'mobx';
import { observer } from 'mobx-react';
import FilterOverlayTitle from '../filterOverlayTitle/FilterOverlayTitle';
import FilterOverlaySwitchItem from '../filterOverlaySwitchItem/FilterOverlaySwitchItem';
import log from '../../helpers/log';

@observer
export default class BacteriaFilters extends React.Component {

    componentDidMount() {
        log('BacteriaFilters: Mounted');
    }

    @computed get shapes() {
        // Strangely, there's a shape in the DB that doesn't have a value (it's undefined) …
        return this.props.filterValues.getValuesForProperty('bacterium', 'shape')
            .filter(item => item.value !== undefined);
    }

    /**
     * Returns all substance classes, sorted by niceValue
     * @private
     */
    @computed get sortedBacteria() {
        return this.props.filterValues.getValuesForProperty('bacterium', 'name')
            .sort(this.sortByProperty('niceValue'));
    }

    /**
     * Sorts values by a given property
     * @private
     */
    sortByProperty(property) {
        return (a, b) => (a[property] < b[property] ? -1 : 1);
    }

    isFilterSelected(item) {
        log('BacteriaFilters: Is filter selected?', item);
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

    @computed get metabolisms() {
        const applications = [
            this.props.filterValues.getValuesForProperty('bacterium', 'aerobic')
                .find(item => item.value === true),
            this.props.filterValues.getValuesForProperty('bacterium', 'anaerobic')
                .find(item => item.value === true),
        ];
        log('BacteriaFilters: Metabolisms are', applications);
        return applications;

    }


    render() {
        return (
            <View style={styles.container}>
                <FilterOverlayTitle title="Bacteria"/>

                { /* Substances */ }
                <FilterOverlayTitle
                    title="Name"
                    followsTitle={true}
                    level={2}
                />
                { this.sortedBacteria.map((bacterium, index) => (
                    <FilterOverlaySwitchItem
                        key={bacterium.value}
                        item={bacterium}
                        selectedFilters={this.props.selectedFilters}
                        borderTop={index === 0}
                        selectionChangeHandler={
                            () => this.itemSelectionChangeHandler(bacterium)
                        }
                    />
                ))}

                { /* Substance Classes */ }
                <FilterOverlayTitle
                    title="Gram"
                    level={2}
                />
                { this.props.filterValues.getValuesForProperty('bacterium', 'gram')
                    .map((gram, index) => (
                        <FilterOverlaySwitchItem
                            key={gram.value}
                            item={gram}
                            selectedFilters={this.props.selectedFilters}
                            borderTop={index === 0}
                            selectionChangeHandler={
                                () => this.itemSelectionChangeHandler(gram)
                            }
                        />
                    ))
                }

                <FilterOverlayTitle
                    title="Shape"
                    level={2}
                />
                { this.shapes.map((shape, index) => (
                    <FilterOverlaySwitchItem
                        key={shape.value}
                        borderTop={index === 0}
                        item={shape}
                        selectedFilters={this.props.selectedFilters}
                        selectionChangeHandler={
                            () => this.itemSelectionChangeHandler(shape)
                        }
                    />
                )) }

                <FilterOverlayTitle
                    title="Metabolism"
                    level={2}
                />
                { this.metabolisms.map((metabolism, index) => (
                    <FilterOverlaySwitchItem
                        key={metabolism.niceValue}
                        item={metabolism}
                        selectedFilters={this.props.selectedFilters}
                        borderTop={index === 0}
                        selectionChangeHandler={
                            () => this.itemSelectionChangeHandler(metabolism)
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
