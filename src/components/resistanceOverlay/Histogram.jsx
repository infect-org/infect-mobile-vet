import React from 'react';
import { observer } from 'mobx-react';
import { computed } from 'mobx';
import {
    Svg,
    G,
    Text,
    Line,
    Rect,
} from 'react-native-svg';
import { Dimensions, StyleSheet } from 'react-native';
import styleDefinitions from '../../helpers/styleDefinitions.js';

export default @observer class Histogram extends React.Component {

    // 40: Subtract padding
    height = Math.min(Dimensions.get('window').width, Dimensions.get('window').height) - 40;
    width = this.height;

    // Sample sizes may be quite large
    yAxisLabelsWidth = 70;
    xAxisLabelsHeight = 50;
    gapBetweenBars = 10;

    fontSize = 14;
    tickWidth = 6;

    @computed get yAxisMax() {
        console.log('data', this.props.data);
        return this.props.data.reduce((prev, item) => (
            Math.max(prev, item.sampleCount)
        ), 0);
    }

    @computed get yScaleFactor() {
        // 0.95: Don't touch the sky
        const availableHeight = this.height * 0.95 - this.xAxisLabelsHeight;
        return availableHeight / this.yAxisMax;
    }

    @computed get xAxisMax() {
        return this.sortedSlots.slice().pop().toValue;
    }

    @computed get xAxisMin() {
        return this.sortedSlots.slice().shift().fromValue;
    }

    @computed get xAxisWidth() {
        // 0.95: Make sure we don't touch the right end; especially with axis labels that are
        // centered
        return (this.width * 0.95) - this.yAxisLabelsWidth;
    }

    @computed get sortedSlots() {
        return this.props.data.slice().sort((a, b) => (a.fromValue - b.fromValue));
    }

    getTicks(maxValue, logScale) {
        if (logScale) {
            const maxLogValue = Math.ceil(Math.log2(this.xAxisMax));
            return Array.from({ length: 6 }).map((item, index, array) => (
                2 ** (maxLogValue - array.length + index + 1)
            ));
        }
        // Division factor: By what do we have to divide value in order to get a one-digit number
        // (between 1 and 10)?
        const divisionFactor = 10 ** Math.floor(Math.log10(maxValue));
        const oneDigit = maxValue / divisionFactor;
        // Define tick size for the number between 0 and 10, then multiply back to orignal again
        const tickSizes = [0.1, 0.2, 0.5, 0.5, 0.5, 1, 1, 1, 1, 1];
        const normalizedTickSize = tickSizes[Math.floor(oneDigit)];
        const tickSize = normalizedTickSize * divisionFactor;
        // + 1: To add 0 tick
        const amountOfTicks = Math.floor(maxValue / tickSize) + 1;
        return Array.from({ length: amountOfTicks })
            .map((item, index) => index * tickSize)
            // JS fucks up numbers as usual; make them readable
            .map((item) => {
                const numbersAfterPoint = item === 0 ? 0 : Math.max(0, Math.log10(item) * -1) + 2;
                return parseFloat(item.toFixed(numbersAfterPoint));
            });
    }

    getXPosition(value) {
        if (this.props.scale === 'log') {
            const min = 0.001;
            // 0 is not a good value, as log2(0) is Infinity; fake it.
            if (value === 0) value = min;
            // Make sure xAxisMax and xAxisMin are not 0; log2 of 0 is Infinity (therefore we use
            // || 1 and || -1)
            const maxLogValue = Math.ceil(Math.log2(this.xAxisMax || min));
            // If scale is log, values might be below 0 (Math.log2(0.5)) is e.g. -1
            // If xAxisMin > 1, use 0 to not start xAxis above 0
            const minLogValue = Math.min(0, Math.floor(Math.log2(this.xAxisMin || min)));
            // If minLogValue === maxLogValue, we'll divide by 0
            const xScale = this.xAxisWidth / (maxLogValue - minLogValue);
            const result = this.yAxisLabelsWidth + (Math.log2(value) * xScale) - (minLogValue * xScale);
            return result;
        }
        return this.yAxisLabelsWidth + (value * (this.xAxisWidth / this.xAxisMax));
    }

    @computed get getXAxisLabels() {
        return this.getTicks(this.xAxisMax, this.props.scale === 'log');
    }

    @computed get getYAxisLabels() {
        return this.getTicks(this.yAxisMax, false);
    }

    render() {
        return (
            <Svg viewBox={`0 0 ${this.width} ${this.height}`} height={this.height} width={this.width} style={{fill: 'blue'}}>

                { /* y axis */ }
                <G>
                    <Line
                        x1={this.yAxisLabelsWidth}
                        y1={0}
                        x2={this.yAxisLabelsWidth}
                        y2={this.height - this.xAxisLabelsHeight}
                        stroke={styleDefinitions.colors.black}
                    />
                    {this.getYAxisLabels.map((label, index) => (
                        <G key={label}>
                            <Text
                                x={this.yAxisLabelsWidth - 10}
                                y={this.height - this.xAxisLabelsHeight - (label * this.yScaleFactor) + (this.fontSize / 2)}
                                textAnchor="end"
                                fill={styleDefinitions.colors.black}
                            >
                                {label}
                            </Text>
                            <Line
                                x1={this.yAxisLabelsWidth - this.tickWidth}
                                y1={this.height - this.xAxisLabelsHeight - (label * this.yScaleFactor)}
                                x2={this.yAxisLabelsWidth}
                                y2={this.height - this.xAxisLabelsHeight - (label * this.yScaleFactor)}
                                stroke={styleDefinitions.colors.black}
                            />
                        </G>
                    ))}
                    <G
                        transform={`translate(${this.fontSize}, ${(this.height - this.xAxisLabelsHeight) / 2})`}
                    >
                        <Text
                            fill={styleDefinitions.colors.black}
                            transform={'rotate(270) translate(-60, 5)'}
                        >
                            Number of Isolates (N)
                        </Text>
                    </G>
                </G>

                { /* x axis */ }
                <G>
                    <Line
                        x1={this.yAxisLabelsWidth}
                        y1={this.height - this.xAxisLabelsHeight}
                        x2={this.width}
                        y2={this.height - this.xAxisLabelsHeight}
                        stroke={styleDefinitions.colors.black}
                    />
                    {this.getXAxisLabels.map((label, index) => (
                        <G key={label}>
                            <Text
                                x={this.getXPosition(label)}
                                y={this.height - this.xAxisLabelsHeight + this.fontSize + this.tickWidth}
                                textAnchor="middle"
                                fill={styleDefinitions.colors.black}
                            >
                                {label}
                            </Text>
                            <Line
                                x1={this.getXPosition(label)}
                                y1={this.height - this.xAxisLabelsHeight}
                                x2={this.getXPosition(label)}
                                y2={this.height - this.xAxisLabelsHeight + this.tickWidth}
                                stroke={styleDefinitions.colors.black}
                            />
                        </G>
                    ))}
                    <Text
                        textAnchor="middle"
                        y={this.height - this.fontSize / 2}
                        x={this.yAxisLabelsWidth + (this.width - this.yAxisLabelsWidth) / 2 + 8}
                        fill={styleDefinitions.colors.black}
                    >
                        {this.props.xAxisLabel}
                    </Text>
                </G>

                { /* Bars */ }
                <G>
                    {this.sortedSlots.map((slot, index) => (
                        <Rect
                            key={slot.fromValue}
                            x={this.getXPosition(slot.fromValue)}
                            width={this.getXPosition(slot.toValue) - this.getXPosition(slot.fromValue)}
                            y={this.height - this.xAxisLabelsHeight - slot.sampleCount * this.yScaleFactor}
                            height={slot.sampleCount * this.yScaleFactor}
                            stroke={styleDefinitions.colors.black}
                            fill={styleDefinitions.colors.resistances.mediumBackground}
                        />
                    ))}
                    { /* Mic90 */ }
                    {this.props.mic90 &&
                        <G>
                            <Line
                                x1={this.getXPosition(this.props.mic90)}
                                y1={0}
                                x2={this.getXPosition(this.props.mic90)}
                                y2={this.height - this.xAxisLabelsHeight}
                                strokeDasharray="4"
                                stroke={styleDefinitions.colors.resistances.darkBackground}
                            />
                            <Text
                                x={this.getXPosition(this.props.mic90)}
                                y={this.fontSize}
                                textAnchor="middle"
                                fill={styleDefinitions.colors.black}
                            >
                                MIC90
                            </Text>
                        </G>
                    }
                </G>

            </Svg>
        );
    }

}

const styles = {
    axis: {
        fill: styleDefinitions.colors.black,
    },
};
