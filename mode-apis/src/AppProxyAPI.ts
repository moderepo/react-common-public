/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
import {
    RequestMethod, GatewayDefinition,
} from '@moderepo/mode-apis-base';
import {
    AxiosRequestConfig,
    AxiosResponse,
} from 'axios';
import {
    AppAPI,
} from './appAPI';
import {
    AUTHORIZATION_KEY, AUTHORIZATION_KEY_PREFIX,
} from './models';


/**
 * This is a Custom project settings used for each specific project e.g. RobotCloud project, SensorCloud project, etc...
 * This is NOT a MODE platform feature, it is project feature which only the project knows about. This is implemented
 * by AppProxy and only projects that has it own app proxy has this feature.
 */
export interface CustomProjectSettings {
}



/**
 * This is the base class for All AppProxyAPI. AppProxyAPI is kind of an extension of ModeAPI. It is an interface to external APIs created
 * by developers using ModeAPI. So instead of calling the developers' external APIs directly, we will be calling these API as if we are calling
 * MODE's API, Maze APIs.
 */
export class AppProxyAPI {
    private appAPI: AppAPI;

    private projectToken: string | undefined;

    constructor () {
        this.appAPI = AppAPI.getInstance();
    }


    public setProjectToken (token: string) {
        this.projectToken = token;
    }


    public clearProjectToken () {
        this.projectToken = undefined;
    }


    /**
     * Load a project's gateway catalog. Some project will have some device classes that are used as Gateways. Because device classes documents
     * are very simple with only device class name, tag, and id therefore there is no way of telling if a device class is a gateway. So if a project
     * has a way to store additional metadata for these device classes, and APIs to return these metadata, it can override this function and
     * implement the API to fetch the gateway info.
     * @param projectId
     */
    public async getGatewayCatalog (projectId: number): Promise<readonly GatewayDefinition[]> {
        return [];
    }


    /**
     * Helper function to actually send the request.
     *
     * @param method - The request method to use
     * @param path - The path of the endpoint EXCLUDING the base url which is already defined in the default config.
     * @param data - The JSON data to be sent with the request
     */
    public sendRequest (
        method: RequestMethod,
        path: string,
        data?: any,
        headers?: any,
        otherConfigs?: Omit<AxiosRequestConfig, 'method' | 'url' |'headers'>,
    ): Promise<AxiosResponse<any>> {
        return this.appAPI.sendRequest(method, path, data, {
            ...headers,
            [AUTHORIZATION_KEY]: this.projectToken ? `${AUTHORIZATION_KEY_PREFIX} ${this.projectToken}` : undefined,
        }, otherConfigs);
    }


    /**
     * Helper function to actually send the form request. This is similar to the sendRequest except that the data will be
     * sent as FormData.
     *
     * @param method - The request method to use
     * @param path - The path of the endpoint EXCLUDING the base url which is already defined in the default config.
     * @param data - The JSON data to be sent with the request
     */
    public sendFormRequest (
        method: RequestMethod.POST | RequestMethod.PUT | RequestMethod.PATCH,
        path: string,
        data?: FormData,
        headers?: any,
        otherConfigs?: Omit<AxiosRequestConfig, 'method' | 'url' |'headers'>,
    ): Promise<AxiosResponse<any>> {
        return this.appAPI.sendFormRequest(method, path, data, {
            ...headers,
            [AUTHORIZATION_KEY]: this.projectToken,
        }, otherConfigs);
    }

}
