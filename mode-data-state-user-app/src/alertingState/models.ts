import {
    AlertRule, PaginationDataSet,
} from '@moderepo/mode-apis';


export interface AlertingState {
    // alert rule' ID are not unique globally therefore they need to be stored under projectId
    readonly alertRulesByProjectIdByAlertRuleId: {
        readonly [projectId: number]: {
            [alertRule: number]: AlertRule | undefined;
        } | undefined;
    };
    readonly alertRuleIdsByProjectId: {
        readonly [projectId: number]: {
            readonly [searchParams: string]: PaginationDataSet<number> | undefined;
        } | undefined;
    };
}


export const initialAlertingState: AlertingState = {
    alertRulesByProjectIdByAlertRuleId: {
    },
    alertRuleIdsByProjectId: {
    },
};
