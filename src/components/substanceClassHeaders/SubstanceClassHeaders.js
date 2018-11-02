import React from 'react';
import { View, StyleSheet } from 'react-native';
import { observer } from 'mobx-react';
import log from '../../helpers/log';
import SubstanceClassHeaderItem from './SubstanceClassHeaderItem';

@observer
export default class SubstanceClassHeaders extends React.Component {

    /**
     * Array filter function. Checks if substanceClass is a leaf node (has no children). Is needed
     * as we only want to display one level of substanc e classes (the most detailed one, i.e. the
     * leaves).
     * @param  {SubstanceClass}  substanceClass
     * @param  {Array}  substanceClasses
     * @return {Boolean}
     */
    isLeaf(substanceClass, index, substanceClasses) {
        const isLeaf = !substanceClasses.find(currentSubstanceClass => (
            currentSubstanceClass.substanceClass.parent === substanceClass.substanceClass
        ));
        /* log(
            'SubstanceClassHeaders: Is %o a leaf in %o? %o',
            substanceClass,
            substanceClasses,
            isLeaf,
        ); */
        return isLeaf;
    }

    render() {

        log('SubstanceClassHeaders: Render');

        return (
            <View style={styles.container}>
                { this.props.substanceClasses.filter(this.isLeaf).map(substanceClass => (
                    <SubstanceClassHeaderItem
                        key={substanceClass.substanceClass.id}
                        substanceClass={substanceClass}
                        height={this.props.height}
                    />
                )) }
            </View>
        );
    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        // borderWidth: 1,
        // borderColor: 'deepskyblue',
    },
});
