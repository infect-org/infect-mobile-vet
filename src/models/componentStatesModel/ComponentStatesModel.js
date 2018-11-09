import { observable, computed, action } from 'mobx';
import componentStates from '../componentStates/componentStates';
import log from '../../helpers/log';

export default class ComponentStatesModel {

    /**
     * Current state of the components
     * @type {Map} key: component name (see this.componentNames), value: state (see componentStates)
     */
    @observable components = new Map();
    /**
     * Highest state a component has ever reached. Is needed to not re-render App.js and not display
     * InitialLoadingOverlay once resistances are ready.
     * @type {Map} key: component name (see this.componentNames), value: state (see componentStates)
     */
    @observable highestComponentStates = new Map();
    @observable componentNames = ['bacteria', 'antibiotics', 'resistances', 'filters'];

    /**
     * Returns true if all components were ready once
     */
    @computed get allHighestStatesAreReady() {
        return [...this.highestComponentStates.values()]
            .every(state => state === componentStates.ready);
    }

    @action setup() {
        this.componentNames.forEach((name) => {
            this.components.set(name, componentStates.loading);
            this.highestComponentStates.set(name, componentStates.loading);
        });
    }

    /**
     * Update a component's state. If all components' states are 'ready', set
     * allComponentsWereReady.
     * @param {String} componentName One of this.componentNames
     * @param {String} state State, one of componentStates
     */
    @action update(component, state) {
        if (!this.components.has(component)) {
            throw new Error(`ComponentStatesModel: Cannot update state of component ${component}, does not exist.`);
        }
        if (!Object.values(componentStates).includes(state)) {
            throw new Error(`ComponentStatesModel: Cannot update state of ${component} to ${state}, as this is not a valid component state.`);
        }
        console.log('FilterOverlayModel: Update state of', component, 'to', state);
        this.components.set(component, state);
        const previousHighestState = this.highestComponentStates.get(component);
        if (state > previousHighestState) this.highestComponentStates.set(component, state);
    }

}
