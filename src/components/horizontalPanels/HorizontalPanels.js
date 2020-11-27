import React from 'react';
import { View, StyleSheet } from 'react-native';
import { observer } from 'mobx-react';
import { action, observable, reaction } from 'mobx';
import Animated, { Easing } from 'react-native-reanimated';
import log from '../../helpers/log';


/**
 * Contains panels that are moved horizontally to change to detail views (like settings on iOS);
 * used for filters that switch to detail view when antibiotic, substance class or bacteria filters
 * are selected.
 * HorizontalPanels must contain one or more HorizontalPanel to work.
 */
@observer
export default class HorizontalPanels extends React.Component {

    /**
     * Width of a single container, equals the width of HorizontalPanels; must be passed to
     * HorizontalPanel so that they can lay themselves out correctly.
     */
    @observable containerWidth = 0;

    /**
     * Left position of content; needed to make different content visible and animate it.
     */
    contentLeftPosition = new Animated.Value(0);

    constructor(...params) {
        super(...params);
        this.handleLayout = this.handleLayout.bind(this);
        reaction(
            () => this.props.currentPanel.index,
            currentPanelIndex => this.animateVisiblePanel(currentPanelIndex),
        );
    }

    /**
     * Animates horizontal panel's left property to switch to the currently visible panel.
     * @param {int} visiblePanelIndex Index of currently visible panel
     */
    animateVisiblePanel(visiblePanelIndex) {
        // this.contentLeft.setValue(visible ? -200 : 0),
        const config = {
            duration: 150,
            toValue: visiblePanelIndex * this.containerWidth * -1,
            easing: Easing.inOut(Easing.ease),
        };
        const animation = Animated.timing(this.contentLeftPosition, config);
        animation.start();
    }

    @action handleLayout(ev) {
        this.containerWidth = ev.nativeEvent.layout.width;
    }

    render() {

        log('HorizontalPanels: Render');

        return (
            <View
                style={[styles.panelContainer]}
                onLayout={this.handleLayout}
            >
                { /* Container that will be moved */ }
                <Animated.View
                    style={[
                        styles.contentContainer,
                        {
                            left: this.contentLeftPosition,
                            width: this.props.children.length * this.containerWidth,
                        },
                    ]}
                >
                    { /* See PanPinch.js, uses the same technique to render and extend children */ }
                    { React.Children.map(this.props.children, (child, index) => (
                        React.cloneElement(child, {
                            containerWidth: this.containerWidth,
                            childIndex: index,
                            childCount: this.props.children.length,
                        })
                    )) }
                </Animated.View>
            </View>
        );
    }

}

const styles = StyleSheet.create({
    panelContainer: {
        width: '100%',
        height: '100%',
        // Make sure we hide all content from panels that are not currently visible
        overflow: 'hidden',
        // borderWidth: 1,
        // borderColor: 'tomato',
    },
    contentContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        height: '100%',
        width: '100%',
        // borderWidth: 1,
        // borderColor: 'yellow',
    },
});
