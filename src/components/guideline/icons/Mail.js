import React from 'react';
import { Svg } from 'expo';

export default class Mail extends React.Component {

    render() {
        return (
            <Svg
                height={this.props.height}
                width={this.props.width}
                viewBox="0 0 15.5 11.5"
            >
                <Svg.G transform="translate(0.25 -3.204)">
                    <Svg.Rect width="14" height="10" rx="1" transform="translate(0.5 3.954)" stroke-width="1.5" stroke="#3289cc" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
                    <Svg.Path d="M14.056,4.536l-6.483,5.3-6.483-5.3" transform="translate(-0.239 0.764)" fill="none" stroke="#3289cc" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"/>
                </Svg.G>
            </Svg>
        );
    }

}
