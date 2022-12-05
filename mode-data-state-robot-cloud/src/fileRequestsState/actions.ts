import {
    PaginationDataSet, RobotCloudAPI, FileRequest, FetchFileRequestFilters,
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
export enum FileRequestStateActionType {
    SET_FILE_REQUESTS = 'set file requests',
    SET_FILE_REQUEST = 'set file request',
    CLEAR_FILE_REQUESTS = 'clear file requests',
}



/**
 * The Action interface for setting a list of File Requests that belonged to a project.
 * @param type - The action type
 * @param homeId - The project id
 * @param fileRequests - The array of fileRequests
 */
export interface SetFileRequestsAction extends BaseAction {
    readonly type: FileRequestStateActionType.SET_FILE_REQUESTS;
    readonly homeId: number;
    readonly fileRequests: PaginationDataSet<FileRequest>;
    readonly searchParams: string;
}



/**
 * The action interface for setting a project's fileRequest.
 * @param type - The action type
 * @param homeId - The project id
 * @param fileRequest - The project fileRequest we want to set.
 */
export interface SetFileRequestAction extends BaseAction {
    readonly type: FileRequestStateActionType.SET_FILE_REQUEST;
    readonly homeId: number;
    readonly fileRequest: FileRequest;
}


/**
 * The action interface for clearing all the fileRequests from cache.
 */
export interface ClearFileRequestsAction extends BaseAction {
    readonly type: FileRequestStateActionType.CLEAR_FILE_REQUESTS;
    readonly homeId: number;
}



export const setFileRequests = (homeId: number, fileRequests: PaginationDataSet<FileRequest>, searchParams: any): SetFileRequestsAction => {
    return {
        type: FileRequestStateActionType.SET_FILE_REQUESTS,
        homeId,
        fileRequests,
        searchParams,
    };
};


export const setFileRequest = (homeId: number, fileRequest: FileRequest): SetFileRequestAction => {
    return {
        type: FileRequestStateActionType.SET_FILE_REQUEST,
        homeId,
        fileRequest,
    };
};


export const clearFileRequests = (homeId: number): ClearFileRequestsAction => {
    return {
        type: FileRequestStateActionType.CLEAR_FILE_REQUESTS,
        homeId,
    };
};


/**
 * Backend uses 'limit' and 'skip' attributes however in the frontend, we use pageNumber and pageSize so this function need
 * to accept a filter object that uses pageNumber, pageSize and then convert that to skip/limit before calling the API
 */
export interface UIFetchFileRequestFilters extends Omit<FetchFileRequestFilters, 'skip' | 'limit'> {
    readonly pageNumber: number;
    readonly pageSize: number;
}



/**
 * Get all fileRequests for a project with the given filters
 * @param homeId - The id of the home
 */
export const fetchAllFileRequests = (homeId: number, filters: UIFetchFileRequestFilters): RCThunkAction => {
    return async (dataDispatch: ExtDispatch<RCDataStateAction>): Promise<void> => {
        const modifiedFilters = {
            ...filters,                                             // Copy the filters
            skip      : filters.pageNumber * filters.pageSize,      // change pageSize/pageNumber to skip/limit
            limit     : filters.pageSize ?? 0,
            pageNumber: undefined,                                  // exclude pageSize/pageNumber
            pageSize  : undefined,
        };
        const fileRequests = await RobotCloudAPI.getInstance().getAllFileRequests(homeId, modifiedFilters);
        await dataDispatch(setFileRequests(homeId, fileRequests, searchParamsToString(filters)));
    };
};



/**
 * Get 1 file request
 * @param homeId - The id of the home
 * @param requestId - The id of the request
 */
export const fetchFileRequestById = (
    homeId: number,
    requestId: number,
): RCThunkAction => {
    return async (dataDispatch: ExtDispatch<RCDataStateAction>): Promise<void> => {
        const request = await RobotCloudAPI.getInstance().getFileRequestById(homeId, requestId);
        await dataDispatch(setFileRequest(homeId, request));
    };
};



/**
 * Create a request to DOWNLOAD a file from a DEVICE
 * @param homeId
 * @param deviceId
 * @param fileType
 * @param startDate
 * @param endDate
 * @returns
 */
export const createDownloadFileFromDeviceRequest = (
    homeId: number,
    deviceId: number,
    fileType: string,
    startDate: string,
    endDate: string,
    useCustomDriver: boolean,
): RCThunkAction => {
    return async (dataDispatch: ExtDispatch<RCDataStateAction>): Promise<void> => {
        await RobotCloudAPI.getInstance().createDownloadFileFromDeviceRequest(homeId, deviceId, fileType, startDate, endDate, useCustomDriver);
        await dataDispatch(clearFileRequests(homeId));
    };
};


/**
 * Create a request to DOWNLOAD a file from a CONTROL SERVER
 * @param homeId
 * @param deviceId
 * @param fileType
 * @param startDate
 * @param endDate
 * @returns
 */
export const createDownloadFileFromControlServerRequest = (
    homeId: number,
    deviceId: number,
    fileType: string,
    startDate: string,
    endDate: string,
    useCustomDriver: boolean,
): RCThunkAction => {
    return async (dataDispatch: ExtDispatch<RCDataStateAction>): Promise<void> => {
        await RobotCloudAPI.getInstance().createDownloadFileFromControlServerRequest(homeId, deviceId, fileType, startDate, endDate, useCustomDriver);
        await dataDispatch(clearFileRequests(homeId));
    };
};


/**
 * Create a request to DOWNLOAD a file from a ROBOT
 * @param homeId
 * @param deviceId
 * @param robotId
 * @param fileType
 * @param startDate
 * @param endDate
 * @returns
 */
export const createDownloadFileFromRobotRequest = (
    homeId: number,
    deviceId: number,
    robotId: string,
    fileType: string,
    startDate: string,
    endDate: string,
    useCustomDriver: boolean,
): RCThunkAction => {
    return async (dataDispatch: ExtDispatch<RCDataStateAction>): Promise<void> => {
        await RobotCloudAPI.getInstance().createDownloadFileFromRobotRequest(
            homeId, deviceId, robotId, fileType, startDate, endDate, useCustomDriver,
        );
        await dataDispatch(clearFileRequests(homeId));
    };
};



/**
 * Update an UPLOAD file to DEVICE request that is in INITIATED status
 * @param homeId - The id of the home
 * @param requestId - The id of the request
 */
export const updateUploadFileToDeviceRequestMetadata = (
    homeId: number,
    requestId: number,
    params: {
        readonly fileType: string;
        readonly fileSetSize: number;
        readonly fileSetChecksum?: string | undefined;
    },
): RCThunkAction => {
    return async (dataDispatch: ExtDispatch<RCDataStateAction>): Promise<void> => {
        await RobotCloudAPI.getInstance().updateUploadFileToDeviceRequestMetadata(homeId, requestId, params);
        // refetch request info
        await dataDispatch(fetchFileRequestById(homeId, requestId));
    };
};


/**
 * Update an UPLOAD file to CONTROL SERVER request that is in INITIATED status
 * @param homeId - The id of the home
 * @param requestId - The id of the request
 */
export const updateUploadFileToControlServerRequestMetadata = (
    homeId: number,
    requestId: number,
    params: {
        readonly fileType: string;
        readonly fileSetSize: number;
        readonly fileSetChecksum?: string | undefined;
    },
): RCThunkAction => {
    return async (dataDispatch: ExtDispatch<RCDataStateAction>): Promise<void> => {
        await RobotCloudAPI.getInstance().updateUploadFileToControlServerRequestMetadata(homeId, requestId, params);
        // refetch request info
        await dataDispatch(fetchFileRequestById(homeId, requestId));
    };
};


/**
 * Update an UPLOAD file to ROBOTS request that is in INITIATED status
 * @param homeId - The id of the home
 * @param requestId - The id of the request
 */
export const updateUploadFileToRobotsRequestMetadata = (
    homeId: number,
    requestId: number,
    robotId: string,
    params: {
        readonly fileType: string;
        readonly fileSetSize: number;
        readonly fileSetChecksum?: string | undefined;
    },
): RCThunkAction => {
    return async (dataDispatch: ExtDispatch<RCDataStateAction>): Promise<void> => {
        await RobotCloudAPI.getInstance().updateUploadFileToRobotsRequestMetadata(homeId, requestId, robotId, params);
        // refetch request info
        await dataDispatch(fetchFileRequestById(homeId, requestId));
    };
};



/**
 * To cancel only UPLOAD file to Control Server/Robot requests which are in INITIATED status. These are the requests which require the frontend
 * to upload the file to S3 first and the user decided to cancel it before uploading the file to S3. But once the file is already uploaded
 * to S3 and the frontend already called 'updateUploadFileToControlServerRequestMetadata' to notify the backend, and backend is uploading the
 * files to the control server or robot, then don't use this API to cancel the request, use the 'cancelPendingFileRequest' function.
 * @param homeId
 * @param requestId
 */
export const cancelInitiatedFileUploadRequest = (
    homeId: number,
    requestId: number,
): RCThunkAction => {
    return async (dataDispatch: ExtDispatch<RCDataStateAction>): Promise<void> => {
        await RobotCloudAPI.getInstance().cancelInitiatedFileUploadRequest(homeId, requestId);
        // refetch request info
        await dataDispatch(fetchFileRequestById(homeId, requestId));
    };
};



/**
 * To cancel any request that is in PENDING status. This can be used for Download/Upload requests to Control Server/Robot.
 * @param homeId
 * @param requestId
 */
export const cancelPendingFileRequest = (
    homeId: number,
    requestId: number,
): RCThunkAction => {
    return async (dataDispatch: ExtDispatch<RCDataStateAction>): Promise<void> => {
        await RobotCloudAPI.getInstance().cancelPendingFileRequest(homeId, requestId);
        // refetch request info
        await dataDispatch(fetchFileRequestById(homeId, requestId));
    };
};



/**
 * Delete a request
 * @param homeId - The id of the home
 * @param requestId - The id of the request
 */
export const deleteFileRequest = (
    homeId: number,
    requestId: number,
): RCThunkAction => {
    return async (dataDispatch: ExtDispatch<RCDataStateAction>): Promise<void> => {
        await RobotCloudAPI.getInstance().deleteFileRequest(homeId, requestId);
        await dataDispatch(clearFileRequests(homeId));
    };
};
