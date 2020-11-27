import React from 'react';
import * as Svg from 'react-native-svg';

export default class GuidelineIconArrowLeft extends React.Component {

    render() {
        return (
            <Svg
                height={this.props.height}
                width={this.props.width}
                viewBox="0 0 11.483 20.137">
                <Svg.Path
                    d="M831,95.426l9.362,9.362L831,114.149"
                    transform="translate(841.776 114.856) rotate(180)"
                    fill="none"
                    stroke={this.props.stroke}
                    stroke-width="2"/>
            </Svg>
        );
    }

}
