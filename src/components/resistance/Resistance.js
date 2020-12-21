import React from 'react';
import { StyleSheet } from 'react-native';
import { observer } from 'mobx-react';
import { computed, reaction } from 'mobx';
import Animated from 'react-native-reanimated';
import styleDefinitions from '../../helpers/styleDefinitions.js';
import log from '../../helpers/log.js';


/**
 * Renders a resistance cirlce with text.
 * TODO: We might improve performance if we only had 1 tap event listener for the whole matrix
 * (instead of one per resistance).
 */
@observer
export default class Resistance extends React.Component {

    /**
     * We need to extend small circles; if a small circle contains '100' as susceptibility, 100
     * will break like this:
     * 1
     * 0
     * 0
     * Which is really bad. Android does not support overflow:visible, therefore we have to use
     * a workaround.
     */
    circleMinWidth = 40;


    /**
     * Use Animated.Values to not re-render Resistance everytime something changes.
     */
    opacity = Animated.cond(
        /**
        * Only display resistance if corresponding anitibiotic and bacterium are visible (not
        * hidden through filters)
        */
        Animated.and(
            this.props.animatedAntibiotic.opacity,
            this.props.animatedBacterium.opacity,
        ),
        /**
         * *If* corresponding antibiotic and bacterium are visible, set opacity to
         * - 0.5 if sample size is <= 20
         * - 1.0 if sample size is > 20
         */
        Animated.cond(
            Animated.lessOrEq(this.props.resistance.mostPreciseValue.sampleSize, 20),
            0.5,
            1,
        ),
        // If corresponding antibiotic or bacterium is not visible, also hide resistance
        0,
    );

    radius = new Animated.Value(this.props.resistance.radius);

    top = Animated.sub(this.props.animatedBacterium.top, this.radius);
    left = Animated.add(
        Animated.sub(
            this.props.animatedAntibiotic.left,
            this.circleMinWidth / 2,
        ),
        this.props.matrix.defaultRadius,
    );

    diameter = Animated.multiply(this.radius, 2);
    circleTop = Animated.sub(
        this.props.matrix.defaultRadius,
        this.props.matrix.space,
    );
    circleLeft = Animated.divide(
        Animated.sub(this.circleMinWidth, this.diameter),
        2,
    );
    // F***ng Android needs f***ing  dimensions for f***ing resistance container.
    // containerWidth = Animated.add(this.diameter, this.circleLeft);
    containerHeight = Animated.add(this.diameter, this.circleTop);




    /**
     * If resistance becomes invisible, don't change position to minimize DOM manipulations.
     * @type {Object}
     * @private
     */
    previousValues = { left: undefined, visible: undefined };


    /**
     * By updating Animated.Values (instead of using regular variables), we speed up the filtering
     * process a *lot* as components don't need to be re-rendered whenever a filter changes.
     */
    componentDidMount() {

        log('Resistance: Mounted');

        // Update amount of rendered resistances in matrix; display loading indicator as long
        // as resistances are not ready.
        this.props.onRender();

        reaction(
            () => this.props.resistance.radius,
            (radius) => {
                log('Resistance: Update radius to', radius);
                this.radius.setValue(radius);
            },
        );

    }

    @computed get value() {
        const bestValue = this.props.resistance.mostPreciseValue;
        // If bestValue is 1, return 1, else .xx (without leading 0); resistance is between 0 and 1)
        const resistance = bestValue.value === 1 ? 1 : bestValue.value.toFixed(2).substr(1);
        // Return susceptibility, not resistance
        return Math.round((1 - resistance) * 100);
    }

    render() {

        log('Resistance: Render');

        return (
            <Animated.View
                style={[
                    styles.resistance,
                    {
                        left: this.left,
                        top: this.top,
                    },
                    {
                        width: this.circleMinWidth,
                        height: this.containerHeight,
                    },
                    { opacity: this.opacity },
                ]}
            >


                { /* Only make the circle tappable: The text is wider than the circle as we
                     don't want line breaks or ellipses */ }

                { /* Circle with background */}
                <Animated.View
                    style={[
                        styles.resistanceCircle,
                        {
                            backgroundColor: this.props.resistance.backgroundColor.toHexString(),
                            borderRadius: this.radius,
                            width: this.diameter,
                            height: this.diameter,
                            left: this.circleLeft,
                            top: this.circleTop,
                        },
                    ]}
                />

                { /* Text */ }
                <Animated.Text
                    style={[
                        styles.resistanceText,
                        /* Use this.circleMinWidth as width so that text doesn't break */
                        {
                            color: this.props.resistance.fontColor.toHexString(),
                            width: this.circleMinWidth,
                            top: this.radius,
                        },
                    ]}
                >
                    {this.value}
                </Animated.Text>


            </Animated.View>
        );
    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    resistance: {
        // borderWidth: 1,
        // borderColor: 'skyblue',
        position: 'absolute',
        overflow: 'hidden', // Force same behavior on all platforms
    },
    resistanceCircle: {
        position: 'absolute',
    },
    resistanceText: {
        ...styleDefinitions.fonts.condensed,
        ...styleDefinitions.label,
        textAlign: 'center',
        position: 'absolute',
        left: 0,
    },
});
