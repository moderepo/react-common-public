import {
    ExtDispatch,
    RCDataStateAction,
} from '@moderepo/mode-data-state-robot-cloud';

import {
    BaseRobotCompCtrl,
} from '../../robotCloud';

export class FluxDSRobotCompCtrl extends BaseRobotCompCtrl {
    protected dataDispatch: ExtDispatch<RCDataStateAction>;

    constructor (dataDispatch: ExtDispatch<RCDataStateAction>) {
        super();
        this.dataDispatch = dataDispatch;
    }

}
