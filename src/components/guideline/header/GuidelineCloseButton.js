import React from 'react';
import { View, StyleSheet, TouchableWithoutFeedback } from 'react-native';

import GuidelineHeaderCloseButtonIcon from '../icons/GuidelineHeaderCloseButtonIcon.js';

/**
 * Shows a close button for guideline view headers on the right
 * - close the drawer (goto the matrix view) 
 *
 * @extends {React.Component}
 */
export default class GuidelineCloseButton extends React.Component {

    constructor(props) {
        super(props);

        this.closeGuidelines = this.closeGuidelines.bind(this);
    }

    /**
     * Close the guideline drawer model
     * the navigation will go back to the matrix view
     */
    closeGuidelines() {
        this.props.drawer.close();
    }

    render() {

        return (
            <TouchableWithoutFeedback
                onPress={this.closeGuidelines}
            >
                <View style={styles.container}>
                    <View style={styles.buttonIcon}>
                        <GuidelineHeaderCloseButtonIcon
                            height={18}
                            width={17} />
                    </View>
                </View>
            </TouchableWithoutFeedback>
        );
    }

}

const styles = StyleSheet.create({
    container: {
        right: 7,
        height: 40,
        width: 39,

        justifyContent: 'center',
        alignItems: 'center',
    },
});
