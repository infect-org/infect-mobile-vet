import React from 'react';
import { View, Text, StyleSheet, TouchableWithoutFeedback, AsyncStorage } from 'react-native';
import { observable, action } from 'mobx';
import { observer } from 'mobx-react';

@observer
export default class CorruptDataOverlay extends React.Component {

    @observable isVisible = false
    @action show() {
        this.isVisible = true;
    }
    @action hide() {
        this.setHiddenInStorage();
        this.isVisible = false;
    }

    constructor(props) {
        super(props);
        this.hide = this.hide.bind(this);
    }

    async setHiddenInStorage() {
        await AsyncStorage.setItem('corruptDataHidden', '1');
    }

    async componentDidMount() {
        const now = new Date();
        const doNotShowAnymoreDate = new Date(2019, 9, 1, 23, 59, 59, 999);

        const hiddenByStorage = await AsyncStorage.getItem('corruptDataHidden');

        if (now <= doNotShowAnymoreDate && hiddenByStorage === null) {
            this.show();
        }
    }

    render() {
        if (!this.isVisible) return null;

        return (
            <View style={styles.container}>
                <TouchableWithoutFeedback
                    onPress={this.hide}
                    style={styles.container}
                >
                    <View>
                        <Text style={styles.closeX}>
                            X
                        </Text>
                        <Text style={
                            styles.text
                        }>
                            From September 26, 11:10h, to September 27, 14:40h 
                            (Swiss local time, UTC+2), incorrect resistance data was displayed due 
                            to a technical error. We urge users to verify all data obtained during 
                            this period and apologise for any inconveniences. We have undertaken 
                            additional steps to prevent such errors in the future.
                        </Text>
                    </View>
                </TouchableWithoutFeedback>
            </View>
        );
    }

}

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        backgroundColor: '#ff7828',
        zIndex: 2000000,
    },
    text: {
        color: '#FFF',
        padding: 30,
        paddingRight: 80,
    },
    closeX: {
        position: 'absolute',
        top: 30,
        right: 30,
        color: '#FFF',
        fontSize: 16,
    },
});
