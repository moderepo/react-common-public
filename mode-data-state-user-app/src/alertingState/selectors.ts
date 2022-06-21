import {
    createCachedSelector,
} from 're-reselect';
import {
    Alert,
    AlertRule,
    PaginationDataSet,
} from '@moderepo/mode-apis';
import {
    searchParamsToString,
} from '@moderepo/mode-data-state-base';
import {
    UserAppDataState,
} from '../model';
import {
    AlertingState,
} from './models';



/**
 * This is the actual function that will get the data from the state and return the data requested. However, this function returns a new
 * object every time which can cause an infinite loop in re-rendering if used in React component. Therefore this function is not EXPORTED
 * and we will create another function below which use memoize to cache the result.
 */
const selectAlertRulesFunc = (
    alertRulesByProjectIdByAlertRuleId: AlertingState['alertRulesByProjectIdByAlertRuleId'],
    alertRuleIdsByProjectId: AlertingState['alertRuleIdsByProjectId'],
    projectId: number,
    searchParams: string,
): PaginationDataSet<AlertRule> | undefined => {
    const dataSet = alertRuleIdsByProjectId[projectId]?.[searchParams];
    const alertRulesByProjectId = alertRulesByProjectIdByAlertRuleId[projectId];
    if (dataSet && alertRulesByProjectId) {

        // This will return a new PaginationDataSet of alert rules which can cause infinite loop if we don't use memoize
        return {
            range: dataSet.range,
            items: dataSet.items.reduce((result: readonly AlertRule[], alertRuleId: number) => {
                const alertRule = alertRulesByProjectId[alertRuleId];
                if (alertRule) {
                    return [
                        ...result,
                        alertRule,
                    ];
                }
                return result;
            }, []),
        };
    }
    return undefined;
};



/**
 * Select ALL homes for a specific user
 * @param state
 * @param projectId
 * @param searchParams?: {
 *              pageNumber,
 *              pageSize
 *        }
 * @returns PaginationDataSet<Home> | undefined
 */
export const selectAlertRules = createCachedSelector(
    (state: UserAppDataState) => { return state.alerting.alertRulesByProjectIdByAlertRuleId; },
    (state: UserAppDataState) => { return state.alerting.alertRuleIdsByProjectId; },
    (state: UserAppDataState, projectId: number) => { return projectId; },
    (state: UserAppDataState, projectId: number, searchParams?: {
        readonly pageNumber?: number | undefined;
        readonly pageSize?: number | undefined;
    }) => { return searchParamsToString(searchParams); },
    selectAlertRulesFunc,
)((state: UserAppDataState, projectId: number, searchParams?: {
    readonly pageNumber?: number | undefined;
    readonly pageSize?: number | undefined;
}) => {
    // use searchParams as cache key for creatCachedSelector
    return searchParamsToString(searchParams);
});



/**
 * @param state
 * @param projectId
 * @param alertRuleId
 * @returns AlertRule | undefined
 */
export const selectAlertRuleById = (state: UserAppDataState, projectId: number, alertRuleId: number): AlertRule | undefined => {
    return state.alerting.alertRulesByProjectIdByAlertRuleId[projectId]?.[alertRuleId];
};



/**
 * This is the actual function that will get the data from the state and return the data requested. However, this function returns a new
 * object every time which can cause an infinite loop in re-rendering if used in React component. Therefore this function is not EXPORTED
 * and we will create another function below which use memoize to cache the result.
 */
const selectAlertsFunc = (
    alertsByProjectIdByAlertId: AlertingState['alertsByProjectIdByAlertId'],
    alertIdsByProjectId: AlertingState['alertIdsByProjectId'],
    projectId: number,
    searchParams: string,
): PaginationDataSet<Alert> | undefined => {
    const dataSet = alertIdsByProjectId[projectId]?.[searchParams];
    const alertsByProjectId = alertsByProjectIdByAlertId[projectId];
    if (dataSet && alertsByProjectId) {

        // This will return a new PaginationDataSet of alerts which can cause infinite loop if we don't use memoize
        return {
            range: dataSet.range,
            items: dataSet.items.reduce((result: readonly Alert[], alertId: string) => {
                const alert = alertsByProjectId[alertId];
                if (alert) {
                    return [
                        ...result,
                        alert,
                    ];
                }
                return result;
            }, []),
        };
    }
    return undefined;
};



/**
 * Select ALL homes for a specific user
 * @param state
 * @param projectId
 * @param searchParams?: {
 *              pageNumber,
 *              pageSize
 *        }
 * @returns PaginationDataSet<Home> | undefined
 */
export const selectAlerts = createCachedSelector(
    (state: UserAppDataState) => { return state.alerting.alertsByProjectIdByAlertId; },
    (state: UserAppDataState) => { return state.alerting.alertIdsByProjectId; },
    (state: UserAppDataState, projectId: number) => { return projectId; },
    (state: UserAppDataState, projectId: number, searchParams?: {
        readonly pageNumber?: number | undefined;
        readonly pageSize?: number | undefined;
    }) => { return searchParamsToString(searchParams); },
    selectAlertsFunc,
)((state: UserAppDataState, projectId: number, searchParams?: {
    readonly pageNumber?: number | undefined;
    readonly pageSize?: number | undefined;
}) => {
    // use searchParams as cache key for createCachedSelector
    return searchParamsToString(searchParams);
});



/**
 * @param state
 * @param projectId
 * @param alertId
 * @returns Alert | undefined
 */
export const selectAlertById = (state: UserAppDataState, projectId: number, alertId: string): Alert | undefined => {
    return state.alerting.alertsByProjectIdByAlertId[projectId]?.[alertId];
};
