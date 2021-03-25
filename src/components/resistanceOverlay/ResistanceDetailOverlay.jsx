import React from 'react';
import {
    View,
    StyleSheet,
    Text,
} from 'react-native';
import { observer } from 'mobx-react';
import log from '../../helpers/log.js';
import styleDefinitions from '../../helpers/styleDefinitions.js';

const padding = 20;

@observer
export default class ResistanceDetailOverlay extends React.Component {

    render() {

        return (
            <View style={styles.filterOverlay}>

                { /* Filter list (main filters) */ }
                <View style={styles.filterOverlayMainContent}>

                    <Text>detail</Text>

                </View>

            </View>

        );

    }

}

const styles = StyleSheet.create({
});
