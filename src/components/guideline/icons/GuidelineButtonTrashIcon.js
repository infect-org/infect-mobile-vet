import React from 'react';
import { Svg, G, Line, Path } from 'react-native-svg';

export default class GuidelineButtonTrashIcon extends React.Component {

    render() {
        return (
            <Svg
                height={this.props.height}
                width={this.props.width}
                viewBox="0 0 22.088 26.262">
                <G
                    transform="translate(-331.766 -488.967)">
                    <Line
                        x2="22.088"
                        transform="translate(331.766 492.971)"
                        fill="none"
                        stroke="#1a1818"
                        strokeMiterlimit="10"
                        strokeWidth="2"/>
                    <Path
                        d="M349.251,489.967h-2.386a1.206,1.206,0,0,0-1.207,1.206v1.8"
                        transform="translate(-7.072 0)"
                        fill="none"
                        stroke="#1a1818"
                        strokeMiterlimit="10"
                        strokeWidth="2"/>
                    <Path
                        d="M352.977,489.967h2.387a1.206,1.206,0,0,1,1.206,1.206v1.8"
                        transform="translate(-10.798 0)"
                        fill="none"
                        stroke="#1a1818"
                        strokeMiterlimit="10"
                        strokeWidth="2"/>
                    <Path
                        d="M337.711,496.086l1.946,21.258h6.179"
                        transform="translate(-3.026 -3.115)"
                        fill="none"
                        stroke="#1a1818"
                        strokeMiterlimit="10"
                        strokeWidth="2"/>
                    <Path
                        d="M362.386,496.086l-1.946,21.258h-6.179"
                        transform="translate(-11.452 -3.115)"
                        fill="none"
                        stroke="#1a1818"
                        strokeMiterlimit="10"
                        strokeWidth="2"/>
                    <Line
                        x2="0.858"
                        y2="15.115"
                        transform="translate(340.044 495.899)"
                        fill="none"
                        stroke="#1a1818"
                        strokeMiterlimit="10"
                        strokeWidth="2"/>
                    <Line
                        x1="0.858"
                        y2="15.115"
                        transform="translate(344.717 495.899)"
                        fill="none"
                        stroke="#1a1818"
                        strokeMiterlimit="10"
                        strokeWidth="2"/>
                </G>
            </Svg>

        );
    }

}
