import {
    Alert,
    AlertRule,
    AppAPI, CreateAlertRuleParams, FetchAlertRulesFilters, FetchAlertsFilters, PaginationDataSet, UpdateAlertRuleParams,
} from '@moderepo/mode-apis';
import {
    BaseAction, ExtDispatch, searchParamsToString,
} from '@moderepo/mode-data-state-base';
import {
    UserAppDataStateAction, UserAppThunkAction,
} from '../actions';


/**
 * The types of action that can be dispatched to update this sub state.
 */
export enum AlertingActionType {
    SET_ALERT_RULE = 'set alert rule',
    SET_ALERT_RULES = 'set alert rules',
    CLEAR_ALERT_RULES = 'clear alert rules',
    SET_ALERT = 'set alert',
    SET_ALERTS = 'set alerts',
    CLEAR_ALERTS = 'clear alerts',
}



/**
 * The Action interface for setting a list of alert rules that belonged to a project.
 * @param type - The action type
 * @param alertRules - The array of alert rules
 */
export interface SetAlertRulesAction extends BaseAction {
    readonly type: AlertingActionType.SET_ALERT_RULES;
    readonly projectId: number;
    readonly alertRules: PaginationDataSet<AlertRule>;
    readonly searchParams: string;
}


/**
 * The Action interface for setting a alert rule that belonged to a project.
 * @param type - The action type
 * @param alertRule - The alert rule
 */
export interface SetAlertRuleAction extends BaseAction {
    readonly type: AlertingActionType.SET_ALERT_RULE;
    readonly projectId: number;
    readonly alertRule: AlertRule;
}



/**
 * The Action interface for clearing the list of project alert rules
 * @param type - The action type
 */
export interface ClearAlertRulesAction extends BaseAction {
    readonly type: AlertingActionType.CLEAR_ALERT_RULES;
    readonly projectId: number;
}


/**
 * The Action interface for setting a list of alerts that belonged to a project.
 * @param type - The action type
 * @param alerts - The array of alerts
 */
export interface SetAlertsAction extends BaseAction {
    readonly type: AlertingActionType.SET_ALERTS;
    readonly projectId: number;
    readonly alerts: PaginationDataSet<Alert>;
    readonly searchParams: string;
}


/**
 * The Action interface for setting a alert that belonged to a project.
 * @param type - The action type
 * @param alert - The alert
 */
export interface SetAlertAction extends BaseAction {
    readonly type: AlertingActionType.SET_ALERT;
    readonly projectId: number;
    readonly alert: Alert;
}



/**
 * The Action interface for clearing the list of project alerts
 * @param type - The action type
 */
export interface ClearAlertsAction extends BaseAction {
    readonly type: AlertingActionType.CLEAR_ALERTS;
    readonly projectId: number;
}


export const setAlertRules = (projectId: number, alertRules: PaginationDataSet<AlertRule>, searchParams: string): SetAlertRulesAction => {
    return {
        type: AlertingActionType.SET_ALERT_RULES,
        projectId,
        alertRules,
        searchParams,
    };
};



export const setAlertRule = (projectId: number, alertRule: AlertRule): SetAlertRuleAction => {
    return {
        type: AlertingActionType.SET_ALERT_RULE,
        projectId,
        alertRule,
    };
};



export const clearAlertRules = (projectId: number): ClearAlertRulesAction => {
    return {
        type: AlertingActionType.CLEAR_ALERT_RULES,
        projectId,
    };
};


export const setAlerts = (projectId: number, alerts: PaginationDataSet<Alert>, searchParams: string): SetAlertsAction => {
    return {
        type: AlertingActionType.SET_ALERTS,
        projectId,
        alerts,
        searchParams,
    };
};


export const setAlert = (projectId: number, alert: Alert): SetAlertAction => {
    return {
        type: AlertingActionType.SET_ALERT,
        projectId,
        alert,
    };
};


export const clearAlerts = (projectId: number): ClearAlertsAction => {
    return {
        type: AlertingActionType.CLEAR_ALERTS,
        projectId,
    };
};



/**
 * Backend uses 'limit' and 'skip' attributes however in the frontend, we use pageNumber and pageSize so this function need
 * to accept a filter object that uses pageNumber, pageSize and then convert that to skip/limit before calling the API
 */
export interface UIFetchAlertRulesFilters extends Omit<Omit<FetchAlertRulesFilters, 'skip'>, 'limit'> {
    readonly pageNumber?: number | undefined;
    readonly pageSize?: number | undefined;
}

/**
 * Get multiple alert rules belonged to a Project
 * @param projectId - The id of the project to look for
 */
export const fetchAlertRules = (
    projectId: number, filters?: UIFetchAlertRulesFilters | undefined,
): UserAppThunkAction => {
    return async (dataDispatch: ExtDispatch<UserAppDataStateAction
    >): Promise<void> => {
        const modifiedFilters = {
            ...filters,                                             // Copy the filters
            // change pageSize/pageNumber to skip/limit
            skip      : filters?.pageNumber !== undefined && filters?.pageSize !== undefined ? filters.pageNumber * filters.pageSize : undefined,
            limit     : filters?.pageSize !== undefined ? filters.pageSize : undefined,
            // exclude pageSize/pageNumber
            pageNumber: undefined,
            pageSize  : undefined,
        };
        
        const alertRules = await AppAPI.getInstance().getAlertRules(
            projectId, modifiedFilters,
        );
        await dataDispatch(setAlertRules(projectId, alertRules, searchParamsToString(filters)));
    };
};



/**
 * Get an alert rule by id. This action will also update the app state.
 *
 * @param alertRuleId - The ID of the alert rule we want to get
 */
export const fetchAlertRuleById = (projectId: number, alertRuleId: number): UserAppThunkAction => {
    return async (dataDispatch: ExtDispatch<UserAppDataStateAction
    >): Promise<void> => {
        const alertRule = await AppAPI.getInstance().getAlertRuleById(alertRuleId);
        await dataDispatch(setAlertRule(projectId, alertRule));
    };
};


/**
 * Create an alert rule.
 * @param projectId - The id of the project the alert rule belonged to
 * @param params - The attributes and their values to be updated
 */
export const createAlertRule = (
    projectId: number,
    params: CreateAlertRuleParams,
): UserAppThunkAction => {
    return async (dataDispatch: ExtDispatch<UserAppDataStateAction>): Promise<void> => {
        await AppAPI.getInstance().createAlertRule(params);

        // Need to clear the alert rules because the list of alert rules changed
        await dataDispatch(clearAlertRules(projectId));
    };
};



/**
 * Update an alert rule.
 * @param projectId - The id of the project the alert rule belonged to
 * @param alertRuleId - The id of the alert rule which we want to update
 * @param params - The attributes and their values to be updated
 */
export const updateAlertRule = (
    projectId: number,
    alertRuleId: number,
    params: UpdateAlertRuleParams,
): UserAppThunkAction => {
    return async (dataDispatch: ExtDispatch<UserAppDataStateAction>): Promise<void> => {
        await AppAPI.getInstance().updateAlertRule(alertRuleId, params);

        // Need to clear the alert rules because updating the alert rule's attributes can cause the list of alert rules to be changed
        await dataDispatch(clearAlertRules(projectId));
    };
};



/**
 * Delete an alert rule.
 * @param projectId - The id of the project the alert rule belonged to
 * @param alertRuleId - The id of the alert rule which we want to update
 * @param params - The attributes and their values to be updated
 */
export const deleteAlertRule = (
    projectId: number,
    alertRuleId: number,
): UserAppThunkAction => {
    return async (dataDispatch: ExtDispatch<UserAppDataStateAction>): Promise<void> => {
        await AppAPI.getInstance().deleteAlertRule(alertRuleId);

        // Need to clear the alert rules because the list of alert rules changed
        await dataDispatch(clearAlertRules(projectId));
    };
};



/**
 * The fetch alerts filter options used by the UI which uses pageNumber and pageSize instead of skip and limit.
 * These will be converted to skip/limit before we make the API call
 */
export interface UIFetchAlertsFilters extends Omit<Omit<FetchAlertsFilters, 'skip'>, 'limit'> {
    readonly pageNumber?: number | undefined;
    readonly pageSize?: number | undefined;
}


/**
 * Get multiple alert belonged to a Project
 * @param projectId - The id of the project to look for
 */
export const fetchAlerts = (
    projectId: number, filters?: UIFetchAlertsFilters | undefined,
): UserAppThunkAction => {
    return async (dataDispatch: ExtDispatch<UserAppDataStateAction
    >): Promise<void> => {
        const modifiedFilters = {
            ...filters,                                             // Copy the filters
            // change pageSize/pageNumber to skip/limit
            skip      : filters?.pageNumber !== undefined && filters?.pageSize !== undefined ? filters.pageNumber * filters.pageSize : undefined,
            limit     : filters?.pageSize !== undefined ? filters.pageSize : undefined,
            // exclude pageSize/pageNumber
            pageNumber: undefined,
            pageSize  : undefined,
        };
        
        const alerts = await AppAPI.getInstance().getAlerts(
            projectId, modifiedFilters,
        );
        await dataDispatch(setAlerts(projectId, alerts, searchParamsToString(filters)));
    };
};



/**
 * Get an alert rule by id. This action will also update the app state.
 *
 * @param alertId - The ID of the alert rule we want to get
 */
export const fetchAlertById = (projectId: number, alertId: string): UserAppThunkAction => {
    return async (dataDispatch: ExtDispatch<UserAppDataStateAction
    >): Promise<void> => {
        const alert = await AppAPI.getInstance().getAlertById(alertId);
        await dataDispatch(setAlert(projectId, alert));
    };
};
