/* eslint-disable no-underscore-dangle */
import axios, {
    AxiosRequestConfig, AxiosResponse, AxiosInstance,
} from 'axios';
import {
    ApiError, ApiErrorCode,
} from './models';



/**
 * The set of request methods that we can send to the backend
 */
export enum RequestMethod {
    GET = 'GET',
    POST = 'POST',
    PUT = 'PUT',
    PATCH = 'PATCH',
    DELETE = 'DELETE',
    OPTION = 'OPTION'
}



/**
 * This is the Base class for all the API classes. This class only provide some of the generic functionalities
 * for all API classes but it does not have any function to make API call. The subclasses will need to implement
 * the specific API call.
 */
export abstract class BaseAPI {

    // An instance of axios object to be used for making all API call
    protected axios: AxiosInstance;

    // A map of current in progress GET requests. We need to keep track of the GET requests that are currently in progress
    // so that if there is another EXACT request with the same endpoint and params, we don't need to make any API
    // call. We will wait for the current in progress request to finish and then return the same response to both caller.
    // We will use base64 to encode the request params. So if 2 requests have the same end point and the same params,
    // they will have the same hash and we know they are the same request.
    private pendingGetRequests: { [hashKey: string]: Promise<AxiosResponse<any>> | undefined} = {
    };


    protected constructor (config: any) {
        this.axios = axios.create(config);


        // These functions will be passed to axios as callback therefore when they are called, 'this'
        // will not be referred to API instances. WE need to bind these function in order to use 'this'
        // when they are called.
        this.onFulfilledRequest = this.onFulfilledRequest.bind(this);
        this.onRejectedRequest = this.onRejectedRequest.bind(this);
        this.onFulfilledResponse = this.onFulfilledResponse.bind(this);
        this.onRejectedResponse = this.onRejectedResponse.bind(this);

        // Intercept all requests and responses so that we can do anything we need to be BEFORE a request is
        // made and AFTER a response is received.
        this.axios.interceptors.request.use(this.onFulfilledRequest, this.onRejectedRequest);
        this.axios.interceptors.response.use(this.onFulfilledResponse, this.onRejectedResponse);
    }


    /**
     * Helper function to actually send the request.
     *
     * @param method - The request method to use
     * @param path - The path of the endpoint EXCLUDING the base url which is already defined in the default config.
     * @param data - The JSON data to be sent with the request
     * @param headers - The headers to be added to the request headers replacing the default headers
     * @param otherConfigs - Any other Axios Request Config we want to pass to Axios that are not 'method', 'url', and 'header'
     */
    public sendRequest (
        method: RequestMethod,
        path: string,
        data?: any,
        headers?: any,
        otherConfigs?: Omit<AxiosRequestConfig, 'method' | 'url' |'headers'>,
    ): Promise<AxiosResponse<any>> {
        const config = {
            method,
            url: path,
            headers,
            ...otherConfigs,
        } as AxiosRequestConfig;

        if (data) {
            if (method === RequestMethod.GET) {
                config.params = data;
            } else {
                config.data = data;
            }
        }


        if (method === RequestMethod.GET) {
        // Get the base64 encoded value of the request data e.g. url, params, headers, etc...
            const hash = window.btoa(JSON.stringify(config));

            const existingPendingRequest = this.pendingGetRequests[hash];
            if (existingPendingRequest) {
                // If there is a request in pending, return the same promise for that pending request
                return existingPendingRequest;
            }

            // Create a new promise. This promise will take care of making the API call and when it is completed,
            // it will resolve the promise.
            const promise = new Promise<AxiosResponse<any>>((resolve, reject) => {
                this.axios.request(config).then((response: AxiosResponse<any>) => {
                    delete this.pendingGetRequests[hash];
                    resolve(response);
                }).catch((error) => {
                    delete this.pendingGetRequests[hash];
                    reject(error);
                });
            });

            // store the promise in the pending requests and return it.
            this.pendingGetRequests[hash] = promise;
            return promise;
        }

        return this.axios.request(config);
    }


    /**
     * Helper function to actually send the form request. This is similar to the sendRequest except that the data will be
     * sent as FormData.
     *
     * @param method - The request method. We will only allow RequestMethod POST | PUT | PATCH since it doesn't make sense for other methods.
     * @param path - The path of the endpoint EXCLUDING the base url which is already defined in the default config.
     * @param data - The JSON data to be sent with the request
     * @param headers - The headers to be added to the request headers replacing the default headers
     * @param otherConfigs - Any other Axios Request Config we want to pass to Axios that are not 'method', 'url', and 'header'
     */
    public sendFormRequest (
        method: RequestMethod.POST | RequestMethod.PUT | RequestMethod.PATCH,
        path: string,
        data?: FormData,
        headers?: any,
        otherConfigs?: Omit<AxiosRequestConfig, 'method' | 'url' |'headers'>,
    ): Promise<AxiosResponse<any>> {
        return this.sendRequest(method, path, data, {
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8', ...headers,
        }, otherConfigs);
    }



    /**
     * Normalize errors from backend or other type of error to ErrorResponse object.
     */
    protected normalizeError (error: any): ApiError {
        let code: string = ApiErrorCode.UNKNOWN;
        let status: number = 400;
        let message: string = 'Unknown error';

        if (error) {
            if (error.response !== undefined) {
                const reason: string | undefined = error.response.data && error.response.data.reason
                    ? error.response.data.reason.toUpperCase()
                    : undefined;

                if (error.response.status !== undefined) {
                    status = error.response.status;
                }

                // If reason is provided, use reason as error code and message
                if (reason) {
                    message = reason;
                    code = reason;
                } else {
                    // Convert backend status code to frontend error code
                    switch (error.response.status) {
                        case 401:
                        case 403:
                        case 503:
                            // use generic FORBIDDEN error code
                            code = ApiErrorCode.FORBIDDEN;
                            message = 'forbidden';
                            break;
                        case 404:
                            // use generic NOT_FOUND error code
                            code = ApiErrorCode.NOT_FOUND;
                            message = 'not found';
                            break;
                        default:
                            code = ApiErrorCode.UNKNOWN;
                            message = 'unknown error';
                    }
                }
            } else {
                // Probably COR error
                code = ApiErrorCode.NETWORK_ERROR;
                message = 'network error';
            }
        }

        return new ApiError(code, status, message);
    }



    /**
     * Intercept all API requests and do something with the request before sending it to the server. These are abstract
     * because only the subclasses know how to handle these
     */
    protected abstract onFulfilledRequest (config: AxiosRequestConfig): AxiosRequestConfig | Promise<AxiosRequestConfig>;

    protected abstract onRejectedRequest (error: any): any;


    /**
     * Intercept all API responses and do something with the response before passing it to the requester. These are abstract
     * because only the subclasses know how to handle these
     */
    protected abstract onFulfilledResponse (response: AxiosResponse<any>): AxiosResponse<any> | Promise<AxiosResponse<any>>;

    protected abstract onRejectedResponse (error: any): any;

}
