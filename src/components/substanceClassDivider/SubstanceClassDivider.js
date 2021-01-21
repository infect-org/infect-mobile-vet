import React from 'react';
import { StyleSheet } from 'react-native';
import { observer } from 'mobx-react';
import { computed, reaction } from 'mobx';
import Animated from 'react-native-reanimated';
import log from '../../helpers/log';


@observer
export default class SubstanceClassDivider extends React.Component {

    opacity = new Animated.Value(1);

    constructor(...props) {
        super(...props);

        const xPosition = this.props.matrix.xPositions.get(this.props.substanceClass);
        this.xPosition = new Animated.Value(xPosition ? xPosition.left : 0);
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
                this.opacity.setValue(newXPosition ? 1 : 0);
                if (newXPosition) {
                    this.xPosition.setValue(newXPosition.left);
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
                    {
                        opacity: this.opacity,
                        left: this.xPosition,
                        height: this.animatedMatrixHeight,
                        backgroundColor: this.props.substanceClass.lineColor.toHexString(),
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
