import produce, {
    castDraft, Draft,
} from 'immer';
import {
    BaseAction,
} from '@moderepo/mode-data-state-base';
import {
    DeviceConfigSchemasState,
} from './models';
import {
    DeviceConfigSchemasActionType, SetDeviceConfigSchemasAction,
} from '.';


const schemasByDeviceIdReducer = (
    currentState: DeviceConfigSchemasState['schemasByDeviceId'], action: BaseAction,
): DeviceConfigSchemasState['schemasByDeviceId'] => {
    const { type } = action;

    switch (type) {
        case DeviceConfigSchemasActionType.SET_DEVICE_CONFIG_SCHEMAS:
            return produce(currentState, (draft: Draft<typeof currentState>) => {
                const actualAction = action as SetDeviceConfigSchemasAction;
                draft[actualAction.deviceId] = castDraft(actualAction.schemas);
            });
        default:
            return currentState;
    }
};



export const deviceConfigSchemasStateReducer = (currentState: DeviceConfigSchemasState, action: BaseAction): DeviceConfigSchemasState => {
    return produce(currentState, (draft: Draft<DeviceConfigSchemasState>) => {
        draft.schemasByDeviceId = castDraft(schemasByDeviceIdReducer(currentState.schemasByDeviceId, action));
    });
};
