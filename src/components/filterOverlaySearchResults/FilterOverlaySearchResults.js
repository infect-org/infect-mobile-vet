import React from 'react';
import { View, StyleSheet, Keyboard } from 'react-native';
import { observer } from 'mobx-react';
import { computed, action } from 'mobx';
import log from '../../helpers/log.js';
import FilterOverlaySwitchItem from '../filterOverlaySwitchItem/FilterOverlaySwitchItem.js';


/**
 * Displays a list of results for the searchTerm entered through the filter overlay. Handles clicks
 * on results.
 */
@observer
export default class FilterOverlaySearchResults extends React.Component {

    /**
     * Computes and returns filter items that match the current search term.
     * @return {Array}   Filter items that match the current searchTerm. For better description,
     *                   see this.getKey()
     */
    @computed get matches() {
        const matches = this.props.filterValues.search(this.props.searchTerm).slice(0, 15);
        log('Matches are %o', matches);
        return matches;
    }

    /**
     * When looping through matches, we need a key. Create a unique key from the match's data.
     * @param  {Object} matchItem    A filterValue returned by propertyMap.search (see frontend-
     *                               logic repo). Is an object with an entity type (e.g.
     *                               "bacterium"), a property (e.g. "name") and a value (e.g.
     *                               "Achromobacter sp.")
     * @return {String}              Unique key for the matchItem
     */
    getKey(matchItem) {
        return `${matchItem.property.entityType}-${matchItem.property.name}-${matchItem.value}`;
    }

    /**
     * Change handler for tapping on a search result. Toggles the tapped item in selectedFilters.
     * @param  {Object} selectedSearchResult        Item (search result) to toggle
     */
    @action.bound itemSelectionChangeHandler(selectedSearchResult) {
        this.props.resetSearchTerm();
        this.props.selectedFilters.toggleFilter(selectedSearchResult);
        // As we use keyboardShouldPersistTaps="always", keyboard must be closed manually. Must be
        // done after we resetSearchTerm or it will pop up again.
        Keyboard.dismiss();
    }


    render() {
        return (
            <View style={ styles.container }>
                { this.matches.map((match, index) => (
                    <FilterOverlaySwitchItem
                        item={match}
                        key={ this.getKey(match) }
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
