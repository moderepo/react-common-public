import {
    PaginationDataSet, Monitor, Issue, RobotCloudAPI, MonitorSeverity, FetchIssueFilters, Comment, EditableMonitorData,
} from '@moderepo/mode-apis';
import {
    ExtDispatch, BaseAction, searchParamsToString,
} from '@moderepo/mode-data-state-base';
import {
    RCDataStateAction, RCThunkAction,
} from '../actions';

/**
 * The types of action that can be dispatched to update this sub state.
 */
export enum MonitorsAndIssuesActionType {
    SET_MONITORS = 'set project monitors',
    SET_MONITOR = 'set project monitor',
    CLEAR_MONITORS = 'reset project monitors',
    SET_ISSUES = 'set project issues',
    SET_ISSUE = 'set project issue',
    CLEAR_ISSUES = 'clear project issues',

    SET_ISSUE_COMMENTS = 'set issue comments',
    SET_ISSUE_COMMENT = 'set issue comment',
    CLEAR_ISSUE_COMMENTS = 'clear issue comment',
}



/**
 * The Action interface for setting a list of monitors that belonged to a project.
 * @param type - The action type
 * @param projectId - The project id
 * @param monitors` - The array of Monitors
 */
export interface SetMonitorsAction extends BaseAction {
    readonly type: MonitorsAndIssuesActionType.SET_MONITORS;
    readonly projectId: number;
    readonly monitors: PaginationDataSet<Monitor>;
    readonly searchParams: string;
}



/**
 * The action interface for setting a project's monitor.
 * @param type - The action type
 * @param projectId - The project id
 * @param monitor - The project monitor we want to set.
 */
export interface SetMonitorAction extends BaseAction {
    readonly type: MonitorsAndIssuesActionType.SET_MONITOR;
    readonly projectId: number;
    readonly monitor: Monitor;
}



export interface ClearMonitorsAction extends BaseAction {
    readonly type: MonitorsAndIssuesActionType.CLEAR_MONITORS;
    readonly projectId: number;
}


/**
 * The Action interface for setting a list of issues that belonged to a project.
 * @param type - The action type
 * @param projectId - The project id
 * @param issues - The array of issues
 */
export interface SetIssuesAction extends BaseAction {
    readonly type: MonitorsAndIssuesActionType.SET_ISSUES;
    readonly projectId: number;
    readonly issues: PaginationDataSet<Issue>;
    readonly searchParams: string;
}



/**
 * The action interface for setting a project's issue.
 * @param type - The action type
 * @param projectId - The project id
 * @param issue - The project issue we want to set.
 */
export interface SetIssueAction extends BaseAction {
    readonly type: MonitorsAndIssuesActionType.SET_ISSUE;
    readonly projectId: number;
    readonly issue: Issue;
}

export interface ClearIssuesAction extends BaseAction {
    readonly type: MonitorsAndIssuesActionType.CLEAR_ISSUES;
    readonly projectId: number;
}


/**
 * The Action interface for setting a list of comments for an issue
 * @param type - The action type
 * @param projectId - The project id
 * @param issueId - The issue the comments belonged to
 * @param comments - The list of comments
 * @param searchParams - The stringified search params
 */
export interface SetIssueCommentsAction extends BaseAction {
    readonly type: MonitorsAndIssuesActionType.SET_ISSUE_COMMENTS;
    readonly projectId: number;
    readonly issueId: number;
    readonly comments: PaginationDataSet<Comment>;
    readonly searchParams: string;
}



/**
 * The action interface for setting a comment for an issue
 * @param type - The action type
 * @param projectId - The project id
 * @param issueId - The issue the comment belonged to
 * @param comment - The comment to set
 */
export interface SetIssueCommentAction extends BaseAction {
    readonly type: MonitorsAndIssuesActionType.SET_ISSUE_COMMENT;
    readonly projectId: number;
    readonly issueId: number;
    readonly comment: Comment;
}



export interface ClearIssueCommentsAction extends BaseAction {
    readonly type: MonitorsAndIssuesActionType.CLEAR_ISSUE_COMMENTS;
    readonly projectId: number;
    readonly issueId: number;
}



export const setMonitors = (projectId: number, monitors: PaginationDataSet<Monitor>, searchParams: any): SetMonitorsAction => {
    return {
        type: MonitorsAndIssuesActionType.SET_MONITORS,
        projectId,
        monitors,
        searchParams,
    };
};


export const setMonitor = (projectId: number, monitor: Monitor): SetMonitorAction => {
    return {
        type: MonitorsAndIssuesActionType.SET_MONITOR,
        projectId,
        monitor,
    };
};



export const clearMonitors = (projectId: number): ClearMonitorsAction => {
    return {
        type: MonitorsAndIssuesActionType.CLEAR_MONITORS,
        projectId,
    };
};


export const setIssues = (projectId: number, issues: PaginationDataSet<Issue>, searchParams: any): SetIssuesAction => {
    return {
        type: MonitorsAndIssuesActionType.SET_ISSUES,
        projectId,
        issues,
        searchParams,
    };
};


export const setIssue = (projectId: number, issue: Issue): SetIssueAction => {
    return {
        type: MonitorsAndIssuesActionType.SET_ISSUE,
        projectId,
        issue,
    };
};


export const clearIssues = (projectId: number): ClearIssuesAction => {
    return {
        type: MonitorsAndIssuesActionType.CLEAR_ISSUES,
        projectId,
    };
};



export const setIssueComments = (
    projectId: number, issueId: number, comments: PaginationDataSet<Comment>, searchParams: any,
): SetIssueCommentsAction => {
    return {
        type: MonitorsAndIssuesActionType.SET_ISSUE_COMMENTS,
        projectId,
        issueId,
        comments,
        searchParams,
    };
};


export const setIssueComment = (projectId: number, issueId: number, comment: Comment): SetIssueCommentAction => {
    return {
        type: MonitorsAndIssuesActionType.SET_ISSUE_COMMENT,
        projectId,
        issueId,
        comment,
    };
};


export const clearIssueComments = (projectId: number, issueId: number): ClearIssueCommentsAction => {
    return {
        type: MonitorsAndIssuesActionType.CLEAR_ISSUE_COMMENTS,
        projectId,
        issueId,
    };
};


/**
 * Get data for ALL Monitors in a project
 * @param projectId - The id of the project
 */
export const fetchMonitors = (
    projectId: number,
    pageNumber: number,
    pageSize: number,
    filters?: {
        readonly robotClass?: string;
        readonly robotId?: number;
    },
): RCThunkAction => {
    return async (dataDispatch: ExtDispatch<RCDataStateAction>): Promise<void> => {
        const monitors = await RobotCloudAPI.getInstance().getMonitors(projectId, pageSize * pageNumber, pageSize, filters);
        dataDispatch(setMonitors(projectId, monitors, searchParamsToString({
            pageNumber, pageSize, ...filters,
        })));
    };
};


/**
 * Get 1 monitor from a project
 * @param projectId - The id of the project
 */
export const fetchMonitor = (projectId: number, monitorId: number): RCThunkAction => {
    return async (dataDispatch: ExtDispatch<RCDataStateAction>): Promise<void> => {
        const monitor = await RobotCloudAPI.getInstance().getMonitor(projectId, monitorId);
        dataDispatch(setMonitor(projectId, monitor));
    };
};



/**
 * Create a new monitor
 * @param projectId - The id of the project
 */
export const createMonitor = (projectId: number, agentId: number, data: EditableMonitorData): RCThunkAction => {
    return async (dataDispatch: ExtDispatch<RCDataStateAction>): Promise<void> => {
        await RobotCloudAPI.getInstance().createMonitor(projectId, agentId, data);
        // clear the current list of Monitors because it is no longer valid
        dataDispatch(clearMonitors(projectId));
    };
};


/**
 * Update a Monitor
 * @param projectId - The id of the project
 */
export const updateMonitor = (projectId: number, agentId: number, monitorId: number, data: EditableMonitorData): RCThunkAction => {
    return async (): Promise<void> => {
        await RobotCloudAPI.getInstance().updateMonitor(projectId, agentId, monitorId, data);
    };
};


/**
 * Delete a Monitor
 * @param projectId
 * @param agentId
 * @param monitorId
 */
export const deleteMonitor = (projectId: number, monitorId: number): RCThunkAction => {
    return async (dataDispatch: ExtDispatch<RCDataStateAction>): Promise<void> => {
        await RobotCloudAPI.getInstance().deleteMonitor(projectId, monitorId);

        // clear the current list of monitors because it is no longer valid
        await dataDispatch(clearMonitors(projectId));
    };
};



/**
 * Backend uses 'limit' and 'skip' attributes however in the frontend, we use pageNumber and pageSize so this function need
 * to accept a filter object that uses pageNumber, pageSize and then convert that to skip/limit before calling the API
 */
export interface UIFetchIssueFilters extends Omit<Omit<FetchIssueFilters, 'skip'>, 'limit'> {
    readonly pageNumber: number;
    readonly pageSize: number;
}


/**
 * Get data for ALL issues in a project
 * @param projectId - The id of the project
 * @param limit
 * @param skip
 * @param filters - OPTIONAL - additional filters
 */
export const fetchIssues = (
    projectId: number,
    filters: UIFetchIssueFilters,
): RCThunkAction => {
    return async (dataDispatch: ExtDispatch<RCDataStateAction>): Promise<void> => {
        const modifiedFilters = {
            ...filters,                                             // Copy the filters
            skip      : filters.pageNumber * filters.pageSize,      // change pageSize/pageNumber to skip/limit
            limit     : filters.pageSize ?? 0,
            pageNumber: undefined,                                  // exclude pageSize/pageNumber
            pageSize  : undefined,
        };
        const issues = await RobotCloudAPI.getInstance().getIssues(projectId, modifiedFilters);
        await dataDispatch(setIssues(projectId, issues, searchParamsToString(filters)));
    };
};


/**
 * Get 1 issue from a project
 * @param projectId - The id of the project
 */
export const fetchIssue = (projectId: number, issueId: number): RCThunkAction => {
    return async (dataDispatch: ExtDispatch<RCDataStateAction>): Promise<void> => {
        const issue = await RobotCloudAPI.getInstance().getIssue(projectId, issueId);
        await dataDispatch(setIssue(projectId, issue));
    };
};


/**
 * Manually create an Issue
 * @param projectId - The id of the project
 */
export const createIssue = (projectId: number, agentId: number, data: {
    homeId: number,
    deviceId: number | undefined,
    robotId: string;
    severity: MonitorSeverity;
    description: string;
    ticketLink?: string | undefined;
}): RCThunkAction => {
    return async (dataDispatch: ExtDispatch<RCDataStateAction>): Promise<void> => {
        await RobotCloudAPI.getInstance().createIssue(projectId, agentId, data);
        // clear the current list of issues because it is no longer valid
        await dataDispatch(clearIssues(projectId));
    };
};



/**
 * Update an issue
 * @param projectId - The id of the project
 */
export const updateIssue = (projectId: number, agentId: number, issueId: number, data: {
    description?: string | undefined;
    severity?: MonitorSeverity | undefined;
    ticketLink?: string | undefined;
    resolvedAgentId?: number | undefined;
    unresolved?: boolean | undefined,
}): RCThunkAction => {
    return async (dataDispatch: ExtDispatch<RCDataStateAction>): Promise<void> => {
        await RobotCloudAPI.getInstance().updateIssue(projectId, agentId, issueId, data);

        // TODO - decide whether to reload the issue or just update the local cache of the issue with the provided params
        await dataDispatch(fetchIssue(projectId, issueId));
    };
};


/**
 * Delete an issue
 * @param projectId
 * @param agentId
 * @param issueId
 */
export const deleteIssue = (projectId: number, issueId: number): RCThunkAction => {
    return async (dataDispatch: ExtDispatch<RCDataStateAction>): Promise<void> => {
        await RobotCloudAPI.getInstance().deleteIssue(projectId, issueId);
        // clear the current list of issues because it is no longer valid
        await dataDispatch(clearIssues(projectId));
    };
};


/**
 * Fetch all comments for a specific issue
 * @param projectId
 * @param issueId
 * @param filters
 */
export const fetchAllIssueComments = (projectId: number, issueId: number, filters?: any): RCThunkAction => {
    return async (dataDispatch: ExtDispatch<RCDataStateAction>): Promise<void> => {
        const comments = await RobotCloudAPI.getInstance().getAllIssueComments(projectId, issueId);
        await dataDispatch(setIssueComments(projectId, issueId, comments, searchParamsToString(filters)));
    };
};



/**
 * Fetch a single comment for a specific issue
 * @param projectId
 * @param issueId
 * @param commentId
 */
export const fetchIssueComment = (projectId: number, issueId: number, commentId: number): RCThunkAction => {
    return async (dataDispatch: ExtDispatch<RCDataStateAction>): Promise<void> => {
        const comment = await RobotCloudAPI.getInstance().getIssueComment(projectId, issueId, commentId);
        await dataDispatch(setIssueComment(projectId, issueId, comment));     // Add the fetched comment to the data state
    };
};



/**
 * Add comment for an issue
 * @param projectId
 * @param issueId
 * @param agentId
 * @param message
 */
export const addCommentForIssue = (projectId: number, issueId: number, agentId: number, message: string): RCThunkAction => {
    return async (dataDispatch: ExtDispatch<RCDataStateAction>): Promise<void> => {
        await RobotCloudAPI.getInstance().addCommentForIssue(projectId, issueId, agentId, message);
        await dataDispatch(clearIssueComments(projectId, issueId));       // clear the current list of comments because it is no longer valid
    };
};



/**
 * Update the comment for an issue
 * @param projectId
 * @param issueId
 * @param commentId
 * @param message
 */
export const updateCommentForIssue = (projectId: number, issueId: number, commentId: number, message: string): RCThunkAction => {
    return async (dataDispatch: ExtDispatch<RCDataStateAction>): Promise<void> => {
        await RobotCloudAPI.getInstance().updateCommentForIssue(projectId, issueId, commentId, message);
        await dataDispatch(fetchIssueComment(projectId, issueId, commentId));       // reload the comment
    };
};



/**
 * Delete a comment from an issue
 * @param projectId
 * @param issueId
 * @param commentId
 */
export const deleteCommentFromIssue = (projectId: number, issueId: number, commentId: number): RCThunkAction => {
    return async (dataDispatch: ExtDispatch<RCDataStateAction>): Promise<void> => {
        await RobotCloudAPI.getInstance().deleteCommentFromIssue(projectId, issueId, commentId);
        await dataDispatch(clearIssueComments(projectId, issueId));       // clear the current list of comments because it is no longer valid
    };
};
