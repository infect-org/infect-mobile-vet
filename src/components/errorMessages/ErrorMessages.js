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

    getBackgroundColor(notification) {
        let color;

        switch (notification.severity) {
            case 'warning':
                color = styleDefinitions.colors.warningBackground;
                break;
            case 'notification':
                color = styleDefinitions.colors.notificationBackground;
                break;
            default:
                color = styleDefinitions.colors.error;
                break;
        }

        return color;
    }

    getTextColor(notification) {
        let color;

        switch (notification.severity) {
            case 'warning':
                color = styleDefinitions.colors.warningText;
                break;
            case 'notification':
                color = styleDefinitions.colors.notificationText;
                break;
            default:
                color = styleDefinitions.colors.white;
                break;
        }

        return color;
    }

    render() {
        if (!this.isVisible) return null;

        return (
            <ScrollView style={ styles.errorContainer }>
                <View>
                    { this.props.errors.map((err, index) => (
                        <View
                            key={ index }
                            style={[styles.messageContainer, {
                                backgroundColor: this.getBackgroundColor(err),
                            }]}
                        >
                            <Text style={[
                                styles.errorTitle,
                                {
                                    color: this.getTextColor(err),
                                },
                            ]}>{err.severity}</Text>
                            <Text
                                style={[
                                    styles.errorText,
                                    {
                                        color: this.getTextColor(err),
                                    },
                                ]}>
                                { err.message }
                            </Text>
                            <View style={styles.seperator} />
                        </View>
                    )) }
                    <View style={styles.buttonContainer}>
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
        backgroundColor: styleDefinitions.colors.white,
    },
    messageContainer: {
        padding: 20,
    },
    seperator: {
        height: 1,
        backgroundColor: '#FFF',
        marginBottom: 10,
        opacity: 0.6,
    },
    errorText: {
        marginBottom: 10,
        fontSize: 16,
    },
    errorTitle: {
        fontWeight: 'bold',
        paddingBottom: 10,
        fontSize: 20,
    },
    buttonContainer: {
        flexDirection: 'row',
    },
    reloadButton: {
        marginTop: 20,
        marginLeft: 20,
        marginBottom: 20,
        borderRadius: 4,
        borderWidth: 2,
        borderColor: styleDefinitions.colors.black,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 10,
        marginRight: 10,
    },
    reloadText: {
        color: styleDefinitions.colors.black,
        fontSize: 20,
    },
});
