import React from 'react';
import { View, StyleSheet } from 'react-native';
import { observer } from 'mobx-react';
import { computed } from 'mobx';
import FilterOverlaySwitchItem from '../filterOverlaySwitchItem/FilterOverlaySwitchItem';

/**
 * List for a some filters of the same type (e.g. substance classes). Pass either items
 * (pre-selected and sorted items of FilterValues) or property, name, filterValues and
 * sortProperty (optional).
 */
@observer
export default class FilterList extends React.Component {

    constructor(...props) {
        super(...props);
        this.itemSelectionChangeHandler = this.itemSelectionChangeHandler.bind(this);
    }

    /**
     * Change handler for FilterOverlaySwitchItem, toggles item in selectedFilters
     * @param  {Object} item        Item to toggle
     */
    itemSelectionChangeHandler(item) {
        this.props.selectedFilters.toggleFilter(item);
    }

    /**
     * Get items that shall be displayed in the list. Use items, if available, else fetch them from
     * filterValues.
     * @return {Array} Items to display in list
     */
    @computed get filterValues() {
        // Items property is available: Use those items directly
        if (this.props.items) return this.props.items;

        // Items property is not given: Get items by this.props.property and this.props.name, sort
        // them by this.props.sortProperty
        if (!this.props.name || !this.props.property) {
            throw new Error(`FilterList: If you don't pass in items, you must at least pass property and name props, you provided ${this.props.property} and ${this.props.name} instead.`);
        }
        const filterValues = this.props.filterValues.getValuesForProperty(
            this.props.property,
            this.props.name,
        );
        // Sort, if needed
        if (this.props.sortProperty) {
            const { sortProperty } = this.props;
            const sortFunction = (a, b) => (a[sortProperty] < b[sortProperty] ? -1 : 1);
            if (sortProperty) filterValues.sort(sortFunction);
        }
        // Limit to selected, if needed
        let filteredFilterValues = filterValues;
        if (this.props.limitToSelected) {
            filteredFilterValues = filterValues.filter(value =>
                this.props.selectedFilters.isSelected(value));
        }

        return filteredFilterValues;
    }

    render() {
        return (
            <View style={styles.container}>
                { this.filterValues.map((item, index) => (
                    <FilterOverlaySwitchItem
                        key={item.niceValue}
                        item={item}
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
