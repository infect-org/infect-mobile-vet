import React from 'react';
import { StyleSheet } from 'react-native';
import { observer } from 'mobx-react';
import { computed, reaction } from 'mobx';
import { DangerZone } from 'expo';
import log from '../../helpers/log';

const { Animated } = DangerZone;

@observer
export default class SubstanceClassDivider extends React.Component {


    constructor(...props) {
        super(...props);

        const xPosition = this.props.matrix.xPositions.get(this.props.substanceClass);
        this.xPosition = new Animated.Value(xPosition ? xPosition.left : 0);
        this.opacity = new Animated.Value(xPosition ? 1 : 0);
        this.animatedMatrixHeight = new Animated.Value(this.matrixHeight);

        reaction(
            () => this.props.matrix.xPositions.get(this.props.substanceClass),
            (newXPosition) => {
                log(
                    'SubstanceClassDivider: Update xPosition for',
                    this.props.substanceClass.substanceClass.name,
                    'to',
                    xPosition,
                );
                if (newXPosition) {
                    this.xPosition.setValue(newXPosition.left);
                    this.opacity.setValue(1);
                } else {
                    this.opacity.setValue(0);
                }
            },
        );

        reaction(
            () => this.matrixHeight,
            height => this.animatedMatrixHeight.setValue(height),
        );

    }

    @computed get matrixHeight() {
        const height = ((this.props.matrix.defaultRadius * 2) + this.props.matrix.space) *
            this.props.matrix.sortedVisibleBacteria.length;
        // log('SubstanceClassDivider: Height is', height);
        return height;
    }

    render() {

        log('SubstanceClassDivider: Render');

        return (
            <Animated.View
                style={ [
                    styles.substanceClassDivider,
                    this.dividerStyle,
                    {
                        left: this.xPosition,
                        opacity: this.opacity,
                        height: this.animatedMatrixHeight,
                        backgroundColor: this.props.substanceClass.lineColor,
                    },
                ] }
            />
        );
    }

}

const styles = StyleSheet.create({
    substanceClassDivider: {
        // borderWidth: 10,
        // borderColor: 'navy',
        position: 'absolute',
        top: 0,
        width: StyleSheet.hairlineWidth,
    },
});
