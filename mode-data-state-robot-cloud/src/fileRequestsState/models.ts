import {
    FileRequest, PaginationDataSet,
} from '@moderepo/mode-apis';


export interface FileRequestsState {

    readonly fileRequestsByIdByHomeId: {
        readonly [homeId: number]: {
            readonly [requestId: number]: FileRequest | undefined;
        } | undefined;
    };

    readonly fileRequestIdsByHomeId: {
        readonly [homeId: number]: {
            readonly [searchParams: string]: PaginationDataSet<[number, number]> | undefined;
        } | undefined;
    }

}


export const initialFileRequestsState: FileRequestsState = {
    fileRequestsByIdByHomeId: {

    },
    fileRequestIdsByHomeId: {
    },
};
