import React from 'react';
import { ScrollView, View, StyleSheet, Text, TouchableHighlight } from 'react-native';
import { observable, action } from 'mobx';
import { observer } from 'mobx-react';
import styleDefinitions from '../../helpers/styleDefinitions';

@observer
export default class ErrorMessages extends React.Component {

    @observable isVisible = true
    @action hide() {
        this.isVisible = false;
    }

    constructor(props) {
        super(props);

        this.hide = this.hide.bind(this);
    }

    reloadApplication() {
        Expo.Util.reload();
    }

    render() {
        if (!this.isVisible) return null;

        return (
            <ScrollView style={ styles.errorContainer }>
                <View>
                    <Text style={ styles.errorTitle }>Error</Text>
                    { this.props.errors.map((err, index) => (
                        <View
                            key={ index }
                        >
                            <Text
                                style={ styles.errorText }>
                                { err.message }
                            </Text>
                            <View style={styles.seperator} />
                        </View>
                    )) }
                    <View style={styles.buttonContainer}>
                        <TouchableHighlight
                            style={styles.reloadButton}
                            onPress={() => { this.reloadApplication(); }}>
                            <Text style={styles.reloadText}>Reload</Text>
                        </TouchableHighlight>
                        <TouchableHighlight
                            style={styles.reloadButton}
                            onPress={this.hide}>
                            <Text style={styles.reloadText}>Close</Text>
                        </TouchableHighlight>
                    </View>
                </View>
            </ScrollView>
        );
    }

}

const styles = StyleSheet.create({
    errorContainer: {
        backgroundColor: styleDefinitions.colors.error,
        padding: 20,
    },
    seperator: {
        height: 1,
        backgroundColor: '#FFF',
        marginBottom: 10,
        opacity: 0.6,
    },
    errorText: {
        color: 'white',
        marginBottom: 10,
        fontSize: 16,
    },
    errorTitle: {
        color: 'white',
        fontWeight: 'bold',
        paddingBottom: 10,
        fontSize: 20,
    },
    buttonContainer: {
        flexDirection: 'row',
    },
    reloadButton: {
        marginTop: 20,
        borderRadius: 4,
        borderWidth: 2,
        borderColor: '#FFF',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 10,
        marginRight: 10,
    },
    reloadText: {
        color: '#FFF',
        fontSize: 20,
    },
});
