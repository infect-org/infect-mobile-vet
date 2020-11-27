import React from 'react';
import { Svg, Ellipse, G } from 'react-native-svg';

export default class GuidelineCurrentResistanceButtonIcon extends React.Component {

    render() {
        return (
            <Svg
                height={this.props.height}
                width={this.props.width}
                viewBox="0 0 24 24">
                <G transform="translate(0)">
                    <Ellipse
                        cx="3.111" cy="3.111" rx="3.111" ry="3.111"/>
                    <Ellipse
                        cx="3.111" cy="3.111" rx="3.111" ry="3.111" transform="translate(0 8.889)" fill="#ede0de"/>
                    <Ellipse
                        cx="3.111" cy="3.111" rx="3.111" ry="3.111" transform="translate(0 17.778)"/>
                    <Ellipse
                        cx="3.111" cy="3.111" rx="3.111" ry="3.111" transform="translate(8.889)" fill="#a9df07"/>
                    <Ellipse
                        cx="3.111" cy="3.111" rx="3.111" ry="3.111" transform="translate(8.889 8.889)" fill="#62d001"/>
                    <Ellipse
                        cx="3.111" cy="3.111" rx="3.111" ry="3.111" transform="translate(8.889 17.778)" fill="#62d001"/>
                    <Ellipse
                        cx="3.111" cy="3.111" rx="3.111" ry="3.111" transform="translate(17.778)" fill="#e4b444"/>
                    <Ellipse
                        cx="3.111" cy="3.111" rx="3.111" ry="3.111" transform="translate(17.778 8.889)"/>
                    <Ellipse
                        cx="3.111" cy="3.111" rx="3.111" ry="3.111" transform="translate(17.778 17.778)"/>
                </G>
            </Svg>

        );
    }

}
