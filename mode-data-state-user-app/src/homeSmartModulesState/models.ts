import {
    SmartModule,
} from '@moderepo/mode-apis';


export interface HomeSmartModulesState {
    readonly smartModulesById: {
        [moduleId: string]: SmartModule | undefined;
    };
    readonly smartModuleIdsByHomeId: {
        [homeId: number]: readonly string[] | undefined
    };
}


export const initialHomeSmartModulesState: HomeSmartModulesState = {
    smartModulesById: {
    },
    smartModuleIdsByHomeId: {
    },
};
