import React from 'react';
import { View, StyleSheet, Text } from 'react-native';

/**
 * Shows a text/title for guideline view headers on the left
 *
 * @extends {React.Component}
 */
export default class GuidelineHeaderLeftTitle extends React.Component {

    render() {
        return (
            <View style={styles.headerLeft}>
                <Text style={styles.headerLeftText}>
                    {this.props.title}
                </Text>
            </View>
        );
    }

}

const styles = StyleSheet.create({
    headerLeft: {
        paddingLeft: 33,
    },
    headerLeftText: {
        color: '#FFF',
        fontSize: 20,
        fontWeight: 'bold',
    },
});
