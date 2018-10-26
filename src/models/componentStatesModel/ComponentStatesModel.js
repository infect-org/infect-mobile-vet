import { observable, action } from 'mobx';
import componentStates from '../componentStates/componentStates';
import log from '../../helpers/log';

export default class ComponentStatesModel {

    @observable components = new Map();
    @observable componentNames = ['bacteria', 'antibiotics', 'resistances', 'filters'];

    @action setup() {
        this.componentNames.forEach(name => this.components.set(name, componentStates.loading));
    }

    @action update(component, state) {
        if (!this.components.has(component)) throw new Error(`ComponentStatesModel: Cannot update state of component ${component}, does not exist.`);
        if (!componentStates[state]) throw new Error(`ComponentStatesModel: Cannot update state to ${state}, as this is not a valid component state.`);
        log('FilterOverlayModel: Update state of', component, 'to', state);
        this.components.set(component, state);
    }

}
