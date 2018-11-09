import React from 'react';
import { View, StyleSheet, Image } from 'react-native';
import { observer } from 'mobx-react';
import { computed } from 'mobx';
import componentStates from '../../models/componentStates/componentStates';

const loadingIndicator = require('../../../assets/infect-animated-loading-indicator.gif');

@observer
export default class LoadingOverlay extends React.Component {

    /**
     * Show overlay if resistances are not ready *and* only after initial load is done
     */
    @computed get show() {
        console.log(
            'LoadingOverlay: show?',
            this.props.componentStates.components.get('resistances'),
        );
        return this.props.componentStates.allHighestStatesAreReady &&
            this.props.componentStates.components.get('resistances') !== componentStates.ready;
    }

    render() {
        console.log('LoadingOverlay: render');
        return (
            <View style={styles.container}>
                { this.show &&
                    <View style={styles.background}>
                        <View style={styles.loadingIndicatorContainer}>
                            <Image
                                source={loadingIndicator}
                                style={styles.loadingIndicator}
                                resizeMode="contain"
                            />
                        </View>
                    </View>
                }
            </View>
        );
    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    background: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
    },
    loadingIndicatorContainer: {
        width: 160,
        height: 88,
        // borderWidth: 1,
        // borderColor: 'pink',
    },
    loadingIndicator: {
        // See https://medium.com/the-react-native-log/tips-for-react-native-images-or-saying-goodbye-to-trial-and-error-b2baaf0a1a4d
        height: undefined,
        width: undefined,
        flex: 1,
    },
});
