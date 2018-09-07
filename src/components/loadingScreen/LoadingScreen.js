import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { computed } from 'mobx';
import { observer } from 'mobx-react';
import InfectLogo from '../infectLogo/InfectLogo';
import styleDefinitions from '../../helpers/styleDefinitions';
import log from '../../helpers/log';

@observer
export default class LoadingScreen extends React.Component {

    logoWidth = 150;

    getStatusText(originalLoadingStatus) {
        return originalLoadingStatus === 'loading' ? 'loading …' : 'ready';
    }

    @computed get resistanceStatus() {
        if (this.props.resistancesStatusIdentifier === 'loading') return 'loading …';
        return 'rendering …';
    }

    @computed get opacity() {
        return { opacity: this.props.rendering.done ? 0 : 1 };
    }

    render() {
        log('Render loading screen');
        return (
            <View style={[styles.loadingScreenContainer, this.opacity]}>

                <View style={[
                    styles.logoOuterContainer,
                    { height: this.logoWidth * 20.25 / 64.6 },
                ]}>
                    <View style={styles.logoInnerContainer}>
                        <InfectLogo
                            width={this.logoWidth}
                            height={this.logoWidth * 20.25 / 64.6} />
                    </View>
                </View>

                <Text style={styles.loadingScreenVersionText}>
                    Version {this.props.version}
                </Text>
                <Text style={styles.loadingScreenEntityStatus}>
                    Bacteria: {this.getStatusText(this.props.bacteriaStatusIdentifier)}
                </Text>
                <Text style={styles.loadingScreenEntityStatus}>
                    Antibiotics:{'\u00A0'}
                    {this.getStatusText(this.props.antibioticsStatusIdentifier)}
                </Text>
                <Text style={styles.loadingScreenEntityStatus}>
                    Resistances: {this.resistanceStatus}
                </Text>
            </View>
        );
    }

}

const styles = StyleSheet.create({
    loadingScreenContainer: {
        flex: 1,
        backgroundColor: styleDefinitions.colors.green,
        alignItems: 'center',
        justifyContent: 'center',
    },
    logoOuterContainer: {
        width: '100%',
        marginBottom: 20,
    },
    logoInnerContainer: {
        // borderWidth: 1,
        // borderColor: 'purple',
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingScreenVersionText: {
        ...styleDefinitions.fonts.bold,
        fontSize: 14,
        marginBottom: 20,
    },
    loadingScreenEntityStatus: {
        ...styleDefinitions.fonts.condensed,
        fontSize: 14,
    },
});
