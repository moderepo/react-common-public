/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
import {
    AxiosRequestConfig, AxiosResponse,
} from 'axios';
import {
    BaseAPI,
} from './baseAPI';


/**
 * This is the API class used for making API calls to any other server other than MODE
 */
export class ExternalAPI extends BaseAPI {

    // Singleton instance of ExternalAPI
    private static instance: ExternalAPI = new ExternalAPI();


    /**
     * Return an Instance of ExternalAPI. This is what dev should be using to get an instance of ExternalAPI
     * and use it to make API call.
     */
    public static getInstance (): ExternalAPI {
        return ExternalAPI.instance;
    }


    /**
     * Intercept all API requests and do something with the request before sending it to the server
     */
    protected onFulfilledRequest (config: AxiosRequestConfig): AxiosRequestConfig | Promise<AxiosRequestConfig> {
        return config;
    }


    protected onRejectedRequest (error: any): any {
        return Promise.reject(this.normalizeError(error));
    }


    /**
     * Intercept all API responses and do something with the response before passing it to the requester
     */
    protected onFulfilledResponse (response: AxiosResponse<any>): AxiosResponse<any> | Promise<AxiosResponse<any>> {
        return response;
    }


    protected onRejectedResponse (error: any): any {
        const apiError = this.normalizeError(error);
        return Promise.reject(apiError);
    }



    /**
     * There is no need to create multiple instances of ExternalAPI so we will make the constructor
     * private to prevent the dev from creating instance of this class
     */
    private constructor () {
        super({
            withCredentials: false,
        });
    }
}
