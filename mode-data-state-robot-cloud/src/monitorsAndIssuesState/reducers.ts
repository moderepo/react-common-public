import produce, {
    castDraft, Draft,
} from 'immer';
import {
    Monitor, Issue, Comment,
} from '@moderepo/mode-apis';
import {
    BaseAction,
} from '@moderepo/mode-data-state-base';
import {
    MonitorsAndIssuesState,
} from './models';
import {
    MonitorsAndIssuesActionType, SetMonitorsAction, SetMonitorAction, SetIssueAction, SetIssuesAction, ClearIssuesAction, ClearMonitorsAction,
    SetIssueCommentsAction, SetIssueCommentAction, ClearIssueCommentsAction,
} from './actions';



const monitorsByIdReducer = (
    currentState: MonitorsAndIssuesState['monitorsById'], action: BaseAction,
): MonitorsAndIssuesState['monitorsById'] => {
    const { type } = action;

    switch (type) {
        case MonitorsAndIssuesActionType.SET_MONITORS:
            return produce(currentState, (draft: Draft<typeof currentState>) => {
                const actualAction = action as SetMonitorsAction;
                const { monitors } = actualAction;

                monitors.items.forEach((monitor: Monitor) => {
                    draft[monitor.id] = castDraft(monitor);
                });
            });

        case MonitorsAndIssuesActionType.SET_MONITOR:
            // When an monitor is updated, we need to update the associated monitor in the map of Monitors by id
            return produce(currentState, (draft: Draft<typeof currentState>) => {
                const actualAction = action as SetMonitorAction;
                draft[actualAction.monitor.id] = castDraft(actualAction.monitor);
            });

        default:
            return currentState;
    }
};



const monitorIdsByProjectIdReducer = (
    currentState: MonitorsAndIssuesState['monitorIdsByProjectId'], action: BaseAction,
): MonitorsAndIssuesState['monitorIdsByProjectId'] => {

    const { type } = action;

    switch (type) {
        case MonitorsAndIssuesActionType.SET_MONITORS:

            return produce(currentState, (draft: Draft<typeof currentState>) => {
                const actualAction = action as SetMonitorsAction;

                // actualAction.issues contains the complete Issue data. However, we only need to save the list of issue IDs
                const temp = draft[actualAction.projectId] || {
                };
                draft[actualAction.projectId] = temp;
                
                // actualAction.monitors contains the complete Monitor data. However, we only need to save the list of Monitor IDs
                temp[actualAction.searchParams] = {
                    range: actualAction.monitors.range,
                    items: actualAction.monitors.items.map((monitor: Monitor) => {
                        return monitor.id;
                    }),
                };
            });

        case MonitorsAndIssuesActionType.CLEAR_MONITORS:
            return produce(currentState, (draft: Draft<typeof currentState>) => {
                const actualAction = action as ClearMonitorsAction;
                delete draft[actualAction.projectId];
            });


        default:
            return currentState;
    }
};



const issuesByIdReducer = (
    currentState: MonitorsAndIssuesState['issuesById'], action: BaseAction,
): MonitorsAndIssuesState['issuesById'] => {
    const { type } = action;

    switch (type) {
        case MonitorsAndIssuesActionType.SET_ISSUES:
            return produce(currentState, (draft: Draft<typeof currentState>) => {
                const actualAction = action as SetIssuesAction;
                const { issues } = actualAction;

                issues.items.forEach((issue: Issue) => {
                    draft[issue.id] = castDraft(issue);
                });
            });

        case MonitorsAndIssuesActionType.SET_ISSUE:
            // When an issue is updated, we need to update the associated issue in the map of issues by id
            return produce(currentState, (draft: Draft<typeof currentState>) => {
                const actualAction = action as SetIssueAction;
                draft[actualAction.issue.id] = castDraft(actualAction.issue);
            });

        default:
            return currentState;
    }
};



const issueIdsByProjectIdReducer = (
    currentState: MonitorsAndIssuesState['issueIdsByProjectId'], action: BaseAction,
): MonitorsAndIssuesState['issueIdsByProjectId'] => {

    const { type } = action;

    switch (type) {
        case MonitorsAndIssuesActionType.SET_ISSUES:

            return produce(currentState, (draft: Draft<typeof currentState>) => {
                const actualAction = action as SetIssuesAction;

                // actualAction.issues contains the complete Issue data. However, we only need to save the list of issue IDs
                const temp = draft[actualAction.projectId] || {
                };
                draft[actualAction.projectId] = temp;
            
                temp[actualAction.searchParams] = {
                    range: actualAction.issues.range,
                    items: actualAction.issues.items.map((issue: Issue) => {
                        return issue.id;
                    }),
                };
            });

        case MonitorsAndIssuesActionType.CLEAR_ISSUES:
            return produce(currentState, (draft: Draft<typeof currentState>) => {
                const actualAction = action as ClearIssuesAction;
                delete draft[actualAction.projectId];
            });

        default:
            return currentState;
    }
};



const commentsByIdReducer = (
    currentState: MonitorsAndIssuesState['commentsById'], action: BaseAction,
): MonitorsAndIssuesState['commentsById'] => {
    const { type } = action;

    switch (type) {
        case MonitorsAndIssuesActionType.SET_ISSUE_COMMENTS:
            return produce(currentState, (draft: Draft<typeof currentState>) => {
                const actualAction = action as SetIssueCommentsAction;
                const { comments } = actualAction;

                comments.items.forEach((comment: Comment) => {
                    draft[comment.id] = comment;
                });
            });

        case MonitorsAndIssuesActionType.SET_ISSUE_COMMENT:
            // When an issue is updated, we need to update the associated issue in the map of issues by id
            return produce(currentState, (draft: Draft<typeof currentState>) => {
                const actualAction = action as SetIssueCommentAction;
                draft[actualAction.comment.id] = actualAction.comment;
            });

        default:
            return currentState;
    }
};


/**
 * This reducer will take care of managing the state.commentIdsByIssueId map
 * @param currentState
 * @param action
 */
const commentIdsByIssueIdReducer = (
    currentState: MonitorsAndIssuesState['commentIdsByIssueId'], action: BaseAction,
): MonitorsAndIssuesState['commentIdsByIssueId'] => {

    const { type } = action;

    switch (type) {
        case MonitorsAndIssuesActionType.SET_ISSUE_COMMENTS:

            return produce(currentState, (draft: Draft<typeof currentState>) => {
                const actualAction = action as SetIssueCommentsAction;

                // actualAction.issueId contains the complete Comment data. However, we only need to save the list of comment IDs
                const temp = draft[actualAction.issueId] || {
                };
                draft[actualAction.issueId] = temp;
                
                temp[actualAction.searchParams] = {
                    range: actualAction.comments.range,
                    items: actualAction.comments.items.map((comment: Comment) => {
                        return comment.id;
                    }),
                };
            });

        case MonitorsAndIssuesActionType.CLEAR_ISSUE_COMMENTS:
            return produce(currentState, (draft: Draft<typeof currentState>) => {
                const actualAction = action as ClearIssueCommentsAction;
                delete draft[actualAction.issueId];
            });

        default:
            return currentState;
    }
};



export const monitorsAndIssuesStateReducer = (currentState: MonitorsAndIssuesState, action: BaseAction): MonitorsAndIssuesState => {
    return produce(currentState, (draft: Draft<MonitorsAndIssuesState>) => {
        draft.monitorsById = castDraft(monitorsByIdReducer(currentState.monitorsById, action));
        draft.monitorIdsByProjectId = castDraft(monitorIdsByProjectIdReducer(currentState.monitorIdsByProjectId, action));

        draft.issuesById = castDraft(issuesByIdReducer(currentState.issuesById, action));
        draft.issueIdsByProjectId = castDraft(issueIdsByProjectIdReducer(currentState.issueIdsByProjectId, action));

        draft.commentsById = commentsByIdReducer(currentState.commentsById, action);
        draft.commentIdsByIssueId = castDraft(commentIdsByIssueIdReducer(currentState.commentIdsByIssueId, action));
    });
};
