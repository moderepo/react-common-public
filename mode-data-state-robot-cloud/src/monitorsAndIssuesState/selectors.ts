import {
    PaginationDataSet, Monitor, Issue, FetchIssueFilters, Comment,
} from '@moderepo/mode-apis';
import {
    searchParamsToString,
} from '@moderepo/mode-data-state-base';
import {
    createCachedSelector,
} from 're-reselect';
import {
    RCDataState,
} from '../model';
import {
    MonitorsAndIssuesState,
} from './models';



/**
 * This is the actual function that will get the data from the state and return the data requested. However, this function returns a new
 * object every time which can cause an infinite loop in re-rendering if used in React component. Therefore this function is not EXPORTED
 * and we will create another function below which use memoize to cache the result.
 */
const selectMonitorsFunc = (
    monitorsById: MonitorsAndIssuesState['monitorsById'],
    monitorIdsByProjectId: MonitorsAndIssuesState['monitorIdsByProjectId'],
    projectId: number,
    searchParams: string,
): PaginationDataSet<Monitor> | undefined => {
    const dataSet = monitorIdsByProjectId[projectId]?.[searchParams];

    // This will return a new PaginationDataSet of Monitors which can cause infinite loop if we don't use memoize
    if (dataSet) {
        return {
            range: dataSet.range,
            items: dataSet.items.map((monitorId: number) => {
                return monitorsById[monitorId];
            }),
        };
    }
    return undefined;
};


/**
 * This is the public function that components should use to get the cached Monitors data.
 * IMPORTANT NOTE: we will be using the re-reselect library to cache the result because re-select library only support cache of size 1.
 * So if we have multiple components calling this function at the same time with different params e.g. filters, the function will return
 * a new result every time which will cause infinite loop if the result is used in React component.
 * @param state - The data state
 * @param projectId - The project id the issues belonged to
 * @param filters - The filter options e.g. limit, skip, robotClass, robotId, etc...
 */
export const selectMonitors = createCachedSelector(
    (state: RCDataState) => { return state.rcMonitorsAndIssues.monitorsById; },
    (state: RCDataState) => { return state.rcMonitorsAndIssues.monitorIdsByProjectId; },
    (state: RCDataState, projectId: number) => { return projectId; },
    (state: RCDataState, projectId: number, filters: { pageNumber: number, pageSize: number }) => {
        return searchParamsToString(filters);
    },
    selectMonitorsFunc,
)((state: RCDataState, projectId: number, filters?: { pageNumber: number, pageSize: number }) => {
    // Create a cache key for the re-reselect createCachedSelector function. We will use the filters as cache key
    return searchParamsToString(filters);
});
    

/**
 * Get Monitor by its id. We will look up the Monitor from the state's monitorsById map
 * @param state
 * @param monitorId
 */
export const selectMonitorById = (state: RCDataState, monitorId: number | undefined): Monitor | undefined => {
    if (monitorId) {
        return state.rcMonitorsAndIssues.monitorsById[monitorId];
    }
    return undefined;
};


/**
 * This is the actual function that will get the data from the state and return the data requested. However, this function returns a new
 * object every time which can cause an infinite loop in re-rendering if used in React component. Therefore this function is not EXPORTED
 * and we will create another function below which use memoize to cache the result.
 */
const selectIssuesFunc = (
    issuesById: MonitorsAndIssuesState['issuesById'],
    issueIdsByProjectId: MonitorsAndIssuesState['issueIdsByProjectId'],
    projectId: number,
    searchParams: string,
): PaginationDataSet<Issue> | undefined => {
    const dataSet = issueIdsByProjectId[projectId]?.[searchParams];

    // This will return a new PaginationDataSet of Issues which can cause infinite loop if we don't use memoize
    if (dataSet) {
        return {
            range: dataSet.range,
            items: dataSet.items.map((issueId: number) => {
                return issuesById[issueId];
            }),
        };
    }
    return undefined;
};


/**
 * Get the list of issues for the given projectId and the filters.
 * IMPORTANT NOTE: we will be using the re-reselect library to cache the result because re-select library only support cache of size 1.
 * So if we have multiple components calling this function at the same time with different params e.g. filters, the function will return
 * a new result every time which will cause infinite loop if the result is used in React component.
 * @param state - The data state
 * @param projectId - The project id the issues belonged to
 * @param filters - The filter options e.g. limit, skip, createdAgentId, resolvedAgentId, etc...
 */
export const selectIssues = createCachedSelector(
    (state: RCDataState) => { return state.rcMonitorsAndIssues.issuesById; },
    (state: RCDataState) => { return state.rcMonitorsAndIssues.issueIdsByProjectId; },
    (state: RCDataState, projectId: number) => { return projectId; },
    (state: RCDataState, projectId: number, filters: FetchIssueFilters) => { return searchParamsToString(filters); },
    selectIssuesFunc,
)((state: RCDataState, projectId: number, filters: FetchIssueFilters) => {
    // Create a cache key for the re-reselect createCachedSelector function. We will use the filters as cache key
    return searchParamsToString(filters);
});



/**
 * Get issue by its id. We will look up the issue from the state's issuesById map
 * @param state
 * @param issueId
 */
export const selectIssueById = (state: RCDataState, issueId: number|undefined): Issue | undefined => {
    if (issueId) {
        return state.rcMonitorsAndIssues.issuesById[issueId];
    }
    return undefined;
};



/**
 * This is the actual function that will get the data from the state and return the data requested. However, this function returns a new
 * object every time which can cause an infinite loop in re-rendering if used in React component. Therefore this function is not EXPORTED
 * and we will create another function below which use memoize to cache the result.
 */
const selectAllIssueCommentsFunc = (
    commentsById: MonitorsAndIssuesState['commentsById'],
    commentIdsByIssueId: MonitorsAndIssuesState['commentIdsByIssueId'],
    issueId: number,
    searchParams: string,
): PaginationDataSet<Comment> | undefined => {

    const dataSet = commentIdsByIssueId[issueId]?.[searchParams];

    // This will return a new PaginationDataSet of Comment which can cause infinite loop if we don't use memoize
    if (dataSet) {
        return {
            range: dataSet.range,
            items: dataSet.items.map((commentId: number) => {
                return commentsById[commentId];
            }),
        };
    }
    return undefined;
};


/**
 * This is the public function that components should use to get the cached Comments data.
 * IMPORTANT NOTE: we will be using the re-reselect library to cache the result because re-select library only support cache of size 1.
 * So if we have multiple components calling this function at the same time with different params e.g. filters, the function will return
 * a new result every time which will cause infinite loop if the result is used in React component.
 * @param state - The data state
 * @param issueId - The issue id the Comments belonged to
 * @param filters - The filter options e.g. limit, skip, agentId, etc...
 */
export const selectAllIssueComments = createCachedSelector(
    (state: RCDataState) => { return state.rcMonitorsAndIssues.commentsById; },
    (state: RCDataState) => { return state.rcMonitorsAndIssues.commentIdsByIssueId; },
    (state: RCDataState, issueId: number) => { return issueId; },
    (state: RCDataState, issueId: number, filters?: any) => { return searchParamsToString(filters); },
    selectAllIssueCommentsFunc,
)((state: RCDataState, projectId: number, filters?: any) => {
    // Create a cache key for the re-reselect createCachedSelector function. We will use the filters as cache key
    return searchParamsToString(filters);
});
    


/**
 * Get Comment by its id. We will look up the Comment from the state's commentsById map
 * @param state
 * @param commentId
 */
export const selectIssueCommentById = (state: RCDataState, commentId: number|undefined): Comment | undefined => {
    if (commentId) {
        return state.rcMonitorsAndIssues.commentsById[commentId];
    }
    return undefined;
};
