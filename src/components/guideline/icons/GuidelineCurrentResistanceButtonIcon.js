import React from 'react';
import { Svg } from 'expo';

export default class GuidelineCurrentResistanceButtonIcon extends React.Component {

    render() {
        return (
            <Svg
                height={this.props.height}
                width={this.props.width}
                viewBox="0 0 24 24">
                <Svg.G
                    transform="translate(0)">
                    <Svg.Ellipse
                        cx="3.111"
                        cy="3.111"
                        rx="3.111"
                        ry="3.111"
                        fill="#3289cc"/>
                    <Svg.Ellipse
                        cx="3.111"
                        cy="3.111"
                        rx="3.111"
                        ry="3.111"
                        transform="translate(0 8.889)"
                        fill="#3289cc"/>
                    <Svg.Ellipse
                        cx="3.111"
                        cy="3.111"
                        rx="3.111"
                        ry="3.111"
                        transform="translate(0 17.778)"
                        fill="#3289cc"/>
                    <Svg.Ellipse
                        cx="3.111"
                        cy="3.111"
                        rx="3.111"
                        ry="3.111"
                        transform="translate(8.889)"/>
                    <Svg.Ellipse
                        cx="3.111"
                        cy="3.111"
                        rx="3.111"
                        ry="3.111"
                        transform="translate(8.889 8.889)"
                        fill="#3289cc"/>
                    <Svg.Ellipse
                        cx="3.111"
                        cy="3.111"
                        rx="3.111"
                        ry="3.111"
                        transform="translate(8.889 17.778)"/>
                    <Svg.Ellipse
                        cx="3.111"
                        cy="3.111"
                        rx="3.111"
                        ry="3.111"
                        transform="translate(17.778)"/>
                    <Svg.Ellipse
                        cx="3.111"
                        cy="3.111"
                        rx="3.111"
                        ry="3.111"
                        transform="translate(17.778 8.889)"
                        fill="#3289cc"/>
                    <Svg.Ellipse
                        cx="3.111"
                        cy="3.111"
                        rx="3.111"
                        ry="3.111"
                        transform="translate(17.778 17.778)"/>
                </Svg.G>
            </Svg>
        );
    }

}
