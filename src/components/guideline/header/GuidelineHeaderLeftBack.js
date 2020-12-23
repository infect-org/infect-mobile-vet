import React from 'react';
import { View, StyleSheet, Text, TouchableWithoutFeedback } from 'react-native';

import GuidelinIconArrowLeft from '../icons/GuidelineIconArrowLeft.js';

/**
 * The Left-Back button for guideline view headers
 * jumps one view back in navigation
 *
 * @extends {React.Component}
 */
export default class GuidelineHeaderLeftBack extends React.Component {

    constructor(props) {
        super(props);
        this.goBack = this.goBack.bind(this);
    }

    /**
     * Go to overview of guidelines. If user opens diagnosis detail directly via «Show Guidelines»
     * button in matrix (after a diagnosis was selected), this button should not go back to
     * the Main view, but to the overview.
     */
    goBack() {
        this.props.navigation.navigate('Guideline', {
            screen: 'GuidelineList',
        });
    }

    render() {
        return (
            <TouchableWithoutFeedback
                onPress={this.goBack}
            >
                <View style={styles.headerLeft}>
                    <GuidelinIconArrowLeft
                        width={9.3}
                        height={18.7}
                        stroke='#FFF'
                    />
                    <Text style={styles.headerLeftText}>
                        Back
                    </Text>
                </View>
            </TouchableWithoutFeedback>
        );
    }

}

const styles = StyleSheet.create({
    headerLeft: {
        flexDirection: 'row',
        paddingLeft: 10,
        paddingRight: 5,
    },
    headerLeftText: {
        color: '#FFF',
        fontSize: 16,
        marginLeft: 7,
    },
});
