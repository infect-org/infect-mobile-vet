import { observable, action } from 'mobx';

export default class FilterOverlay {

    @observable isVisible = false;

    @action show() {
        this.isVisible = true;
    }

    @action hide() {
        this.isVisible = false;
    }

}
