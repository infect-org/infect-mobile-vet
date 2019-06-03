import React from 'react';
import { AppState } from 'react-native';
import { observer } from 'mobx-react';
import { Analytics, ScreenHit } from 'expo-analytics';

import log from '../../helpers/log';

/**
 * This component tracks «screen hits» at google analytics.
 *
 * We do that if:
 * - componentDidMount
 * - app state changes to «active» and the last hit was longer then half an hour ago
 *
 * The screen name could be defined through the components «screenName» property.
 *
 * @extends {React.Component}
 */
@observer
export default class GoogleAnalytics extends React.Component {

    /**
     * The current app state like inactive, background, active.
     */
    appState = AppState.currentState

    /**
     * When was the app last reloaded?
     * We track to google analytics, if it comes to foreground after x minutes.
     */
    lastReload = new Date()

    constructor(...props) {
        super(...props);
        this.handleAppStateChange = this.handleAppStateChange.bind(this);

        if (!this.props.trackingKey) {
            throw new Error('GoogleAnalytics constructor: property «trackingKey» is missing! We need that so we know where to track your screen hit.');
        }

        // Setup Google Analytics
        this.googleAnalytics = new Analytics(this.props.trackingKey);
    }

    /**
     * Send a ScreenHit to Google Analytics.
     * Screen name is defined through the components «screenName» property.
     */
    trackPageHitAtGoogleAnalytics() {
        const screenName = this.props.screenName || 'undefined';

        this.googleAnalytics.hit(new ScreenHit(screenName))
            .then(() => {
                log(`GoogleAnalytics: added ScreenHit «${screenName}»!`);
            })
            .catch((e) => {
                log(`GoogleAnalytics: could not add ScreenHit «Home»: ${e.message}`);
            });
    }

    componentDidMount() {
        // Send a ScreenHit at Google Analytics.
        this.trackPageHitAtGoogleAnalytics();

        // Add a event listener for app state changes.
        AppState.addEventListener('change', this.handleAppStateChange);
    }

    componentWillUnmount() {
        // Remove the eventlistener for the app state changes.
        AppState.removeEventListener('change', this.handleAppStateChange);
    }

    /**
     * If we come from «inactive» or «brackground» state to the «active» state
     * and the last reload was longer then half an hour ago
     * we track a screen hit at google analytics.
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

    render() {
        return null;
    }

}
