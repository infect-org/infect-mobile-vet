import React from 'react';
import { View, StyleSheet, TouchableHighlight, Text, ScrollView, Dimensions } from 'react-native';
import { observer } from 'mobx-react';
import { computed, reaction, trace } from 'mobx';
import { DangerZone } from 'expo';
import log from '../../helpers/log';
import styleDefinitions from '../../helpers/styleDefinitions';
import FilterOverlayTitle from '../filterOverlayTitle/FilterOverlayTitle';
import FilterOverlaySwitchItem from '../filterOverlaySwitchItem/FilterOverlaySwitchItem';
import componentStates from '../../models/componentStates/componentStates';

const { Animated } = DangerZone;
const padding = 20;
const maxScreenDimension = Math.max(
    Dimensions.get('window').width,
    Dimensions.get('window').height,
);

@observer
export default class FilterOverlay extends React.Component {

    top = new Animated.Value(maxScreenDimension);

    constructor(props) {
        super(props);
        props.componentStates.update('filters', componentStates.rendering);
    }

    componentDidMount() {
        // Well, well, well …
        // If we remove filterOverlay from DOM conditionally, it needs to re-render every time it
        // is displayed – which is slow and reduces the perceived performance. Instead, we move
        // the the overlay out of the screen (by whatever is greater, width or height, in case the
        // user rotates the device) and move it into the screen whenever it becomes visible. As
        // we use Animated.Values, no re-render is done, ever.
        reaction(
            () => this.props.filterOverlayModel.isVisible,
            (isVisible) => {
                log('FilterOverlay: Visibility changed to', isVisible);
                if (isVisible) this.top.setValue(0);
                else this.top.setValue(maxScreenDimension);
            },
        );

        log('FilterOverlay: Mounted');
        this.props.componentStates.update('filters', componentStates.ready);
    }

    handleApplyButtonPress() {
        this.props.filterOverlayModel.hide();
    }

    /**
     * Handles click on a filter: adds or removes item from/to selectedFilters
     * @private
     */
    itemSelectionChangeHandler(item) {
        log('FilterOverlay: Filter changed', item);
        const existing = this.props.selectedFilters.filters.indexOf(item) > -1;
        log('FilterOverlay: Filter already set?', existing);
        if (!existing) this.props.selectedFilters.addFilter(item);
        else this.props.selectedFilters.removeFilter(item);
    }

    isFilterSelected(item) {
        log('FilterOverlay: Is filter selected?', item);
        return this.props.selectedFilters.isSelected(item);
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
        trace();
        return this.props.filterValues.getValuesForProperty('substanceClass', 'name')
            .sort(this.sortByProperty('niceValue'));
        // Debug: Just return one item
        // .filter((item, index) => index === 0);
    }

    render() {

        log('FilterOverlay: Render');

        return (
            <Animated.View style={[styles.filterOverlayContainer, { top: this.top }]}>

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
                                selected={this.isFilterSelected(substanceClass)}
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

                { /* Apply filters button */ }
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
            </Animated.View>
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
        left: 0,
        right: 0,
        height: '100%',
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
