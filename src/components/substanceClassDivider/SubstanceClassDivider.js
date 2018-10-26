import React from 'react';
import { View, StyleSheet } from 'react-native';
import { observer } from 'mobx-react';
import { computed } from 'mobx';
import log from '../../helpers/log';

@observer
export default class SubstanceClassDivider extends React.Component {

    @computed get dividerStyle() {
        const { xPosition } = this.props.substanceClass;
        const style = {
            left: xPosition ? xPosition.left : 0,
            opacity: xPosition ? 1 : 0,
            backgroundColor: this.props.substanceClass.lineColor,
            height: this.matrixHeight,
            top: 0,
        };
        log(
            'Divider style, left is', style.left, 'for subsClass',
            this.props.substanceClass.substanceClass.name,
        );
        return style;
    }

    @computed get matrixHeight() {
        const height = ((this.props.matrix.defaultRadius * 2) + this.props.matrix.space) *
            this.props.matrix.sortedVisibleBacteria.length;
        log('Matrix: Height is', height);
        return height;
    }

    render() {
        return (
            <View
                style={ [
                    styles.substanceClassDivider,
                    this.dividerStyle,
                ] }
            />
        );
    }

}

const styles = StyleSheet.create({
    substanceClassDivider: {
        position: 'absolute',
        top: 0,
        width: StyleSheet.hairlineWidth,
    },
});
