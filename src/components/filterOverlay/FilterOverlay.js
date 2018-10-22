import React from 'react';
import { View, StyleSheet, TouchableHighlight, Text, ScrollView } from 'react-native';
import { observer } from 'mobx-react';
import { computed } from 'mobx';
import log from '../../helpers/log';
import styleDefinitions from '../../helpers/styleDefinitions';
import FilterOverlayTitle from '../filterOverlayTitle/FilterOverlayTitle';
import FilterOverlaySwitchItem from '../filterOverlaySwitchItem/FilterOverlaySwitchItem';

const padding = 20;

@observer
export default class FilterOverlay extends React.Component {

    handleApplyButtonPress() {
        this.props.filterOverlay.hide();
    }

    /**
     * Handles click on a filter: adds or removes item from/to selectedFilters
     * @private
     */
    itemSelectionChangeHandler(item) {
        log('FilterOverlay: Filter changed', item);
        // const existing = this.props.selectedFilters.filters.indexOf(item) > -1;
        // if (!existing) this.props.selectedFilters.addFilter(item);
        // else this.props.selectedFilters.removeFilter(item);
    }

    /**
     * Sorts values by a given property
     * @private
     */
    sortByProperty(property) {
        return (a, b) => (a[property] < b[property] ? -1 : 1);
    }

    /**
     * Returns all substance classes, sorted by niceValue
     * @private
     */
    @computed get sortedSubstanceClassFilters() {
        return this.props.filterValues.getValuesForProperty('substanceClass', 'name')
            .sort(this.sortByProperty('niceValue'));
    }

    render() {
        return (
            <View style={styles.filterOverlayContainer}>

                <View style={styles.container}>
                    <ScrollView>
                        <FilterOverlayTitle title="Antibiotics"/>
                        <FilterOverlayTitle title="Substance" followsTitle={true} level={2}/>
                        <FilterOverlayTitle
                            title="Substance Classes"
                            followsTitle={true}
                            level={2}
                        />
                        { this.sortedSubstanceClassFilters.map((substanceClass, index) => (
                            <FilterOverlaySwitchItem
                                key={substanceClass.value}
                                name={substanceClass.niceValue}
                                borderTop={index === 0}
                                selected={true}
                                selectionChangeHandler={
                                    () => this.itemSelectionChangeHandler(substanceClass)
                                }
                            />
                        )) }


                        <FilterOverlaySwitchItem
                            name="Test"
                            borderTop={true}
                            selected={true}
                            selectionChangeHandler={this.itemSelectionChangeHandler.bind(this)}
                        />
                        <FilterOverlaySwitchItem
                            name="Test2"
                            selectionChangeHandler={this.itemSelectionChangeHandler.bind(this)}
                        />
                        <FilterOverlayTitle title="Substance Class" level={2}/>
                    </ScrollView>
                </View>

                <View style={styles.applyFiltersButtonContainer}>
                    <TouchableHighlight
                        onPress={this.handleApplyButtonPress.bind(this)}
                        style={styles.container}
                    >
                        <View style={styles.applyFiltersButton}>
                            <View style={styles.applyFiltersButtonTextContainer}>
                                <Text style={styles.applyFiltersButtonText}>
                                    Apply filters
                                </Text>
                            </View>
                        </View>
                    </TouchableHighlight>
                </View>
            </View>
        );
    }

}

const styles = StyleSheet.create({
    applyFiltersButtonContainer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: 60,
        // borderColor: 'skyblue',
        // borderWidth: 1,
    },
    applyFiltersButton: {
        position: 'absolute',
        left: padding,
        right: padding,
        height: 50,
        top: 0,
        borderRadius: 5,
        backgroundColor: styleDefinitions.colors.green,
        ...styleDefinitions.shadows.primaryButton,
    },
    applyFiltersButtonTextContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    applyFiltersButtonText: {
        ...styleDefinitions.fonts.bold,
        fontSize: 25,
        textAlign: 'center',
    },
    filterOverlayContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: styleDefinitions.colors.darkBackgroundGrey,
    },
    container: {
        flex: 1,
    },
    /* contentPadding: {
        paddingLeft: padding,
        paddingRight: padding,
    }, */
});
