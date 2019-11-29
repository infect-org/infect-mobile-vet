import React from 'react';
import { Svg } from 'expo';

export default class ExternalLinkIcon extends React.Component {

    render() {
        return (
            <Svg
                height={this.props.height}
                width={this.props.width}
                viewBox="0 0 13.319 13.32"
            >
                <Svg.G transform="translate(-412.897 -467.072)">
                    <Svg.Path d="M423.731,473.6v5.428a.9.9,0,0,1-.9.9h-8.292a.9.9,0,0,1-.9-.9v-8.292a.9.9,0,0,1,.9-.9h5.6" transform="translate(0 -0.287)" fill="none" stroke="#3289cc" stroke-linecap="round" stroke-miterlimit="10" stroke-width="1.5"/>
                    <Svg.G transform="translate(417.849 467.072)">
                        <Svg.Line y1="6.387" x2="6.387" transform="translate(0 1.98)" fill="none" stroke="#3289cc" stroke-linecap="round" stroke-miterlimit="10" stroke-width="1.5"/>
                        <Svg.Path d="M427.178,467.072l-4.254.086,4.168,4.168Z" transform="translate(-418.81 -467.072)" fill="#3289cc"/>
                    </Svg.G>
                </Svg.G>
            </Svg>
        );
    }

}
