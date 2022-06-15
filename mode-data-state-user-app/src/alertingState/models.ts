import {
    Alert,
    AlertRule, PaginationDataSet,
} from '@moderepo/mode-apis';


export interface AlertingState {
    // alert rule' ID are not unique globally therefore they need to be stored under projectId
    readonly alertRulesByProjectIdByAlertRuleId: {
        readonly [projectId: number]: {
            [alertRuleId: number]: AlertRule | undefined;
        } | undefined;
    };
    readonly alertRuleIdsByProjectId: {
        readonly [projectId: number]: {
            readonly [searchParams: string]: PaginationDataSet<number> | undefined;
        } | undefined;
    };

    // alert s'ID are not unique globally therefore they need to be stored under projectId
    readonly alertsByProjectIdByAlertId: {
        readonly [projectId: number]: {
            [alertId: string]: Alert | undefined;
        } | undefined;
    };
    readonly alertIdsByProjectId: {
        readonly [projectId: number]: {
            readonly [searchParams: string]: PaginationDataSet<string> | undefined;
        } | undefined;
    };
}


export const initialAlertingState: AlertingState = {
    alertRulesByProjectIdByAlertRuleId: {
    },
    alertRuleIdsByProjectId: {
    },
    alertsByProjectIdByAlertId: {
    },
    alertIdsByProjectId: {
    },
};
