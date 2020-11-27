import React from 'react';
import * as Svg from 'react-native-svg';

/**
 * SVG checkmark for filter overlay switch item.
 */
export default class FilterOverlaySwitchItemCheckMark extends React.Component {

    render() {
        return (
            <Svg height={this.props.height} width={this.props.width} viewBox="0 0 20 20">
                <Svg.Path
                    d="M2,12L9,18L18,0"
                    fill="none"
                    stroke={this.props.strokeColor}
                    strokeWidth={this.props.strokeWidth}
                />
            </Svg>
        );
    }

}
