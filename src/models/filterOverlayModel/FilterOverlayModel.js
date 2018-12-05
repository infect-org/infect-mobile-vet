import { observable, action } from 'mobx';
import log from '../../helpers/log';

export default class FilterOverlay {

    @observable isVisible = false;

    @action show() {
        log('FilterOverlayModel: Show');
        this.isVisible = true;
    }

    @action hide() {
        log('FilterOverlayModel: Hide');
        this.isVisible = false;
    }

}
