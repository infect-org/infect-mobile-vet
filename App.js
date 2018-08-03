import React from 'react';
import { StyleSheet, View, Text, StatusBar } from 'react-native';
import { observer } from 'mobx-react';
import { useStrict, observable, computed, action } from 'mobx';
import { Constants } from 'expo';
import StatusBarHeight from '@expo/status-bar-height';
import InfectApp from 'infect-frontend-logic';
import Matrix from './src/components/matrix/Matrix';
import styleDefinitions from './src/helpers/styleDefinitions';

useStrict(true);

@observer
export default class App extends React.Component {

    @observable renderingDone = false;
    @observable statusBarHeight = 0;

    constructor() {
        super();

        const config = {
            endpoints: {
                apiPrefix: 'https://rda.infect.info/',
                bacteria: 'pathogen.bacterium',
                antibiotics: 'substance.compound',
                resistances: 'rda.data',
                substanceClasses: 'substance.substanceClass',
                regions: 'generics.region',
                countries: 'generics.country',
                ageGroups: 'generics.ageGroup',
            },
        };

        this.app = new InfectApp(config);
        console.log('App: Initialized: %o', this.app);
    }

    @action setStatusBarHeight(height) {
        console.log('Status bar height changed to', height);
        this.statusBarHeight = height;
    }

    @computed get statusBarStyles() {
        const styles = {
            height: this.statusBarHeight,
        };
        console.log('Status bar styles are', styles);
        return styles;
    }

    handleLayoutChange = () => {
        // In case we need to update this, possible options for handling status bar height are:
        // - Expo.Constants
        // - StatusBarIOS (old react native code)
        // - https://github.com/expo/status-bar-height
        StatusBarHeight.getAsync().then(height => this.setStatusBarHeight(height));
    }

    @computed get resistanceStatus() {
        if (this.app.resistances.status.identifier === 'loading') return 'loading …';
        if (this.renderingDone === false) return 'rendering …';
        return 'ready';
    }

    getStatusText(originalLoadingStatus) {
        return originalLoadingStatus === 'loading' ? 'loading …' : 'ready';
    }

    @action setRenderingDone(value) {
        console.log('App: Set rendering done to', value);
        this.renderingDone = value;
    }

    @observer
    render() {
        return (
            <View
                style={ styles.container }
                onLayout={ this.handleLayoutChange }>

                <StatusBar hidden={ true } />
                { /* Cover status bar */ }
                <View style={ [this.statusBarStyles] } />

                { this.renderingDone === false &&
                    <View style={ styles.loadingScreen }>
                        <Text style={ styles.loadingScreenMainText }>INFECT App</Text>
                        <Text style={ styles.loadingScreenEntityStatus }>
                            Bacteria: { this.getStatusText(this.app.bacteria.status.identifier) }
                        </Text>
                        <Text style={ styles.loadingScreenEntityStatus }>
                            Antibiotics:{'\u00A0'}
                            { this.getStatusText(this.app.antibiotics.status.identifier) }
                        </Text>
                        <Text style={ styles.loadingScreenEntityStatus }>
                            Resistances: { this.resistanceStatus }
                        </Text>
                    </View>
                }
                { /* Render matrix as soon as data is ready; let it be hidden by loadingOverlay
                     until all resistances are rendered */ }
                { this.app.resistances.status.identifier === 'ready' &&
                    <Matrix
                        style={ styles.matrix }
                        matrix={ this.app.views.matrix }
                        selectedFilters={ this.app.selectedFilters }
                        setRenderingDone={ this.setRenderingDone.bind(this) }
                    />
                }
            </View>
        );
    }
}


const styles = StyleSheet.create({
    loadingScreen: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        backgroundColor: '#cbe264',
        alignItems: 'center',
        justifyContent: 'center',
    },
    loadingScreenMainText: {
        ...styleDefinitions.base,
        fontSize: 20,
    },
    loadingScreenEntityStatus: {
        ...styleDefinitions.base,
        fontSize: 14,
        top: 30,
    },
    matrix: {
        flex: 1,
    },
    container: {
        flex: 1,
    },
});
