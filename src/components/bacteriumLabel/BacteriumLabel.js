import React from 'react';
import { Text, StyleSheet } from 'react-native';
import { observer } from 'mobx-react';
import { computed, reaction } from 'mobx';
import Animated from 'react-native-reanimated';
import styleDefinitions from '../../helpers/styleDefinitions';
import log from '../../helpers/log';

const {
    Value,
    multiply,
    sub,
    divide,
} = Animated;

@observer
export default class BacteriumLabel extends React.Component {

    // baseTop = new Value(0);
    // top = multiply(this.props.additionalLabelSpacingIncrease, this.baseTop);
    top = 0;

    layoutHandled = false;

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
        this.baseTop = new Value(top);
        this.top = sub(
            // Main calculation: Multiply spacing increase with the regular top of the
            // label
            multiply(
                this.props.additionalLabelSpacingIncrease,
                this.baseTop,
            ),
            // Now, as react-native's only transform origin is 'center center', we have to
            // move the labels up when zooming in to fake a central transform origin for
            // our extended label spacing …
            multiply(
                // Multiply half of the label container's height …
                divide(this.props.containerHeight, 2),
                // … with what we zoomed in above the max (minus 1)
                sub(this.props.additionalLabelSpacingIncrease, 1),
            ),
        );
    }


    labelLayoutHandler = (ev) => {
        // Make sure we only handle layout once; if not, we might run into an infinite loop.
        if (this.layoutHandled) return;
        const { width } = ev.nativeEvent.layout;
        this.props.bacterium.setWidth(width);
        this.layoutHandled = true;
    };

    @computed get labelStyle() {
        // If we don't know the col width yet, use auto so that we can measure the label's real
        // size
        const width = this.props.matrix.defaultRadius ?
            this.props.matrix.bacteriumLabelColumnWidth * this.props.maxZoom : 'auto';
        return { width };
    }

    /* @computed get transform() {
        if (!this.props.matrix.defaultRadius) return [];
        const { top } = this.props.matrix.yPositions.get(this.props.bacterium);
        log('BacteriumLabel: Top position is', top);
        return [{
            translateY: top,
        }];
    } */

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

        log('BacteriumLabel: Render bacterium label', this.shortName, 'at', this.transform);

        // Use a View around the text because Text is not animatable
        return (
            <Animated.View
                style={[
                    styles.labelTextContainer,
                    this.labelStyle,
                    {
                        transform: [{
                            translateY: this.top,
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
    },
    labelText: {
        ...styleDefinitions.fonts.condensed,
        ...styleDefinitions.label,
        textAlign: 'right',
        // borderWidth: 2,
        // borderColor: 'deeppink',
    },
});
