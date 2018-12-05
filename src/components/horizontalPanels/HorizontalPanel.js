import React from 'react';
import { View, StyleSheet } from 'react-native';
import { observer } from 'mobx-react';

/**
 * Single panel of a HorizontalPanels component, will be moved horizontally when views change.
 * Props childIndex and childCount are injected by HorizontalPanels.
 */
@observer
export default class HorizontalPanel extends React.Component {

    render() {

        const left = this.props.containerWidth * this.props.childIndex;

        return (
            <View
                style={[
                    styles.panel,
                    {
                        left,
                        width: this.props.containerWidth,
                    },
                ]}>
                { this.props.children }
            </View>
        );
    }

}

const styles = StyleSheet.create({
    panel: {
        position: 'absolute',
        width: '100%',
        height: '100%',
        // borderWidth: 4,
        // borderColor: 'skyblue',
    },
});
