import React from 'react';
import { Text, StyleSheet } from 'react-native';
import { observer } from 'mobx-react';
import { computed, reaction } from 'mobx';
import { DangerZone } from 'expo';
import styleDefinitions from '../../helpers/styleDefinitions';
import log from '../../helpers/log';

const { Animated } = DangerZone;

const {
    add,
    multiply,
    sub,
    divide,
} = Animated;

@observer
export default class BacteriumLabel extends React.Component {

    top = 0;
    left = 0;

    width = 0;

    constructor(...props) {
        super(...props);
        reaction(
            () => this.props.matrix.defaultRadius && this.props.containerHeight,
            () => {
                this.setupAnimatedProps();
                this.forceUpdate();
            },
        );
    }

    /**
     * We must update our Animated stuff whenever new data is available or the old values won't be
     * available any more. TODO: Use setValue when it becomes available
     */
    setupAnimatedProps() {
        // TODO: When setValue is available, use setValue, move top and baseTop to
        // class props, remove forceUpdate!
        const { top } = this.props.matrix.yPositions.get(this.props.bacterium);
        log('BacteriumLabel: Top is', top, 'containerHeight is', this.props.containerHeight);

        // Adjust top by the amount animatedZoom exceeds cappedLabelZoom
        this.top = multiply(
            divide(this.props.animatedZoom, this.props.cappedLabelZoom),
            // yPosition is used as center by resistance. Move up by half the label's height
            // sub(top, divide(this.height, 2)),
            top,
        );

        // Adjust left by the amount animatedZoom exceeds cappedLabelZoom. As we shrink the label
        // when zoom increases, we have to move in the opposite direction.
        this.left = multiply(
            sub(
                divide(this.props.animatedZoom, this.props.cappedLabelZoom),
                1,
            ),
            this.width,
            0.5,
        );

    }


    labelLayoutHandler = (ev) => {
        // Make sure we only handle layout once; if not, we might run into an infinite loop.
        if (this.width) return;
        const { width, height } = ev.nativeEvent.layout;
        this.width = width;
        this.height = height;
        this.props.bacterium.setWidth(width);
    };

    @computed get labelWidth() {
        // If we don't know the col width yet, use auto so that we can measure the label's real
        // size
        return this.props.matrix.defaultRadius ?
            this.props.matrix.bacteriumLabelColumnWidth * this.props.maxZoom : 'auto';
    }

    @computed get shortName() {
        return this.props.bacterium.bacterium.name
            .split(' ')
            .map((subName, index) => (index === 0 ?
                subName.substr(0, 4) :
                `${subName.substr(0, 2)}.`
            ))
            .join(' ');
    }

    render() {

        if (this.props.matrix.defaultRadius) this.setupAnimatedProps();

        // Zoom label out when font would become larger than cappedLabelZoom
        const cappedLabelZoomAdjustment = divide(
            this.props.cappedLabelZoom,
            this.props.animatedZoom,
        );

        log('BacteriumLabel: Render bacterium label', this.shortName, 'at', this.transform);

        // Use a View around the text because Text is not animatable
        return (
            <Animated.View
                style={[
                    styles.labelTextContainer,
                    {
                        width: this.labelWidth,
                        transform: [{
                            scale: cappedLabelZoomAdjustment,
                        }, {
                            translateY: this.top,
                        }, {
                            translateX: this.left,
                        }],
                    },
                ]}
            >
                <Text
                    style={styles.labelText}
                    onLayout={this.labelLayoutHandler}>
                    {this.shortName}
                </Text>
            </Animated.View>
        );
    }

}

const styles = StyleSheet.create({
    labelTextContainer: {
        position: 'absolute',
        right: 0,
        // borderWidth: 1,
        // borderColor: 'pink',
    },
    labelText: {
        ...styleDefinitions.fonts.condensed,
        ...styleDefinitions.label,
        textAlign: 'right',
        // borderWidth: 1,
        // borderColor: 'deeppink',
    },
});
