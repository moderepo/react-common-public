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



export interface EventLogRecord {
    readonly timestamp: string;
    readonly searchKey?: string | undefined;
    readonly searchKeys?: readonly string[] | undefined;
    readonly projectId: number;
    readonly homeId: number;
    readonly eventKey: string;
    readonly tags: readonly string[];
    readonly fields: object;
    readonly createdAt: string;
    readonly updatedAt: string;
}

export interface EventLogData {
    readonly begin: string;
    readonly end: string;
    readonly limit: number;
    readonly skip: number;
    readonly total: number;
    readonly records?: readonly EventLogRecord[] | null | undefined;
}


export interface GetEventLogFilter {
    // commas separated keys
    readonly searchKeys: string;
    readonly begin: string;
    readonly end: string;
    readonly limit?: number | undefined;
    readonly skip?: number | undefined;
    readonly sortBy?: SortOrder | undefined;
    readonly fieldsFilter?: string | undefined;
    readonly timezone?: string | undefined;

    // Any other name/value that the API support. This depends on the implementation of the AppProxy. Each app proxy can support other
    // params that are not part of the default params e.g. searchKeys, begin, end etc... However, we can't add these params to this interface
    // because those are app proxy specific params. Therefore, we will add this to support other params.
    readonly [paramName: string]: string | number | boolean | readonly string[] | readonly number[] | undefined;
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
