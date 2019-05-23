import React from 'react';
import { View, StyleSheet, TouchableHighlight, AppState } from 'react-native';
import { observer } from 'mobx-react';
import { PageHit } from 'expo-analytics';
import Matrix from '../matrix/Matrix';
import FilterOverlay from '../filterOverlay/FilterOverlay';
import FilterButton from '../filterButton/FilterButton';
import log from '../../helpers/log';
import componentStates from '../../models/componentStates/componentStates';

@observer
export default class MainView extends React.Component {

    /**
     * the current app state like inactive, background, active
     *
     */
    appState = AppState.currentState

    /**
     * when was the app last reloaded?
     * we track to google analytics, if it comes to foreground after x minutes
     */
    lastReload = new Date()

    constructor(...props) {
        super(...props);
        this.addAntibioticFilter = this.addAntibioticFilter.bind(this);
        this.addBacteriumFilter = this.addBacteriumFilter.bind(this);
        this.addPopulationFilter = this.addPopulationFilter.bind(this);
        this.handleAppStateChange = this.handleAppStateChange.bind(this);
    }

    /**
     * send a PageHit at Google Analytics
     */
    trackPageHitAtGoogleAnalytics() {
        this.props.googleAnalytics.hit(new PageHit('Home'))
            .then(() => {
                console.log('GoogleAnalytics: added PageHit «Home»!');
            })
            .catch((e) => {
                console.log(`GoogleAnalytics: could not add PageHit «Home»: ${e.message}`);
            });
    }

    componentDidMount() {
        // send a PageHit at Google Analytics
        this.trackPageHitAtGoogleAnalytics();

        // add event listener for app state changes
        AppState.addEventListener('change', this.handleAppStateChange);
    }

    componentWillUnmount() {
        // remove the eventlistener for the app state
        AppState.removeEventListener('change', this.handleAppStateChange);
    }

    /**
     * this function is used for tracking app state changes
     * if we come from inactive or brackground to active and the last reload was longer
     * then half an hour, we track a page hit at google analytics
     *
     * @param {String} nextAppState
     */
    handleAppStateChange(nextAppState) {
        if (this.appState.match(/inactive|background/) && nextAppState === 'active') {
            if ((Math.abs(new Date() - this.lastReload) / 1000) >= 1800) {
                this.lastReload = new Date();
                this.trackPageHitAtGoogleAnalytics();
            }
        }
        this.appState = nextAppState;
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


    render() {

        log('MainView: Render');

        return (
            <View style={styles.container}>
                <Matrix
                    style={styles.matrix}
                    matrix={this.props.matrix}
                    selectedFilters={this.props.selectedFilters}
                    componentStates={this.props.componentStates}
                    windowSize={this.props.windowSize}
                />

                { /* Filter overlay button; no feedback needed as it opens overlay and
                     TouchableHighlight flickers on click (maybe because of shadow) */ }
                <View style={styles.filterButtonContainer} >
                    <FilterButton
                        matrix={this.props.matrix}
                        filterOverlayModel={this.props.filterOverlayModel}
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
    container: {
        flex: 1,
        // If we have a transparent background color, splash screen will appear below content on
        // android (only for regular builds, not if run in Expo though)
        backgroundColor: 'white',
    },
});
