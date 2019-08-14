import React from 'react';
import { View, StyleSheet } from 'react-native';
import { observer } from 'mobx-react';
import { reaction } from 'mobx';
import { NavigationEvents } from 'react-navigation';
import Matrix from '../matrix/Matrix';
import FilterOverlay from '../filterOverlay/FilterOverlay';
import FilterButton from '../filterButton/FilterButton';
import GuidelineButton from '../guideline/GuidelineButton.js';
import log from '../../helpers/log';
import componentStates from '../../models/componentStates/componentStates';
import GoogleAnalytics from '../googleAnalytics/GoogleAnalytics.js';

import GuidelineController from '../../models/guideline/GuidelineController.js';

@observer
export default class MainView extends React.Component {

    constructor(...props) {
        super(...props);
        this.addAntibioticFilter = this.addAntibioticFilter.bind(this);
        this.addBacteriumFilter = this.addBacteriumFilter.bind(this);
        this.addPopulationFilter = this.addPopulationFilter.bind(this);

        // Setup the guideline controller
        this.guidelineController = new GuidelineController({
            selectedFilters: this.props.selectedFilters,
            filterValues: this.props.filterValues,
            guidelines: this.props.guidelines,
        });
    }

    addAntibioticFilter() {
        const antibiotics = this.props.filterValues.getValuesForProperty('antibiotic', 'name');
        if (antibiotics.length) {
            this.props.selectedFilters.toggleFilter(antibiotics[0]);
        }
    }

    addBacteriumFilter() {
        const bacteria = this.props.filterValues.getValuesForProperty('bacterium', 'name');
        if (bacteria.length) {
            const bacterium = bacteria[0];
            if (this.props.selectedFilters.isSelected(bacterium)) {
                this.props.selectedFilters.removeFilter(bacterium);
            } else {
                this.props.selectedFilters.addFilter(bacterium);
            }
        }
    }

    addPopulationFilter() {
        const regions = this.props.filterValues.getValuesForProperty('region', 'id');
        log('MainView: Regions', regions);
        if (regions.length) {
            const region = regions[0];
            if (this.props.selectedFilters.isSelected(region)) {
                this.props.selectedFilters.removeFilter(region);
            } else {
                this.props.selectedFilters.addFilter(region);
            }
        }

    }

    /**
     * Add reaction for guidelines:
     * If the guideline drawer model isOpen, show the diagnosislist
     * else show the matrix/main screen
     */
    componentDidMount() {
        reaction(
            () => this.props.drawer.isOpen,
            (isOpen) => {
                if (isOpen === true) {
                    this.props.navigation.navigate('Guideline', {
                        drawer: this.props.drawer,
                        guidelines: this.props.guidelines,
                    });
                } else {
                    this.props.navigation.navigate('Main');
                }
            },
        );
    }

    render() {

        log('MainView: Render');

        return (
            <View style={styles.container}>

                {/* If the user swipes (gesture) from Guideline Drawer,
                    we have to close our Drawer model, otherwise we couldn't open it anymore */}
                <NavigationEvents
                    onDidFocus={() => this.props.drawer.close()}
                />

                {/* Track screen hits */}
                <GoogleAnalytics
                    screenName="Home"
                    googleAnalytics={this.props.googleAnalytics}
                />

                <Matrix
                    style={styles.matrix}
                    matrix={this.props.matrix}
                    selectedFilters={this.props.selectedFilters}
                    componentStates={this.props.componentStates}
                    windowSize={this.props.windowSize}
                    guidelines={this.props.guidelines}
                    guidelineController={this.guidelineController}
                />

                { /* Filter overlay button; no feedback needed as it opens overlay and
                     TouchableHighlight flickers on click (maybe because of shadow) */ }
                <View style={styles.filterButtonContainer} >
                    <FilterButton
                        matrix={this.props.matrix}
                        filterOverlayModel={this.props.filterOverlayModel}
                        selectedFilters={this.props.selectedFilters}
                    />
                </View>

                {/* Guideline button:
                    - open diagnosis list
                    - clear selected diagnosis
                */}
                <View style={styles.guidelineButtonContainer} >
                    <GuidelineButton
                        drawer={this.props.drawer}
                        selectedGuideline={this.props.guidelines.selectedGuideline}
                    />
                </View>

                { /* Just for testing (adds antibiotic to filters */ }
                { /* <TouchableHighlight onPress={this.addAntibioticFilter}>
                    <View
                        style={{
                            width: 20,
                            height: 20,
                            backgroundColor: 'navy',
                            position: 'absolute',
                            bottom: 20,
                            left: 20,
                        }}
                    />
                </TouchableHighlight>
                <TouchableHighlight onPress={this.addBacteriumFilter}>
                    <View
                        style={{
                            width: 20,
                            height: 20,
                            backgroundColor: 'salmon',
                            position: 'absolute',
                            bottom: 20,
                            left: 50,
                        }}
                    />
                </TouchableHighlight>
                <TouchableHighlight onPress={this.addPopulationFilter}>
                    <View
                        style={{
                            width: 20,
                            height: 20,
                            backgroundColor: 'deepskyblue',
                            position: 'absolute',
                            bottom: 20,
                            left: 80,
                        }}
                    />
                </TouchableHighlight>
                */ }




                { /* Filter overlay */ }
                { /* Only render when everything's ready to prevent multiple (expensive)
                     re-renderings whenever a filter is added */ }
                { (this.props.componentStates.highestComponentStates.get('resistances') >=
                    componentStates.rendering) &&
                    <FilterOverlay
                        filterOverlayModel={this.props.filterOverlayModel}
                        filterValues={this.props.filterValues}
                        selectedFilters={this.props.selectedFilters}
                        componentStates={this.props.componentStates}
                        windowSize={this.props.windowSize}
                        selectedGuideline={this.props.guidelines.selectedGuideline}
                    />
                }
            </View>
        );
    }

}

const styles = StyleSheet.create({
    filterButtonContainer: {
        // borderWidth: 1,
        // borderColor: 'deepskyblue',
        // On Android, container serves as boundary  for button, has overflow:hidden. We must
        // therefore extend it on the right and bottom.
        height: 70,
        width: 70,
        position: 'absolute',
        right: 0,
        bottom: 0,
    },
    guidelineButtonContainer: {
        position: 'absolute',
        right: 78,
        bottom: 18,
    },
    container: {
        flex: 1,
        // If we have a transparent background color, splash screen will appear below content on
        // android (only for regular builds, not if run in Expo though)
        backgroundColor: 'white',
    },
});
