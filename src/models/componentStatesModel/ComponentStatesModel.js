import { observable, action } from 'mobx';
import componentStates from '../componentStates/componentStates';
import log from '../../helpers/log';

export default class ComponentStatesModel {

    @observable components = new Map();
    @observable componentNames = ['bacteria', 'antibiotics', 'resistances', 'filters'];

    // Update to true when all components were ready once – don't display loadingScreen afterwards
    @observable allComponentsWereReady = false;

    @action setup() {
        this.componentNames.forEach(name => this.components.set(name, componentStates.loading));
    }

    /**
     * Update a component's state. If all components' states are 'ready', set
     * allComponentsWereReady.
     * @param {String} componentName One of this.componentNames
     * @param {String} state State, one of componentStates
     */
    @action update(component, state) {
        if (!this.components.has(component)) throw new Error(`ComponentStatesModel: Cannot update state of component ${component}, does not exist.`);
        if (!componentStates[state]) throw new Error(`ComponentStatesModel: Cannot update state to ${state}, as this is not a valid component state.`);
        log('FilterOverlayModel: Update state of', component, 'to', state);
        this.components.set(component, state);
        const allComponentsReady = [...this.components.values()]
            .every(componentState => componentState === componentStates.ready);
        if (allComponentsReady) this.updateAllComponentsWereReady(true);
    }

    /**
     * Update this.allComponentsWereReady
     * @param  {boolean} newValue
     * @private
     */
    @action updateAllComponentsWereReady(newValue) {
        console.log('ComponentStatesModel: updateAllComponentsWereReady to', newValue);
        this.allComponentsWereReady = newValue;
    }

}
