import React from 'react';
import { Svg, Path } from 'react-native-svg';

/**
 * SVG checkmark for filter overlay switch item.
 */
export default class FilterIcon extends React.Component {

    render() {
        return (
            <Svg height={this.props.height} width={this.props.width} viewBox="0 0 32 32">
                <Path
                    d="M18.545,30.835V16.594L31.981,3.158V0H0V3.158L13.436,16.594v9.1Z"
                    fill={this.props.fillColor}
                />
            </Svg>
        );
    }

}
