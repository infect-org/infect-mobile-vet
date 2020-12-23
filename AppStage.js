import React from 'react';
import { StyleSheet, View, StatusBar, Text, LogBox } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { observer } from 'mobx-react';
import { configure, reaction, computed, observable, action } from 'mobx';
import Sentry from 'sentry-expo';
import { storeStatus } from '@infect/frontend-logic';
import { Analytics } from 'expo-analytics';
import appConfig from './app.json';
import componentStates from './src/models/componentStates/componentStates.js';
import FilterOverlayModel from './src/models/filterOverlayModel/FilterOverlayModel.js';
import ComponentStatesModel from './src/models/componentStatesModel/ComponentStatesModel.js';
import AnimatedWindowSize from './src/models/animatedWindowSize/AnimatedWindowSize.js';

import config from './src/config.js';
import styleDefinitions from './src/helpers/styleDefinitions.js';
import NotificationMessages from './src/components/errorMessages/NotificationMessages.js';
import InitialLoadingScreen from './src/components/initialLoadingScreen/InitialLoadingScreen.js';
import LoadingOverlay from './src/components/loadingOverlay/LoadingOverlay.js';
import MainView from './src/components/mainView/MainView.js';
import log from './src/helpers/log.js';



// Remove this once Sentry is correctly setup.
// See https://docs.expo.io/versions/latest/guides/using-sentry
// Sentry.enableInExpoDevelopment = true;
Sentry.config('https://a5a5af5d0b8848e9b426b4a094de7707@sentry.io/1258537').install();

// Make sure MobX throws if we're not using actions
configure({ enforceActions: 'always' });

LogBox.ignoreAllLogs();

/**
 * Basic app. Especially handles
 * - App (models) setup
 * - Basic layout (matrix, errors, loading screen)
 * - Status bar (don't display it at all) – we probably could remove all corresponding except
 *   <StatusBar hidden={ true } />; not sure if view that covers status bar is needed.
 *
 * Logging:
 * - Errors are logged to sentry (see app.json)
 * - Regular logs (imported from helpers/log) are logged to console (if testing locally) and
 *   loggly.com (for published apps)
 */
@observer
export default class AppStage extends React.Component {

    // For rendering the matrix, we have to know the window dimensions
    @observable dimensionsAreKnown = false
    @action handleDimensionChange(weKnowTheDimension) {
        this.dimensionsAreKnown = weKnowTheDimension;
    }

    constructor(...props) {

        super(...props);

        /**
         * Disable Font-Scaling through the Text-Size accessibility settings
         * https://stackoverflow.com/questions/41807843/how-to-disable-font-scaling-in-react-native-for-ios-app/51414341
         * https://facebook.github.io/react-native/docs/text#allowfontscaling
         */
        Text.defaultProps = Text.defaultProps || {};
        Text.defaultProps.allowFontScaling = false;


        // View models for mobile app
        this.filterOverlayModel = new FilterOverlayModel();
        this.componentStates = new ComponentStatesModel();
        this.componentStates.setup();
        this.setupModelStateWatchers();
        this.windowSize = new AnimatedWindowSize();

        this.handleSafeAreaLayoutChange = this.handleSafeAreaLayoutChange.bind(this);

        // Setup Google Analytics
        this.googleAnalytics = new Analytics(config.appKeys.googleAnalytics);
        this.googleAnalytics.addCustomDimension(1, 'MobileApp');
    }

    /**
     * We want to have the current status of models/components at one central place – update
     * componentStates whenever the models (stores from infect-frontend-logic) status changes
     * TODO: Clean this up!
     */
    setupModelStateWatchers() {
        ['resistances', 'bacteria', 'antibiotics'].forEach((modelType) => {
            reaction(
                () => this.props.app[modelType].status.identifier,
                (status) => {
                    log(
                        'App: Update componentState of',
                        modelType,
                        'to fetcher status',
                        status,
                    );
                    if (status === storeStatus.loading) {
                        this.componentStates.update(modelType, componentStates.loading);
                    }
                    // status is a fetcher state, not a componentState state!
                    if (status === storeStatus.ready) {
                        // Resistance: Go to rendering state, will change to ready when rendering is
                        // done. For antibiotics and bacteria, go straight to ready (we don't watch
                        // their rendering state).
                        if (
                            modelType === 'resistances' &&
                            // After initial loading screen was displayed, go from loading to ready
                            // again (rendering won't be observed!)
                            !this.componentStates.allHighestStatesAreReady
                        ) {
                            this.componentStates.update(modelType, componentStates.rendering);
                        } else {
                            this.componentStates.update(modelType, componentStates.ready);
                        }
                    }
                },
            );
        });
    }

    /**
     * Show matrix once resistances were loaded (don't redraw matrix if population filters are set
     * and resistances status switches back to loading)
     */
    @computed get showMatrix() {
        return this.componentStates.highestComponentStates.get('resistances') >=
            componentStates.rendering;
    }

    /**
     * We need to know the size of the safe area to draw the matrix within this area. Store it
     * centrally in this.windowSize.
     */
    handleSafeAreaLayoutChange(ev) {
        log('handleSafeAreaLayoutChange', ev.nativeEvent.layout);
        this.windowSize.update(ev.nativeEvent.layout);

        if (this.windowSize.height > 0 && this.windowSize.width > 0) {
            this.handleDimensionChange(true);
        }
    }

    render() {

        log('App: Render');

        return (
            <SafeAreaView
                style={styles.mainContainer}
                forceInset={{ right: 'never' }}
            >

                <StatusBar hidden={true} />

                <View
                    style={styles.container}
                    // We need to measure the layout of a direct descendant of SafeAreaView with
                    // full height/width (flex, not absolute!) to get the safe area's dimensions
                    onLayout={this.handleSafeAreaLayoutChange}
                >

                    { /* Render matrix as soon as data is ready (resistances are loaded last). */ }
                    {
                        // Don't check resistances loading status here: Will switch back to
                        // 'loading' when population filters are set/removed, App.js will re-render
                        // this.props.app.antibiotics.status.identifier === 'ready' &&
                        // this.props.app.bacteria.status.identifier === 'ready' &&
                        // TODO: Switch to bact/ab loaded to speed things up (a little bit)
                        this.showMatrix && this.dimensionsAreKnown &&

                        <View style={styles.container}>
                            <MainView
                                filterOverlayModel={this.filterOverlayModel}
                                filterValues={this.props.app.filterValues}
                                selectedFilters={this.props.app.selectedFilters}
                                componentStates={this.componentStates}
                                matrix={this.props.app.views.matrix}
                                drawer={this.props.app.views.drawer}
                                windowSize={this.windowSize}
                                googleAnalytics={this.googleAnalytics}
                                navigation={this.props.navigation}
                                route={this.props.route}
                                guidelines={this.props.app.guidelines}
                                guidelineRelatedFilters={this.props.app.guidelineRelatedFilters}
                                notificationCenter={this.props.app.notificationCenter}
                            />
                        </View>
                    }

                    { /* Loading screen for initlal load (with logo and states)
                         Don't render it conditionally. If we did, the whole app would re-render
                         when it or its opacity change and all gesture handlers on the matrix would
                         not work any more */ }
                    <View
                        style={styles.loadingScreenContainer}
                        pointerEvents="none"
                    >
                        <InitialLoadingScreen
                            version={appConfig.expo.version}
                            componentStates={this.componentStates}
                        />
                    </View>

                    { /* Loading screen for population filters (after initial load) */ }
                    <View
                        style={styles.loadingScreenContainer}
                        pointerEvents="none"
                    >
                        <LoadingOverlay
                            componentStates={this.componentStates}
                        />
                    </View>

                    { /* Errors: At bottom to give it the highest z-index */ }
                    { this.props.app.notificationCenter.notifications.length > 0 &&
                        <View style={styles.notifications}>
                            <NotificationMessages
                                notifications={this.props.app.notificationCenter.notifications}
                            />
                        </View>
                    }

                </View>
            </SafeAreaView>
        );
    }
}


const styles = StyleSheet.create({
    loadingScreenContainer: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
    },
    notifications: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
    },
    container: {
        flex: 1,
    },
    mainContainer: {
        flex: 1,
        backgroundColor: styleDefinitions.colors.black,
        overflow: 'hidden',
    },
});
