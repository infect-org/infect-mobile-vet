import React from 'react';
import { StyleSheet, View, StatusBar } from 'react-native';
import { observer } from 'mobx-react';
import { configure, observable, action, trace } from 'mobx';
// import { Constants } from 'expo';
import Sentry from 'sentry-expo';
import InfectApp from 'infect-frontend-logic';
import appConfig from './app.json';
import FilterOverlayModel from './src/models/filterOverlayModel/FilterOverlayModel';

import config from './src/config';
// import styleDefinitions from './src/helpers/styleDefinitions';
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

    /**
     * Boah, that was a tough nut to crack: If we use a bool here, the whole app will re-render
     * every time it changes – while we only want to re-render the loading screen. To do so, we
     * have to use an object.
     * *If* we'd re-render the whole app, all gesture handlers on the matrix would be fucked up
     * after re-rendering is done (IDK why).
     * If you work on other parts than the matrix, just set done to true to display main screen
     * quickly.
     */
    @observable rendering = { done: false };

    constructor() {
        super();
        this.app = new InfectApp(config);
        this.setupApp();
        this.filterOverlay = new FilterOverlayModel();
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

    @action setRenderingDone(value) {
        log('App: Set rendering done to', value);
        this.rendering.done = value;
    }

    @observer
    render() {

        log('App: Render');
        trace();

        return (
            <View style={styles.container}>

                <StatusBar hidden={true} />

                { /* Render matrix as soon as data is ready (resistances are loaded last). */ }
                { this.app.resistances.status.identifier === 'ready' &&

                    <View style={styles.container}>
                        <MainView
                            filterOverlay={this.filterOverlay}
                            filterValues={this.app.filterValues}
                            selectedFilters={this.app.selectedFilters}
                            setRenderingDone={this.setRenderingDone.bind(this)}
                            matrix={this.app.views.matrix}
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
                        rendering={this.rendering}
                        resistancesStatusIdentifier={this.app.resistances.status.identifier}
                        bacteriaStatusIdentifier={this.app.bacteria.status.identifier}
                        antibioticsStatusIdentifier={this.app.antibiotics.status.identifier}
                    />
                </View>

                { /* Errors: At bottom to give it the highest z-index */ }
                { this.app.errorHandler.errors.length > 0 &&
                    <ErrorMessages
                        style={styles.errors}
                        errors={this.app.errorHandler.errors} />
                }

            </View>
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
});
