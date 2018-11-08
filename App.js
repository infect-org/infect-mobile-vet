import React from 'react';
import { StyleSheet, View, StatusBar, SafeAreaView } from 'react-native';
import { observer } from 'mobx-react';
import { configure, reaction, trace } from 'mobx';
// import { Constants } from 'expo';
import Sentry from 'sentry-expo';
import InfectApp from 'infect-frontend-logic';
import appConfig from './app.json';
import componentStates from './src/models/componentStates/componentStates';
import FilterOverlayModel from './src/models/filterOverlayModel/FilterOverlayModel';
import ComponentStatesModel from './src/models/componentStatesModel/ComponentStatesModel';
import AnimatedWindowSize from './src/models/animatedWindowSize/AnimatedWindowSize';

import config from './src/config';
import styleDefinitions from './src/helpers/styleDefinitions';
import ErrorMessages from './src/components/errorMessages/ErrorMessages';
import LoadingScreen from './src/components/loadingScreen/LoadingScreen';
import MainView from './src/components/mainView/MainView';
import log from './src/helpers/log';


// Remove this once Sentry is correctly setup.
// See https://docs.expo.io/versions/latest/guides/using-sentry
Sentry.enableInExpoDevelopment = true;
Sentry.config('https://a5a5af5d0b8848e9b426b4a094de7707@sentry.io/1258537').install();

// Make sure MobX throws if we're not using actions
configure({ enforceActions: 'always' });

console.disableYellowBox = true;

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
export default class App extends React.Component {

    constructor() {
        super();
        this.app = new InfectApp(config);
        this.setupApp();

        this.handleSafeAreaLayoutChange = this.handleSafeAreaLayoutChange.bind(this);
        this.filterOverlayModel = new FilterOverlayModel();
        this.componentStates = new ComponentStatesModel();
        this.componentStates.setup();
        this.setupModelStateWatchers();
        this.windowSize = new AnimatedWindowSize();
    }

    componentDidMount() {
        console.log('StatusBar:', StatusBar.curentHeight);
    }

    /**
     * We want to have the current status of models/components at one central place – update
     * componentStates whenever models change
     */
    setupModelStateWatchers() {
        ['resistances', 'bacteria', 'antibiotics'].forEach((modelType) => {
            reaction(
                () => this.app[modelType].status.identifier,
                (status) => {
                    log('App: Update componentState of', modelType, 'to', status);
                    if (status === 'ready') {
                        const newState = modelType === 'bacteria' || modelType === 'antibiotics' ?
                            componentStates.ready : componentStates.rendering;
                        this.componentStates.update(modelType, newState);
                    }
                },
            );
        });
    }

    /**
     * Use separate setup method as it's async and we need to catch all async errors.
     */
    async setupApp() {
        try {
            await this.app.initialize();
        } catch (err) {
            this.app.errorHandler.handle(err);
            log('Error initializing app', err);
        }
        log('App: Initialized');
    }

    /**
     * We need to know the size of the safe area to draw the matrix within this area. Store it 
     * centrally in this.windowSize.
     */
    handleSafeAreaLayoutChange(ev) {
        console.log('handleSafeAreaLayoutChange', ev.nativeEvent.layout);
        this.windowSize.update(ev.nativeEvent.layout);
    }

    @observer
    render() {

        log('App: Render');
        trace();

        return (
            <SafeAreaView
                style={styles.mainContainer}
            >

                <StatusBar hidden={true} />

                <View
                    style={styles.container}
                    // We need to measure the layout of a direct descendant of SafeAreaView with
                    // full height/width (flex, not absolute!) to get the safe area's dimensions
                    onLayout={this.handleSafeAreaLayoutChange}
                    >

                    { /* Render matrix as soon as data is ready (resistances are loaded last). */ }
                    { this.app.resistances.status.identifier === 'ready' &&

                        <View style={styles.container}>
                            <MainView
                                filterOverlayModel={this.filterOverlayModel}
                                filterValues={this.app.filterValues}
                                selectedFilters={this.app.selectedFilters}
                                componentStates={this.componentStates}
                                matrix={this.app.views.matrix}
                                windowSize={this.windowSize}
                            />
                        </View>
                    }

                    { /* Loading screen
                         Don't render it conditionally. If we did, the whole app would re-render when
                         it or its opacity change and all gesture handlers on the matrix would not work
                         any more */ }
                    <View
                        style={styles.loadingScreenContainer}
                        pointerEvents="none"
                    >
                        <LoadingScreen
                            version={appConfig.expo.version}
                            componentStates={this.componentStates}
                        />
                    </View>

                    { /* Errors: At bottom to give it the highest z-index */ }
                    { this.app.errorHandler.errors.length > 0 &&
                        <ErrorMessages
                            style={styles.errors}
                            errors={this.app.errorHandler.errors} />
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
    errors: {
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
