import React from 'react';
import { View, StyleSheet, Text, Animated } from 'react-native';
import { observer } from 'mobx-react';
import { observable } from 'mobx';
import MatrixRowHead from '../matrix-row-head/MatrixRowHead';
import MatrixBody from '../matrix-body/MatrixBody';

@observer
export default class MatrixLayout extends React.Component {

	@observable zoom = {
		factor: 1
	};
	minZoomFactor = 0.4;
	maxZoomFactor = 1.5;
	// Distance to pinch in px between minZoomFactor and maxZoomFactor
	maxZoomDistance = 150;
	// Sum of all distance differences gathered from pinch gestures; defaults to zoomFactor 1
	// (calculate it from min and maxZoomFactor)
	pinchSum = 0;

	constructor(...args) {
		super(...args);
		//this.props.registerPinchListener(this.handlePinch.bind(this));
		///console.log('MatrixLayout: Props are %o', this.props);
	}

	handlePinch(distance) {
		// Don't add more pixels to pinchSum than necessary or we will be out of bounds (and have
		// to pinch a lot to get back to max/min zoom factors)
		//console.log('distance %d', distance);
		const minMaxDiff = this.maxZoomFactor - this.minZoomFactor;
		console.log('minMaxDiff', minMaxDiff);
		const maxPinch = this.maxZoomDistance / minMaxDiff * (this.maxZoomFactor - 1);
		const minPinch = this.maxZoomDistance / minMaxDiff * (1 - this.minZoomFactor) * -1;
		this.pinchSum = Math.min(maxPinch, Math.max(minPinch, this.pinchSum + distance));
		console.log('pinchSum: %d, minPinch %d, maxPinch %d', this.pinchSum, minPinch, 
			maxPinch);

		// Pinching this.maxZoomDistance leads to double zoom factor, pinching 
		// this.maxZoomDistance * -1 leads to half zoom factor
		const factor = 1 + this.pinchSum / this.maxZoomDistance;
		// zoomFactor is between this.minZoomFactor and this.maxZoomFactor
		const zoomFactor = Math.min(this.maxZoomFactor, 
			Math.max(this.minZoomFactor, factor));
		this.zoom.factor = zoomFactor;
		console.log('zoom factor is %f, factor %f', zoomFactor, factor);

	}

	render() {
		console.log('Render matrix layout');
		//zoomFactor={ this.state.zoomFactor }
		return (
			<View style={ styles.mainContainer }>
				{ /*}
				<Text style={ styles.zoomFactorInfo }>
					{ this.zoom.factor }
				</Text>
				*/ }
				<View style={ styles.verticalContainer }>
					<View style={ styles.leftContainer }>
						<MatrixRowHead 
							style={ styles.container }>
						</MatrixRowHead>
					</View>
					<View style={ styles.rightContainer }>
						<MatrixBody
							style={ styles.container }
							resistances={ this.props.resistances }>
						</MatrixBody>
					</View>
					
				</View>
			</View>
		);
	}

}

const styles = StyleSheet.create({
	mainContainer: {
		flex: 1,
	},
	container: {
		flex: 1,
		borderColor: 'tomato',
		borderWidth: 3,
	},
	verticalContainer: {
		flexDirection: 'row',
		flex: 1,
		borderWidth: 5,
		borderColor: 'gray',
	},
	leftContainer: {

	},
	rightContainer: {
		flex: 1,
		padding: 20,
		borderColor: 'deeppink',
		borderWidth: 2,
	}, 
	zoomFactorInfo: {
		fontSize: 20,
		padding: 20,
	}
});

