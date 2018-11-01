import React from 'react';
import { Text, StyleSheet } from 'react-native';
import { observer } from 'mobx-react';
import { computed, reaction, trace } from 'mobx';
import { DangerZone } from 'expo';
import styleDefinitions from '../../helpers/styleDefinitions';
import log from '../../helpers/log';

const { Animated } = DangerZone;

const {
    multiply,
    sub,
    divide,
} = Animated;

@observer
export default class BacteriumLabel extends React.Component {

    originalTop = new Animated.Value(0);
    top = new Animated.Value(0);
    width = new Animated.Value(0);
    widthSet = false;
    opacity = new Animated.Value(1);

    constructor(...props) {
        super(...props);
        this.setupAnimatedProps();
    }

    /**
     * Setup calculated animated values; this can only be done after properties are available.
     */
    setupAnimatedProps() {

        this.top = multiply(
            // Adjust top by the amount animatedZoom exceeds cappedLabelZoom
            divide(this.props.animatedZoom, this.props.cappedLabelZoom),
            this.originalTop,
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

        // Zoom label out when font would become larger than cappedLabelZoom
        this.cappedLabelZoomAdjustment = divide(
            this.props.cappedLabelZoom,
            this.props.animatedZoom,
        );


        reaction(
            () => this.props.matrix.yPositions.get(this.props.bacterium),
            (yPosition) => {
                if (yPosition) {
                    this.originalTop.setValue(yPosition.top);
                    this.opacity.setValue(1);
                } else {
                    this.opacity.setValue(0);
                }
            },
        );

    }


    labelLayoutHandler = (ev) => {
        // Make sure we only handle layout once; if not, we might run into an infinite loop.
        if (this.widthSet) return;
        const { width } = ev.nativeEvent.layout;
        this.width.setValue(width);
        this.props.bacterium.setWidth(width);
        this.widthSet = true;
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

    /**
     * If resistance of bacterium is displayed as ResistanceDetail (large circle), bacterium
     * is highlighted (background color). Returns the background color of the current bacterium.
     */
    @computed get activeBacteriumBackground() {
        if (
            this.props.matrix && this.props.matrix.activeResistance &&
            this.props.matrix.activeResistance.resistance.bacterium ===
            this.props.bacterium.bacterium
        ) {
            return styleDefinitions.colors.highlightBackground;
        }
        return 'transparent';
    }

    render() {

        trace();
        log('BacteriumLabel: Render bacterium label');

        // Use a View around the text because Text is not animatable
        return (
            <Animated.View
                style={[
                    styles.labelTextContainer,
                    {
                        width: this.labelWidth,
                        opacity: this.opacity,
                        transform: [{
                            scale: this.cappedLabelZoomAdjustment,
                        }, {
                            translateY: this.top,
                        }, {
                            translateX: this.left,
                        }],
                    },
                ]}
            >
                <Text
                    style={[
                        styles.labelText,
                        { backgroundColor: this.activeBacteriumBackground },
                    ]}
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
