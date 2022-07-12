/* eslint-disable camelcase */
import {
    AxiosRequestConfig,
} from 'axios';
import {
    RequestMethod, SortOrder,
} from '.';
import {
    AppProxyAPI,
} from './AppProxyAPI';


export interface EventLogRecordField {
    [fieldName: string]: string | number | null | undefined;
}


export interface EventLogRecord {
    readonly timestamp: string;
    readonly searchKey: string;
    readonly projectId: number;
    readonly homeId: number;
    readonly eventKey: string;
    readonly tags: readonly string[];
    readonly fields: readonly EventLogRecordField[];
    readonly createdAt: string;
    readonly updatedAt: string;
}

export interface EventLogData {
    readonly begin: string;
    readonly end: string;
    readonly limit: number;
    readonly skip: number;
    readonly total: number;
    readonly records: readonly EventLogRecord[];
}


export interface GetEventLogFilter {
    // commas separated keys
    readonly searchKeys: string;
    readonly begin: string;
    readonly end: string;
    readonly limit?: number | undefined;
    readonly skip?: number | undefined;
    readonly sortBy?: SortOrder | undefined;
    readonly attributesQuery?: string | undefined;
}


/**
 * This is the class used for making API call to MODE's app proxy server.
 */
export class ModeAppProxyAPI extends AppProxyAPI {

    // Singleton instance of ModeAppProxyAPI API.
    private static instance: ModeAppProxyAPI;


    /**
     * Return an Instance of ModeAppProxyAPI. This is what dev should be using to get an instance of ModeAppProxyAPI
     * and use it to make API call.
     */
    public static getInstance (): ModeAppProxyAPI {
        if (!ModeAppProxyAPI.instance) {
            ModeAppProxyAPI.instance = new ModeAppProxyAPI();
        }
        return ModeAppProxyAPI.instance;
    }


    /**
     * Generic function to send a request to the app proxy server
     * @param homeId
     * @param logSourcePath
     * @returns
     */
    public async getEventLog (
        homeId: number,
        logSourcePath: string,
        filters: GetEventLogFilter,
    ): Promise<EventLogData> {
        const response = await this.sendRequest(
            RequestMethod.GET, `homes/${homeId}/appProxy${logSourcePath.startsWith('/') ? '' : '/'}${logSourcePath}`, filters,
        );
        return response.data as EventLogData;
    }



    /**
     * Generic function to send a request to the app proxy server
     * @param homeId
     * @param relativePath
     * @returns
     */
    public async sendAppProxyRequest (
        method: RequestMethod,
        homeId: number,
        relativePath: string,
        data?: any,
        headers?: any,
        otherConfigs?: Omit<AxiosRequestConfig, 'method' | 'url' |'headers'>,
    ): Promise<any> {
        const response = await this.sendRequest(
            method, `homes/${homeId}/appProxy${relativePath.startsWith('/') ? '' : '/'}${relativePath}`, data, headers, otherConfigs,
        );
        return response;
    }
}
