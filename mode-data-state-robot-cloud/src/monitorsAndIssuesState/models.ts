import {
    PaginationDataSet, Monitor, Issue, Comment,
} from '@moderepo/mode-apis';



export interface MonitorsAndIssuesState {
    readonly monitorsById: {[monitorId: number]: Monitor};
    readonly monitorIdsByProjectId: {
        readonly [projectId: number]: {
            readonly [searchParams: string]: PaginationDataSet<number> | undefined;
        } | undefined;
    }

    readonly issuesById: {[issueId: number]: Issue};
    readonly issueIdsByProjectId: {
        readonly [projectId: number]: {
            readonly [searchParams: string]: PaginationDataSet<number> | undefined;
        } | undefined;
    }

    readonly commentsById: {[commentId: number]: Comment};
    readonly commentIdsByIssueId: {
        readonly [issueId: number]: {
            readonly [searchParams: string]: PaginationDataSet<number> | undefined;
        } | undefined;
    }
}


export const initialMonitorsAndIssuesState: MonitorsAndIssuesState = {
    monitorsById: {
    },
    monitorIdsByProjectId: {
    },
    issuesById: {
    },
    issueIdsByProjectId: {
    },
    commentsById: {
    },
    commentIdsByIssueId: {
    },
};
