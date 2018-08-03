import React from 'react';
import { View, Dimensions, Text, StyleSheet } from 'react-native';
import { observer } from 'mobx-react';
import { computed, observable, action } from 'mobx';
import AntibioticLabel from '../antibioticLabel/AntibioticLabel';
import BacteriumLabel from '../bacteriumLabel/BacteriumLabel';
import Resistance from '../resistance/Resistance';


const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
console.log('Dimensions:', Dimensions.get('window'));
console.log('Screen dimensions:', Dimensions.get('screen'));

@observer
export default class Matrix extends React.Component {

    @observable renderedResistances = 0;

    componentDidMount() {
        this.props.matrix.setDimensions({
            // Resistance cirlces/fonts for labels should not be too small
            width: Math.max(windowWidth, 1200),
            height: windowHeight,
        });
        console.log('default radius is %o', this.props.matrix.defaultRadius);
    }

    @computed get antibioticLabelsPosition() {
        const space = this.props.matrix.spaceBetweenGroups;
        const left = (this.props.matrix.bacteriumLabelColumnWidth || 0) + space;
        const height = this.props.matrix.antibioticLabelRowHeight;
        return { left, height };
    }

    @computed get bacteriumLabelsPosition() {
        const space = this.props.matrix.spaceBetweenGroups;
        const top = (this.props.matrix.antibioticLabelRowHeight || 0) + space;
        const width = this.props.matrix.bacteriumLabelColumnWidth || 0;
        const styles = { top, width };
        console.log('styles for bacterium labels:', styles);
        return styles;
    }

    @computed get labelOpacity() {
        const opacity = this.props.matrix.defaultRadius ? 1 : 0;
        return { opacity };
    }

    @computed get resistanceStyles() {
        const space = this.props.matrix.spaceBetweenGroups;
        const top = this.props.matrix.antibioticLabelRowHeight + space;
        const left = this.props.matrix.bacteriumLabelColumnWidth + space;
        return { top, left };
    }

    /**
     * Callback that is invoked from every resistance that has finished rendering.
     */
    @action resistanceRendered = () => {
        this.renderedResistances += 1;
        if (this.renderedResistances === this.props.matrix.resistances.length) {
            this.props.setRenderingDone(true);
            // this.props.renderingDone = true;
            console.log('Matrix: Rendering is done');
        }
    }

    render() {
        return (
            <View style={ styles.container }>


                <View style={ styles.container }>

                    { /* <Text style={ [{ borderTopWidth: 50 }] }>
                        Radius: { this.props.matrix.defaultRadius }
                    </Text> */ }

                    { /* Antibiotics */ }
                    <View
                        style={ [
                            styles.antibioticLabels,
                            this.antibioticLabelsPosition,
                            this.labelOpacity,
                        ] }>
                        { this.props.matrix.sortedAntibiotics.map(ab => (
                            <AntibioticLabel
                                antibiotic={ ab }
                                key={ ab.antibiotic.id }
                                matrix={ this.props.matrix } />
                        ))}
                    </View>

                    { /* Bacteria */ }
                    <View
                        style={ [
                            styles.bacteriumLabels,
                            this.bacteriumLabelsPosition,
                            this.labelOpacity,
                        ] }>
                        { this.props.matrix.sortedBacteria.map(bact => (
                            <BacteriumLabel
                                key={ bact.bacterium.id }
                                bacterium={ bact }
                                matrix={ this.props.matrix } />
                        )) }
                    </View>

                    {/* Resistances */ }
                    { this.props.matrix.defaultRadius &&
                        <View
                            style={ [
                                styles.resistanceContainer,
                                this.resistanceStyles,
                            ]}>
                            { this.props.matrix.resistances.map(res => (
                                <Resistance
                                    key={ `${res.resistance.antibiotic.id}/${res.resistance.bacterium.id}` }
                                    matrix={this.props.matrix} resistance={res}
                                    onRender={ this.resistanceRendered }/>
                            ))}
                        </View>
                    }

                </View>

            </View>
        );

    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        // backgroundColor: 'grey',
    },
    antibioticLabels: {
        position: 'absolute',
        // backgroundColor: 'deeppink',
        // width: 100,
    },
    bacteriumLabels: {
        position: 'absolute',
        left: 0,
        top: 0,
        /* backgroundColor: 'tomato',
        width: 100,
        height: 100, */
    },
    resistanceContainer: {
        position: 'absolute',
        backgroundColor: 'pink',
    },
});
