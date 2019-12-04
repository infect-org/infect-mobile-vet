import React from 'react';
import { ScrollView, View, StyleSheet, Text, TouchableHighlight } from 'react-native';
import { observable, action } from 'mobx';
import { observer } from 'mobx-react';
import styleDefinitions from '../../helpers/styleDefinitions';

const { colors } = styleDefinitions;

@observer
export default class NotificationMessages extends React.Component {

    colorMapping = {
        warning: {
            background: colors.warningBackground,
            text: colors.warningText,
        },
        notification: {
            background: colors.notificationBackground,
            text: colors.notificationText,
        },
        error: {
            background: colors.error,
            text: colors.white,
        },
    }

    @observable isVisible = true

    constructor(props) {
        super(props);

        this.hide = this.hide.bind(this);
    }

    @action hide() {
        this.isVisible = false;
    }

    getNotificationColors(notification) {
        return this.colorMapping[notification.severity] || this.colorMapping.error;
    }

    render() {
        if (!this.isVisible) return null;

        return (
            <ScrollView style={styles.notificationContainer}>
                <View>
                    {this.props.notifications.map((notification, index) => (
                        <View
                            key={index}
                            style={[styles.messageContainer, {
                                backgroundColor: this.getNotificationColors(notification).background,
                            }]}
                        >
                            <Text style={[
                                styles.notificationTitle,
                                {
                                    color: this.getNotificationColors(notification).text,
                                },
                            ]}>{notification.severity}</Text>
                            <Text
                                style={[
                                    styles.notificationText,
                                    {
                                        color: this.getNotificationColors(notification).text,
                                    },
                                ]}>
                                {notification.message}
                            </Text>
                            <View style={styles.separator} />
                        </View>
                    ))}
                    <View style={styles.buttonContainer}>
                        <TouchableHighlight
                            style={styles.closeButton}
                            onPress={this.hide}>
                            <Text style={styles.closeButtonText}>Close</Text>
                        </TouchableHighlight>
                    </View>
                </View>
            </ScrollView>
        );
    }

}

const styles = StyleSheet.create({
    notificationContainer: {
        backgroundColor: styleDefinitions.colors.white,
    },
    messageContainer: {
        padding: 20,
    },
    separator: {
        height: 1,
        backgroundColor: '#FFF',
        marginBottom: 10,
        opacity: 0.6,
    },
    notificationText: {
        marginBottom: 10,
        fontSize: 16,
    },
    notificationTitle: {
        fontWeight: 'bold',
        paddingBottom: 10,
        fontSize: 20,
    },
    buttonContainer: {
        flexDirection: 'row',
    },
    closeButton: {
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
    closeButtonText: {
        color: styleDefinitions.colors.black,
        fontSize: 20,
    },
});
