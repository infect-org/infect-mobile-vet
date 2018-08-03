import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default class MatrixRowHead extends React.Component {

	names = ['Acinetobacter sp.', 'Bacteroides fragilis', 'Burkholderia sp.' ];
	originalFontSize = 16;
	state = {
		fontSize: this.originalFontSize,
	}

	constructor(...args) {
		super(...args);
		this.name = this.names[Math.floor(Math.random() * 2)];
	}

	render() {
		return (
			<View 
				style={ [styles.container, {
					/*transform: [
						{ scaleX: this.props.zoomFactor },
						{ scaleY: this.props.zoomFactor },
					]*/
				}] }>
				{ /*Array.from(new Array(40)).map((item, index) => {
					return <Text 
						key={ index } 
						style={ [styles.text, { fontSize: this.state.fontSize }] }>
						{ this.name }
					</Text>;
				}) */}
			</View>			
		);
	}

}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		padding: 10,
	},
	text: {
		color: 'black',
	}
});