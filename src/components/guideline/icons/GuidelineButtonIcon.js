import React from 'react';
import * as Svg from 'react-native-svg';

export default class GuidelineButtonIcon extends React.Component {

    render() {
        return (
            <Svg
                height={this.props.height}
                width={this.props.width}
                viewBox="0 0 31.573 25.799"
            >
                <Svg.G
                    transform="translate(-4 -0.209)"
                >
                    <Svg.Circle
                        cx="3.972"
                        cy="3.972"
                        r="3.972"
                        transform="translate(25.63 9.56)"
                        fill="none"
                        stroke="#000"
                        strokeMiterlimit="10"
                        strokeWidth="4"/>
                    <Svg.Path
                        d="M49.326.219V9.534c0,2.631-3.111,6.644-8.346,6.644"
                        transform="translate(-28.411)"
                        fill="none"
                        stroke="#000"
                        strokeMiterlimit="10"
                        strokeWidth="2"/>
                    <Svg.Path
                        d="M5,.209V9.534c0,2.631,3.111,6.644,8.346,6.644"
                        fill="none"
                        stroke="#000"
                        strokeMiterlimit="10"
                        strokeWidth="2"/>
                    <Svg.Path
                        d="M41.581,68.074v4.614S41.732,77.5,46,77.154c3.336,0,4.779-1.633,5.767-5.4a9.487,9.487,0,0,1,3.934-5.483"
                        transform="translate(-28.723 -52.166)"
                        fill="none"
                        stroke="#000"
                        strokeMiterlimit="10"
                        strokeWidth="2"/>
                    <Svg.Rect
                        width="3.995"
                        height="1.964"
                        transform="translate(5 0.211)"/>
                    <Svg.Rect
                        width="3.995"
                        height="1.964"
                        transform="translate(16.718 0.211)"/>
                </Svg.G>
            </Svg>
        );
    }

}
