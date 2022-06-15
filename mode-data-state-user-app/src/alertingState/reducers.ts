/* eslint-disable max-len */
import produce, {
    castDraft, Draft,
} from 'immer';
import {
    BaseAction,
} from '@moderepo/mode-data-state-base';
import {
    Alert,
    AlertRule,
} from '@moderepo/mode-apis';
import {
    AlertingActionType, SetAlertRuleAction, SetAlertRulesAction, ClearAlertRulesAction,
} from './actions';
import {
    AlertingState,
} from './models';
import {
    ClearAlertsAction,
    SetAlertAction,
    SetAlertsAction,
} from '.';



const alertRulesByProjectIdByAlertRuleIdReducer = (
    currentState: AlertingState['alertRulesByProjectIdByAlertRuleId'], action: BaseAction,
): AlertingState['alertRulesByProjectIdByAlertRuleId'] => {
    const { type } = action;

    switch (type) {

        case AlertingActionType.SET_ALERT_RULES:
            return produce(currentState, (draft: Draft<typeof currentState>) => {
                const { projectId, alertRules } = action as SetAlertRulesAction;
                const temp = draft[projectId] || {
                };
                draft[projectId] = temp;
    
                alertRules.items.forEach((alertRule: AlertRule) => {
                    temp[alertRule.id] = castDraft(alertRule);
                });
            });

        case AlertingActionType.SET_ALERT_RULE:
            return produce(currentState, (draft: Draft<typeof currentState>) => {
                const { projectId, alertRule } = action as SetAlertRuleAction;
                const temp = draft[projectId] || {
                };
                draft[projectId] = temp;
                temp[alertRule.id] = castDraft(alertRule);
            });

        case AlertingActionType.CLEAR_ALERT_RULES:
            return produce(currentState, (draft: Draft<typeof currentState>) => {
                const { projectId } = action as ClearAlertRulesAction;
                delete draft[projectId];
            });

        default:
            return currentState;
    }
};



const alertRuleIdsByProjectIdReducer = (
    currentState: AlertingState['alertRuleIdsByProjectId'], action: BaseAction,
): AlertingState['alertRuleIdsByProjectId'] => {

    const { type } = action;

    switch (type) {
        case AlertingActionType.SET_ALERT_RULES:
            return produce(currentState, (draft: Draft<typeof currentState>) => {
                const { projectId, alertRules, searchParams } = action as SetAlertRulesAction;
                const temp = draft[projectId] || {
                };
                draft[projectId] = temp;
                temp[searchParams] = {
                    range: alertRules.range,
                    items: alertRules.items.map((alertRule: AlertRule): number => {
                        return alertRule.id;
                    }),
                };
            });

        case AlertingActionType.CLEAR_ALERT_RULES:
            return produce(currentState, (draft: Draft<typeof currentState>) => {
                const { projectId } = action as ClearAlertRulesAction;
                delete draft[projectId];
            });

        default:
            return currentState;
    }
};



const alertsByProjectIdByAlertIdReducer = (
    currentState: AlertingState['alertsByProjectIdByAlertId'], action: BaseAction,
): AlertingState['alertsByProjectIdByAlertId'] => {
    const { type } = action;

    switch (type) {

        case AlertingActionType.SET_ALERTS:
            return produce(currentState, (draft: Draft<typeof currentState>) => {
                const { projectId, alerts } = action as SetAlertsAction;
                const temp = draft[projectId] || {
                };
                draft[projectId] = temp;
    
                alerts.items.forEach((alert: Alert) => {
                    temp[alert.id] = castDraft(alert);
                });
            });

        case AlertingActionType.SET_ALERT:
            return produce(currentState, (draft: Draft<typeof currentState>) => {
                const { projectId, alert } = action as SetAlertAction;
                const temp = draft[projectId] || {
                };
                draft[projectId] = temp;
                temp[alert.id] = castDraft(alert);
            });

        case AlertingActionType.CLEAR_ALERTS:
            return produce(currentState, (draft: Draft<typeof currentState>) => {
                const { projectId } = action as ClearAlertsAction;
                delete draft[projectId];
            });

        default:
            return currentState;
    }
};



const alertIdsByProjectIdReducer = (
    currentState: AlertingState['alertIdsByProjectId'], action: BaseAction,
): AlertingState['alertIdsByProjectId'] => {

    const { type } = action;

    switch (type) {
        case AlertingActionType.SET_ALERTS:
            return produce(currentState, (draft: Draft<typeof currentState>) => {
                const { projectId, alerts, searchParams } = action as SetAlertsAction;
                const temp = draft[projectId] || {
                };
                draft[projectId] = temp;
                temp[searchParams] = {
                    range: alerts.range,
                    items: alerts.items.map((alert: Alert): string => {
                        return alert.id;
                    }),
                };
            });

        case AlertingActionType.CLEAR_ALERTS:
            return produce(currentState, (draft: Draft<typeof currentState>) => {
                const { projectId } = action as ClearAlertsAction;
                delete draft[projectId];
            });

        default:
            return currentState;
    }
};



export const alertRulesStateReducer = (currentState: AlertingState, action: BaseAction): AlertingState => {
    return produce(currentState, (draft: Draft<AlertingState>) => {
        draft.alertRulesByProjectIdByAlertRuleId = castDraft(alertRulesByProjectIdByAlertRuleIdReducer(currentState.alertRulesByProjectIdByAlertRuleId, action));
        draft.alertRuleIdsByProjectId = castDraft(alertRuleIdsByProjectIdReducer(currentState.alertRuleIdsByProjectId, action));

        draft.alertsByProjectIdByAlertId = castDraft(alertsByProjectIdByAlertIdReducer(currentState.alertsByProjectIdByAlertId, action));
        draft.alertIdsByProjectId = castDraft(alertIdsByProjectIdReducer(currentState.alertIdsByProjectId, action));
    });
};
