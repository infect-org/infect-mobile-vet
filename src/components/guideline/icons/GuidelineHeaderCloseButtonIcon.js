import React from 'react';
import { Svg } from 'expo';

export default class GuidelineHeaderCloseButtonIcon extends React.Component {

    render() {
        return (
            <Svg
                height={this.props.height}
                width={this.props.width}
                viewBox="0 0 19.373 19.373"
            >
                <Svg.G transform="translate(-338.313 -24.813)">
                    <Svg.Line
                        x1="17"
                        y2="18"
                        transform="translate(339.5 25.5)"
                        fill="none"
                        stroke="#fff"
                        strokeWidth="2"/>
                    <Svg.Line
                        x1="17"
                        y2="18"
                        transform="translate(357 26) rotate(90)"
                        fill="none"
                        stroke="#fff"
                        strokeWidth="2"/>
                </Svg.G>
            </Svg>
        );
    }

}
