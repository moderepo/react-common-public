import {
    AxiosRequestConfig, AxiosResponse,
} from 'axios';
import {
    HomeMember, Home, HomeDevice, DeviceRegistrationData, DeviceProvisioningData, KeyValuePair, DeviceCommand, TimeSeriesInfo, TimeSeriesRange,
    TimeSeriesData, TimeSeriesAggregation, SmartModule, ApiErrorCode, ApiError, User, TimeSeriesCollectionInfo, TimeSeriesCollectionData,
    TimeSeriesCollectionRange, TimeSeriesCollectionExportedUrl, BaseAPI, RequestMethod, MemberRole, VideoInfo, TimeSeriesExportInfo,
    TimeSeriesRawData, TimeSeriesCollectionRawData, createFormData, PaginationDataSet, DATA_RANGE_HEADER_KEY, parseDataRange, Entity,
    FetchEntityFilters, EntityClass, UpdateEntityParams, CreateEntityParams, TimeSeriesResolution, UpdatableHomeDeviceProps,
    DeviceConfigFirmwareSchema, AlertRule, FetchAlertRulesFilters, CreateAlertRuleParams, UpdateAlertRuleParams, Alert, FetchAlertsFilters,
} from '@moderepo/mode-apis-base';
import {
    AUTHORIZATION_KEY, AUTHORIZATION_KEY_PREFIX, UserLoginInfo, UserSessionInfo,
} from './models';
import {
    FetchHomeVideosFilters,
} from '.';



/**
 * The home props that can be updated
 */
export interface UpdatableHomeProps {
    readonly name?: string | undefined;
    readonly deactivated?: boolean | undefined;
}



/**
 * These are the API used for end-user applications
 */
export class AppAPI extends BaseAPI {

    // Singleton instance of Application API.
    private static instance: AppAPI;


    // Initialize AppAPI. This should only be called once.
    public static initialize (baseUrl: string, authToken?: string) {
        if (AppAPI.instance) {
            // This error will stop the app so we can just use the default Error type
            throw new Error('AppAPI.initialize has already been called.');
        }
        AppAPI.instance = new AppAPI(baseUrl, authToken);
    }


    /**
     * Return an Instance of AppAPI. This is what dev should be using to get an instance of AppAPI
     * and use it to make API call.
     */
    public static getInstance (): AppAPI {
        if (!AppAPI.instance) {
            // This error will stop the app so we can just use the default Error type
            throw new Error('AppAPI.initialize must be called before it can be used.');
        }
        return AppAPI.instance;
    }


    // The authToken used for making API call.
    private authToken: string | undefined;


    /**
    * Register a new user account
    * @param projectId
    * @param name
    * @param email
    * @param password
    */
    public async registerUser (projectId: number, name: string, email: string, password: string): Promise<User> {
        const response = await this.sendRequest(RequestMethod.POST, '/users', {
            projectId, name, email, password,
        });

        return response.data as User;
    }


    /**
     * Log the user in with the provide email/password.
     */
    public async login (projectId: number, appId: string, email: string, password: string): Promise<UserLoginInfo> {
        const response = await this.sendFormRequest(RequestMethod.POST, '/auth/user', createFormData({
            projectId, appId, email, password,
        }));

        return this.handleLoginResponse(response);
    }


    /**
    * Log the user out
    */
    public async logout (): Promise<void> {
        await this.sendRequest(RequestMethod.DELETE, '/userSession', {
        });
    }

    /**
     * Authenticate user with SMS
     */
    public async authWithSMS (projectId: number, phoneNumber: string): Promise<{
        readonly recipient: string;
    }> {
        const response = await this.sendFormRequest(RequestMethod.POST, '/auth/user/sms', createFormData({
            projectId, phoneNumber,
        }));

        return response.data;
    }

    /**
     * Initiate user email verification. This will send the user an email for them to click on to verify their email address
     * @param projectId
     * @param email
     */
    public async initiateVerifyUserEmail (projectId: number, email: string): Promise<{
        readonly email: string;
    }> {
        const response = await this.sendRequest(RequestMethod.POST, '/auth/user/emailVerification/start', {
            projectId, email,
        });
        return response.data;
    }

    /**
     * Verify the user's email.
     * @param token - The token given to the user when they initiated the email verify flow.
     */
    public async verifyUserEmail (token: string): Promise<{
        readonly projectId: number;
        readonly email: string;
    }> {
        const response = await this.sendRequest(RequestMethod.POST, '/auth/user/emailVerification', {
            token,
        });
        return response.data;
    }

    /**
     * Verify the user's NEW email when they change their email address.
     * @param token - The token given to the user when they initiated the email verify flow.
     */
    public async verifyUserNewEmail (token: string): Promise<{
        readonly projectId: number;
        readonly email: string;
    }> {
        const response = await this.sendRequest(RequestMethod.POST, '/auth/user/newEmailVerification', {
            token,
        });
        return response.data;
    }

    /**
     * Activate a new user account
     * @param token - The token given to the user when they signed up or got an invite
     */
    public async activateAccount (token: string, name: string, password: string): Promise<{
        readonly projectId: number;
        readonly email: string;
    }> {
        const response = await this.sendRequest(RequestMethod.POST, '/auth/user/activation', {
            token, name, password,
        });
        return response.data;
    }

    /**
     * Start Reset user password. This will NOT reset the user password but will only start the reset password process
     * @param projectId
     * @param email
     */
    public async resetPassword (projectId: number, email: string): Promise<{
        readonly email: string;
    }> {
        const response = await this.sendRequest(RequestMethod.POST, '/auth/user/passwordReset/start', {
            projectId, email,
        });
        return response.data;
    }

    /**
     * Complete the Reset the user password process
     * @param token - The token received through email from the 'resetPassword' call
     * @param password - The new password
     */
    public async completeResetPassword (token: string, password: string): Promise<{
        readonly projectId: number;
        readonly email: string;
    }> {
        const response = await this.sendRequest(RequestMethod.POST, '/auth/user/passwordReset', {
            token, newPassword: password,
        });
        return response.data;
    }

    /**
     * Get info about the current user session.
     */
    public async getUserSessionInfo (): Promise<UserSessionInfo> {
        const response = await this.sendRequest(RequestMethod.GET, '/userSession', {
        });
        return response.data as UserSessionInfo;
    }

    /**
     * Set the auth token
     * @param token
     */
    public setAuthToken (authToken: string) {
        this.authToken = authToken;
    }


    /**
     * Clear the auth token
     */
    public clearAuthToken () {
        this.authToken = undefined;
    }


    /**
     * Get a user profile by his user id
     * @param userId - The id of the user to look for
     */
    public async getUserById (userId: number): Promise<User> {
        const response = await this.sendRequest(RequestMethod.GET, `/users/${userId}`);
        return response.data as User;
    }


    /**
     * Update the user profile, only user name for now
     * @param userId - The ID of the user we want to update
     * @param name - The new name to set for the user
     * @param password - The new password to set for the user
     */
    public async updateUser (userId: number, params: {name?: string, password?: string}): Promise<void> {
        await this.sendRequest(RequestMethod.PATCH, `/users/${userId}`, params);
    }


    /**
     * Delete a user. This requires the user's key for the user that is being deleted.
     * @param userId
     * @param projectApiKey: To delete another user that is different from the user which we have the key for. For example, we have userKey for
     *                       user A but we want to make API call to delete user B. To do that, we will need to provide the project API key which
     *                       can be passed as a second param OR set in authToken before calling this API
     */
    public async deleteUser (userId: number, projectApiKey?: string): Promise<void> {
        await this.sendRequest(RequestMethod.DELETE, `/users/${userId}`, undefined, projectApiKey ? {
            [AUTHORIZATION_KEY]: `${AUTHORIZATION_KEY_PREFIX} ${projectApiKey}`,
        } : undefined);
    }


    /**
     * Get all homes belonged to a user
     * @param userId - The id of the user to look for
     */
    public async getUserHomes (userId: number, skip?: number, limit?: number): Promise<PaginationDataSet<Home>> {
        const response = await this.sendRequest(RequestMethod.GET, '/homes', {
            userId, skip, limit,
        });
        
        if (response.data instanceof Array) {
            const range = parseDataRange(response.headers[DATA_RANGE_HEADER_KEY]);
            return {
                range,
                items: response.data as readonly Home[],
            };
        }
        return {
            range: {
                start: 0, end: 0, total: 0,
            },
            items: [],
        };
    }



    /**
     * Get all homes belonged to a Project.
     * NOTE: this required project API key so either pass a project key to this function OR before calling this API, call setAuthToken
     * and pass it a project api key.
     *
     * @param userId - The id of the user to look for
     */
    public async getProjectHomes (projectId: number, skip?: number, limit?: number, projectApiKey?: string): Promise<PaginationDataSet<Home>> {
        const response = await this.sendRequest(RequestMethod.GET, '/homes', {
            projectId, skip, limit,
        }, projectApiKey ? {
            [AUTHORIZATION_KEY]: `${AUTHORIZATION_KEY_PREFIX} ${projectApiKey}`,
        } : undefined);
        
        if (response.data instanceof Array) {
            const range = parseDataRange(response.headers[DATA_RANGE_HEADER_KEY]);
            return {
                range,
                items: response.data as readonly Home[],
            };
        }
        return {
            range: {
                start: 0, end: 0, total: 0,
            },
            items: [],
        };
    }



    /**
     * Get a single home data by the given homeId
     * @param homeId - The id of the home to look for
     */
    public async getHomeById (homeId: number): Promise<Home> {
        const response = await this.sendRequest(RequestMethod.GET, `/homes/${homeId}`);
        return response.data as Home;
    }



    /**
     * Create a new home for a user
     * NOTE: If user key is being used then this will create a home and automatically link the new home to the user whose the key belonged to.
     * If a project key is being used, this will create a home but the new home WILl NOT be linked to a user. It will be a userless home.
     * @param name - The name of the home we want to create
     */
    public async createHome (name: string): Promise<Home> {
        const response = await this.sendRequest(RequestMethod.POST, '/homes', {
            name,
        });
        return response.data as Home;
    }


    /**
     * Delete a home from a user's account
     * @param homeId - The id of the home we want to delete. IMPORTANT NOTE, this will delete the home from MODE project which mean all users
     *                 belonged to this home will not see this home anymore. Use 'removeHomeMember' if we want to remove only 1 user from a home
     */
    public async deleteHome (homeId: number): Promise<void> {
        await this.sendRequest(RequestMethod.DELETE, `/homes/${homeId}`);
    }


    /**
     * Update the user home
     * @param homeId - The id of the user home we want to update
     * @param params - The object contains the home props that needs to be updated
     */
    public async updateHome (homeId: number, params: UpdatableHomeProps, projectApiKey?: string): Promise<void> {
        await this.sendRequest(RequestMethod.PATCH, `/homes/${homeId}`, params, projectApiKey ? {
            [AUTHORIZATION_KEY]: `${AUTHORIZATION_KEY_PREFIX} ${projectApiKey}`,
        } : undefined);
    }


    /**
     * Get all the members of a home
     * @param homeId - The id of the home we want to get the list of members for
     */
    public async getHomeMembers (homeId: number): Promise<readonly HomeMember[]> {
        const response = await this.sendRequest(RequestMethod.GET, `/homes/${homeId}/members`);
        return response.data as readonly HomeMember[];
    }


    /**
     * Add/Invite a user to a home
     * @param homeId - The id of the home we want to add member to
     * @param email - OPTIONAL - The email of the user we want to add/invite if the project user account type is email
     * @param phoneNumber - OPTIONAL - The phone # of the user we want to add to the home if the project user account type is phone
     * @param role - OPTIONAL - The role to set for the new member
     */
    public async addHomeMember (
        homeId: number, { email, phoneNumber, role }: {
            email?: string, phoneNumber?: string, role?: MemberRole
        }): Promise<HomeMember> {
        const response = await this.sendRequest(RequestMethod.POST, `/homes/${homeId}/members`, {
            email, phoneNumber, role,
        });
        return response.data as HomeMember;
    }


    /**
     * Update a home member. Only member "role" can be updated
     * @param homeId - The id of the home we want to add member to
     * @param memberId - The id of the member to be updated
     * @param role - The role to set for the member
     */
    public async updateHomeMember (homeId: number, memberId: number, role: MemberRole): Promise<void> {
        await this.sendRequest(RequestMethod.PATCH, `/homes/${homeId}/members/${memberId}`, {
            role,
        });
    }


    /**
     * Remove a user from a home
     * @param homeId - The id of them home we want to remove the member from
     * @param memberId - The id of the user we want to remove
     */
    public async removeHomeMember (homeId: number, memberId: number): Promise<void> {
        await this.sendRequest(RequestMethod.DELETE, `/homes/${homeId}/members/${memberId}`);
    }


    /**
     * Get the list of devices belonged to a home
     * @param homeId - The id of the home we want to get the devices from
     */
    public async getHomeDevices (homeId: number): Promise<readonly HomeDevice[]> {
        const response = await this.sendRequest(RequestMethod.GET, '/devices', {
            homeId,
        });
        return response.data as readonly HomeDevice[];
    }


    /**
     * Get a device data by the device id
     * @param deviceId - The id of the device we want to get
     */
    public async getHomeDeviceById (deviceId: number): Promise<HomeDevice> {
        const response = await this.sendRequest(RequestMethod.GET, `/devices/${deviceId}`);
        return response.data as HomeDevice;
    }


    /**
     * Get a device data by the device id
     * @param deviceId - The id of the device we want to update
     * @param params: An object with the props we want to update.
     * @param projectApiKey: The project key to use instead of the userKey. This is only needed if we want to update some of the props
     *                       that can only be updated by admin e.g. homeId and claimCode.
     */
    public async updateHomeDevice (deviceId: number, params: UpdatableHomeDeviceProps, projectApiKey?: string): Promise<void> {
        await this.sendRequest(RequestMethod.PATCH, `/devices/${deviceId}`, params, projectApiKey ? {
            [AUTHORIZATION_KEY]: `${AUTHORIZATION_KEY_PREFIX} ${projectApiKey}`,
        } : undefined);
    }


    /**
     * Get all the schemas for device configuration
     */
    public async getDeviceConfigurationSchemas (deviceId: number): Promise<readonly DeviceConfigFirmwareSchema[]> {
        const response = await this.sendRequest(RequestMethod.GET, `/devices/${deviceId}/configSchemas`);
        return response.data as DeviceConfigFirmwareSchema[];
    }


    /**
     * Add a device to a home
     * @param homeId - The id of them home we want to add the device to
     * @param claimCode - The device claim code
     */
    public async addPreprovisionedHomeDevice (homeId: number, claimCode: string): Promise<HomeDevice> {
        const response = await this.sendRequest(RequestMethod.POST, '/devices', {
            homeId, claimCode,
        });
        return response.data as HomeDevice;
    }


    /**
     * Add a device to a home
     * @param homeId - The id of them home we want to add the device to
     * @param claimCode - The device claim code
     */
    public async addOndemandProvisionedHomeDevice (homeId: number, deviceClass: string, token: string): Promise<HomeDevice> {
        const response = await this.sendRequest(RequestMethod.POST, '/devices', {
            homeId, deviceClass, token,
        });
        return response.data as HomeDevice;
    }



    /**
     * Remove a device from a home
     * @param deviceId - The id of the device we want to remove
     */
    public async removeHomeDevice (deviceId: number): Promise<void> {
        await this.sendRequest(RequestMethod.DELETE, `/devices/${deviceId}`);
    }


    /**
     * Put a device into claim mode. This is called before adding a PREPROVISIONED device to a home.
     * @param deviceId - The id of the device we want to put into claim mode
     * @param apiKey - The API key needed to give the user authorization to access the device
     * @param duration - How long to keep the device in claim mode in seconds
     */
    public async enableDeviceClaimMode (deviceId: number, apiKey: string, duration: number): Promise<DeviceRegistrationData> {
        const response = await this.sendRequest(RequestMethod.POST, '/deviceRegistration', {
            deviceId,
            claimable: true,
            duration,
        }, {
            [AUTHORIZATION_KEY]: `${AUTHORIZATION_KEY_PREFIX} ${apiKey}`,
        });
        return response.data;
    }


    /**
     * Start a device provision and get a token back which can be use to add a device.
     * @param homeId
     * @param deviceClass
     * @param deviceTag
     */
    public async startDeviceProvisioning (homeId: number, deviceClass: string, deviceTag?: string): Promise<DeviceProvisioningData> {
        const response = await this.sendRequest(RequestMethod.POST, `/homes/${homeId}/deviceProvisioning`, {
            deviceClass, deviceTag,
        });
        return response.data;
    }


    /**
     * Get all key/value pairs for a given device
     * @param deviceId
     * @param keyPrefix - OPTIONAL - to filter out pairs that don't have key starts with this prefix
     */
    public async getAllDeviceKeyValuePairs (deviceId: number, keyPrefix?: string): Promise<readonly KeyValuePair[]> {
        const response = await this.sendRequest(RequestMethod.GET, `/devices/${deviceId}/kv`, {
            keyPrefix,
        });
        return response.data as readonly KeyValuePair[];
    }

    /**
     * Get 1 key value pairs for a specific device
     */
    public async getDeviceKeyValuePair (deviceId: number, key: string): Promise<KeyValuePair> {
        const response = await this.sendRequest(RequestMethod.GET, `/devices/${deviceId}/kv/${key}`);
        return response.data as KeyValuePair;
    }

    /**
     * Update the value of a specific key value pair
     */
    public async updateDeviceKeyValuePair (deviceId: number, key: string, value: any): Promise<void> {
        await this.sendRequest(RequestMethod.PUT, `/devices/${deviceId}/kv/${key}`, {
            value,
        });
    }

    /**
     * Create a new key value pair. This function does the same thing as the update key/value pair except
     * that is create a key with empty value.
     */
    public async createDeviceKeyValuePair (deviceId: number, key: string, value?: any): Promise<void> {
        await this.updateDeviceKeyValuePair(deviceId, key, value || {
        });
    }

    /**
     * Delete a key value pair
     */
    public async deleteDeviceKeyValuePair (deviceId: number, key: string): Promise<void> {
        await this.sendRequest(RequestMethod.DELETE, `/devices/${deviceId}/kv/${key}`);
    }


    /**
     * Get all key/value pairs for a given home
     * @param homeId
     * @param keyPrefix - OPTIONAL - to filter out pairs that don't have key starts with this prefix
     */
    public async getAllHomeKeyValuePairs (homeId: number, keyPrefix?: string): Promise<readonly KeyValuePair[]> {
        const response = await this.sendRequest(RequestMethod.GET, `/homes/${homeId}/kv`, {
            keyPrefix,
        });
        return response.data as readonly KeyValuePair[];
    }

    /**
     * Get 1 key value pairs for a specific home
     */
    public async getHomeKeyValuePair (homeId: number, key: string): Promise<KeyValuePair> {
        const response = await this.sendRequest(RequestMethod.GET, `/homes/${homeId}/kv/${key}`);
        return response.data as KeyValuePair;
    }

    /**
     * Update the value of a specific key value pair
     */
    public async updateHomeKeyValuePair (homeId: number, key: string, value: any): Promise<void> {
        await this.sendRequest(RequestMethod.PUT, `/homes/${homeId}/kv/${key}`, {
            value,
        });
    }

    /**
     * Create a new key value pair. This function does the same thing as the update key/value pair except
     * that is create a key with empty value.
     */
    public async createHomeKeyValuePair (homeId: number, key: string, value?: any): Promise<void> {
        await this.updateHomeKeyValuePair(homeId, key, value || {
        });
    }

    /**
     * Delete a key value pair
     */
    public async deleteHomeKeyValuePair (homeId: number, key: string): Promise<void> {
        await this.sendRequest(RequestMethod.DELETE, `/homes/${homeId}/kv/${key}`);
    }


    /**
     * Send a command to a device
     */
    public async sendCommandToDevice (deviceId: number, command: DeviceCommand): Promise<void> {
        await this.sendRequest(RequestMethod.PUT, `/devices/${deviceId}/command`, command);
    }


    /**
     * Get all smart modules available for a home
     * @param homeId
     */
    public async getAllHomeSmartModules (homeId: number): Promise<SmartModule[]> {
        const response = await this.sendRequest(RequestMethod.GET, `homes/${homeId}/smartModules`);
        return response.data as SmartModule[];
    }


    /**
     * Get the home's time series info for all series. This will only return the time series'
     * metadata, not the actual time series data.
     * @param homeId
     */
    public async getAllTimeSeriesInfo (homeId: number, smartModuleId: string): Promise<TimeSeriesInfo[]> {
        const response = await this.sendRequest(RequestMethod.GET, `homes/${homeId}/smartModules/${smartModuleId}/timeSeries`);
        return response.data as TimeSeriesInfo[];
    }


    /**
     * Get time series info for a specific series. The returned data is only time series's metadata, not the
     * actual time series data.
     * @param homeId
     */
    public async getTimeSeriesInfo (homeId: number, smartModuleId: string, seriesId: string): Promise<TimeSeriesInfo> {
        const response = await this.sendRequest(RequestMethod.GET, `/homes/${homeId}/smartModules/${smartModuleId}/timeSeries/${seriesId}`);
        return response.data as TimeSeriesInfo;
    }

    /**
     * Delete time series
     */
    public async deleteTimeSeries (
        homeId: number, smartModuleId: string, seriesId: string, projectApiKey?: string,
    ): Promise<void> {
        await this.sendRequest(
            RequestMethod.DELETE, `/homes/${homeId}/smartModules/${smartModuleId}/timeSeries/${seriesId}`, undefined, projectApiKey ? {
                [AUTHORIZATION_KEY]: `${AUTHORIZATION_KEY_PREFIX} ${projectApiKey}`,
            } : undefined,
        );
    }

    /**
     * Get time series's data boundaries. This return the "begin" and "end" date which are the very first and very last
     * date/time of the series data.
     * @param homeId
     */
    public async getTimeSeriesRange (homeId: number, smartModuleId: string, seriesId: string): Promise<TimeSeriesRange> {
        const response = await this.sendRequest(RequestMethod.GET, `/homes/${homeId}/smartModules/${smartModuleId}/timeSeries/${seriesId}/timeRange`);
        return response.data as TimeSeriesRange;
    }


    /**
     * Get time series AGGREGATED data for the specified seriesId
     * @param homeId
     * @param seriesId
     * @param startTime
     * @param endTime
     * @param aggregation - TimeSeriesAggregation e.g. 'min', max', 'avg', 'sum', 'count'
     * @param resolution - '5sec', '15sec', '1min', '10min', '1hour', '1day', '1week', '1month'
     */
    public async getTimeSeriesData (
        homeId: number,
        smartModuleId: string,
        seriesId: string,
        startTime: string,
        endTime: string,
        aggregation?: TimeSeriesAggregation,
        resolution?: TimeSeriesResolution,
    ): Promise<TimeSeriesData> {
        const response = await this.sendRequest(
            RequestMethod.GET,
            `/homes/${homeId}/smartModules/${smartModuleId}/timeSeries/${seriesId}/data?`,
            {
                begin: startTime, end: endTime, aggregation: aggregation || TimeSeriesAggregation.AVG, resolution,
            },
        );

        return response.data as TimeSeriesData;
    }


    /**
     * Get time series RAW data for the specified seriesId
     * @param homeId
     * @param seriesId
     * @param ts - The point in time (in RFC3339) to fetch data entries from.
     * @param limit - If positive, this is the maximum number of data entries at and after ts to be returned.
     * If negative, this is the maximum number of data points before ts to be returned.
     */
    public async getTimeSeriesRawData (
        homeId: number,
        smartModuleId: string,
        seriesId: string,
        ts: string,
        limit: number,
    ): Promise<TimeSeriesRawData> {
        const response = await this.sendRequest(
            RequestMethod.GET,
            `/homes/${homeId}/smartModules/${smartModuleId}/timeSeries/${seriesId}/data?`,
            {
                ts, limit,
            },
        );

        return response.data as TimeSeriesRawData;
    }


    /**
     * Delete time series data at the specified time range
     */
    public async deleteTimeSeriesData (
        homeId: number, smartModuleId: string, seriesId: string, begin: string, end: String, projectApiKey?: string,
    ): Promise<void> {
        await this.sendRequest(
            RequestMethod.DELETE,
            `/homes/${homeId}/smartModules/${smartModuleId}/timeSeries/${seriesId}/data?begin=${begin}&end=${end}`,
            undefined,
            projectApiKey ? {
                [AUTHORIZATION_KEY]: `${AUTHORIZATION_KEY_PREFIX} ${projectApiKey}`,
            } : undefined);
    }


    /**
     * Get the list of all time series collections being stored for this home.
     * @param homeId
     * @param smartModuleId
     */
    public async getAllTimeSeriesCollectionInfo (homeId: number, smartModuleId: string): Promise<TimeSeriesCollectionInfo[]> {
        const response = await this.sendRequest(RequestMethod.GET, `homes/${homeId}/smartModules/${smartModuleId}/collections`);
        return response.data as TimeSeriesCollectionInfo[];
    }


    /**
     * Get the information of a specific time series collection.
     * @param homeId
     * @param smartModuleId
     * @param collectionId
     */
    public async getTimeSeriesCollectionInfo (homeId: number, smartModuleId: string, collectionId: string): Promise<TimeSeriesCollectionInfo> {
        const response = await this.sendRequest(RequestMethod.GET, `/homes/${homeId}/smartModules/${smartModuleId}/collections/${collectionId}`);
        return response.data as TimeSeriesCollectionInfo;
    }


    /**
     * Delete time series collection
     */
    public async deleteTimeSeriesCollection (
        homeId: number, smartModuleId: string, collectionId: string, projectApiKey?: string,
    ): Promise<void> {
        await this.sendRequest(
            RequestMethod.DELETE, `/homes/${homeId}/smartModules/${smartModuleId}/collections/${collectionId}`, undefined, projectApiKey ? {
                [AUTHORIZATION_KEY]: `${AUTHORIZATION_KEY_PREFIX} ${projectApiKey}`,
            } : undefined,
        );
    }


    /**
     * Get the timestamp of the first and last data entries in the specified time series collection.
     * @param homeId
     * @param smartModuleId
     * @param collectionId
     */
    public async getTimeSeriesCollectionRange (homeId: number, smartModuleId: string, collectionId: string): Promise<TimeSeriesCollectionRange> {
        const response = await this.sendRequest(
            RequestMethod.GET, `/homes/${homeId}/smartModules/${smartModuleId}/collections/${collectionId}/timeRange`,
        );
        return response.data as TimeSeriesCollectionRange;
    }


    /**
     * Get time series Collection AGGREGATED data for the specified collection by time range.
     *
     * NOTE: Backend DOES NOT allow "selectValues" to be empty. However, this function will take care of that problem by passing a dummy
     * valueName in the selectedValues array. This mean backend will return a column for this dummy valueName where all the values are null.
     * This function will take care of removing this column as well.
     *
     * @param homeId
     * @param smartModuleId
     * @param collectionId
     * @param startTime - The beginning time of the data entries. The format follows RFC3339.
     * @param endTime - The end time of the data entries. The format follows RFC3339.
     * @param selectValues - The value fields to be returned.
     * @param aggregation - Aggregation function. The string must be either 'avg', 'min', 'max', 'sum' or 'count'. 'avg' is chosen if not provided.
     * @param resolution - '5sec', '15sec', '1min', '10min', '1hour', '1day', '1week', '1month'
     */
    public async getTimeSeriesCollectionData (
        homeId: number,
        smartModuleId: string,
        collectionId: string,
        startTime: string,
        endTime: string,
        selectValues: readonly string[],
        aggregation?: TimeSeriesAggregation,
        resolution?: TimeSeriesResolution,
    ): Promise<TimeSeriesCollectionData> {
        const valueNames = selectValues.length > 0 ? selectValues : ['DUMMY_VALUE_NAME'];
        const response = await this.sendRequest(
            RequestMethod.GET,
            `/homes/${homeId}/smartModules/${smartModuleId}/collections/${collectionId}/data?`,
            {
                begin       : startTime,
                end         : endTime,
                selectValues: valueNames.join(','),
                aggregation : aggregation || TimeSeriesAggregation.AVG,
                resolution,
            },
        );

        const responseData = response.data as TimeSeriesCollectionData;
        const fixedData = selectValues.length > 0
            ? responseData.data
            : responseData.data.map((row) => {
                // Value at index 0 should be the date, value at index 1 should be the value for the DUMMY_VALUE_NAME. We
                // need to delete the value at index 1
                row.splice(1, 1);
                return row;
            });
        
        return {
            ...responseData,
            data: fixedData,
        };
    }


    /**
     * Get time series Collection AGGREGATED data for the specified collectionId before or after a point in time.
     *
     * NOTE: Backend DOES NOT allow "selectValues" to be empty. However, this function will take care of that problem by passing a dummy
     * valueName in the selectedValues array. This mean backend will return a column for this dummy valueName where all the values are null.
     * This function will take care of removing this column as well.
     *
     * @param homeId
     * @param smartModuleId
     * @param collectionId
     * @param ts - The point in time (in RFC3339) to fetch data entries from.
     * @param limit - If positive, this is the maximum number of data entries at and after ts to be returned.
     * If negative, this is the maximum number of data points before ts to be returned.
     * @param selectValues - The value fields to be returned.
     * @param selectTags - The tag fields to be returned.
     */
    public async getTimeSeriesCollectionRawData (
        homeId: number,
        smartModuleId: string,
        collectionId: string,
        ts: string,
        limit: number,
        selectValues: readonly string[],
        selectTags: readonly string[],
    ): Promise<TimeSeriesCollectionRawData> {
        const valueNames = selectValues.length > 0 ? selectValues : ['DUMMY_VALUE_NAME'];
        const response = await this.sendRequest(
            RequestMethod.GET,
            `/homes/${homeId}/smartModules/${smartModuleId}/collections/${collectionId}/data?`,
            {
                ts, limit, selectValues: valueNames.join(','), selectTags: selectTags.join(','),
            },
        );

        const responseData = response.data as TimeSeriesCollectionRawData;
        const fixedData = selectValues.length > 0
            ? responseData.data
            : responseData.data.map((row) => {
                // Value at index 0 should be the date, value at index 1 should be the value for the DUMMY_VALUE_NAME. We
                // need to delete the value at index 1
                row.splice(1, 1);
                return row;
            });
        
        return {
            ...responseData,
            data: fixedData,
        };
    }


    /**
     * WARNING - Use this function carefully because it can be bad for performance. Only use this for a small set of data.
     *
     * Get time series Collection AGGREGATED data for the specified collectionId before or after a point in time.
     *
     * NOTE: Backend DOES NOT allow "selectValues" to be empty. However, this function will take care of that problem by passing a dummy
     * valueName in the selectedValues array. This mean backend will return a column for this dummy valueName where all the values are null.
     * This function will take care of removing this column as well.
     *
     * @param homeId
     * @param smartModuleId
     * @param collectionId
     * @param startTime - The beginning time of the data entries. The format follows RFC3339.
     * @param endTime - The end time of the data entries. The format follows RFC3339.
     * @param selectValues - The value fields to be returned.
     * @param selectTags - The tag fields to be returned.
     */
    public async getTimeSeriesCollectionRawDataWithStartEndTime (
        homeId: number,
        smartModuleId: string,
        collectionId: string,
        startTime: string,
        endTime: string,
        selectValues: readonly string[],
        selectTags: readonly string[],
        maxApiCalls?: number,
    ): Promise<TimeSeriesCollectionRawData> {
        // eslint-disable-next-line no-console, max-len
        console.warn('WARNING: This function "getTimeSeriesCollectionRawDataWithStartEndTime" is not efficient therefore it should be used carefully.');

        const dataPoints: [string, ...(string | number | null)[]][] = [];

        const valueNames = selectValues.length > 0 ? selectValues : ['DUMMY_VALUE_NAME'];
        let startTimestamp = (new Date(startTime)).valueOf();
        const endTimestamp = (new Date(endTime)).valueOf();
        const dataCount = 100;
        let totalDataCount = 0;

        let apiCallCount = 0;

        // Make sure the limit is only 20 API calls to prevent the user from fetching too much data
        const actualMaxApiCall = maxApiCalls !== undefined && maxApiCalls > 1 && maxApiCalls <= 20 ? maxApiCalls : 20;

        while (startTimestamp <= endTimestamp && apiCallCount < actualMaxApiCall) {
            // eslint-disable-next-line no-await-in-loop
            const response = await this.sendRequest(
                RequestMethod.GET,
                `/homes/${homeId}/smartModules/${smartModuleId}/collections/${collectionId}/data?`,
                {
                    ts          : (new Date(startTimestamp)).toISOString(),
                    limit       : dataCount,
                    selectValues: valueNames.join(','),
                    selectTags  : selectTags.join(','),
                },
            );
    
            const responseData = response.data as TimeSeriesCollectionRawData;
            const fixedData = selectValues.length > 0
                ? responseData.data
                : responseData.data.map((row) => {
                    // Value at index 0 should be the date, value at index 1 should be the value for the DUMMY_VALUE_NAME. We
                    // need to delete the value at index 1
                    row.splice(1, 1);
                    return row;
                });
            
            if (fixedData.length > 0) {
                dataPoints.push(...fixedData.filter((dataPoint) => {
                    // remove the data point that is outside of endTimestamp
                    const dataPointTimestamp = (new Date(dataPoint[0])).valueOf();
                    return dataPointTimestamp < endTimestamp;
                }));
            }

            // Calculate the NEXT startTime. The next startTime will be 1 MS after that LAST data point's timestamp in the previous result
            const lastDataPoint = fixedData.length > 0 ? fixedData[fixedData.length - 1] : undefined;

            if (lastDataPoint && fixedData.length >= dataCount) {
                // If the last API call returned some data AND the number of data points returned is at least the number of data point we requested
                // then set the next startTimestamp to the last data point timestamp
                const lastDataPointTimestamp = (new Date(lastDataPoint[0])).valueOf();
                startTimestamp = lastDataPointTimestamp + 1;
            } else {
                // If the last API call didn't return any data OR didn't return enough data then there is probably no more data to fetch
                // so we can just set startTimestamp to the end
                startTimestamp = endTimestamp + 1;
            }

            totalDataCount += dataCount;
            apiCallCount += 1;
        }

        
        return {
            collectionId,
            ts   : startTime,
            limit: totalDataCount,
            data : dataPoints,
        };
    }


    /**
     * Delete time series collection data at the specified time range
     */
    public async deleteTimeSeriesCollectionData (
        homeId: number, smartModuleId: string, collectionId: string, begin: string, end: String, projectApiKey?: string,
    ): Promise<void> {
        await this.sendRequest(
            RequestMethod.DELETE,
            `/homes/${homeId}/smartModules/${smartModuleId}/collections/${collectionId}/data?begin=${begin}&end=${end}`,
            undefined,
            projectApiKey ? {
                [AUTHORIZATION_KEY]: `${AUTHORIZATION_KEY_PREFIX} ${projectApiKey}`,
            } : undefined);
    }


    /**
     * Export time series data by time range. This can be used to export BOTH time series and collection
     * @param homeId
     * @param smartModuleId
     * @param seriesIds - One or more time series to be exported.
     * @param collectionIds - One or more time series collections to be exported.
     * @param startTime - The beginning time of the time range. The format follows RFC3339.
     * @param endTime - The end time of the time range. The format follows RFC3339.
     * @param includeHeader - If true, each exported CSV file will start with a header. Used only when exporting collections.
     */
    public async exportTimeSeriesData (
        homeId: number,
        smartModuleId: string,
        seriesIds: readonly string[] | undefined,
        collectionIds: readonly string[] | undefined,
        startTime: string,
        endTime: string,
        includeHeader?: boolean | undefined,
        padding?: '0' | 'null' | undefined,
        fileNames?: readonly string[] | undefined,
    ): Promise<TimeSeriesExportInfo> {
        const response = await this.sendRequest(
            RequestMethod.POST,
            `/homes/${homeId}/smartModules/${smartModuleId}/export`,
            {
                begin: startTime, end: endTime, seriesIds, collectionIds, includeHeader, padding, fileNames,
            },
        );

        return response.data as TimeSeriesExportInfo;
    }

    /**
     * Export simple time series data by time range.
     * @param homeId
     * @param smartModuleId
     * @param seriesIds - One or more time series to be exported.
     * @param startTime - The beginning time of the time range. The format follows RFC3339.
     * @param endTime - The end time of the time range. The format follows RFC3339.
     */
    public async exportSimpleTimeSeriesData (
        homeId: number,
        smartModuleId: string,
        seriesIds: readonly string[],
        startTime: string,
        endTime: string,
        fileNames?: readonly string[] | undefined,
    ): Promise<TimeSeriesExportInfo> {
        return this.exportTimeSeriesData(homeId, smartModuleId, seriesIds, undefined, startTime, endTime, undefined, undefined, fileNames);
    }

    /**
     * Export time series collections by time range.
     * @param homeId
     * @param smartModuleId
     * @param collectionIds - One or more time series collections to be exported.
     * @param startTime - The beginning time of the time range. The format follows RFC3339.
     * @param endTime - The end time of the time range. The format follows RFC3339.
     * @param includeHeader - If true, each exported CSV file will start with a header.
     */
    public async exportTimeSeriesCollectionData (
        homeId: number,
        smartModuleId: string,
        collectionIds: readonly string[],
        startTime: string,
        endTime: string,
        includeHeader?: boolean | undefined,
        padding?: '0' | 'null' | undefined,
        fileNames?: readonly string[] | undefined,
    ): Promise<TimeSeriesCollectionExportedUrl | TimeSeriesExportInfo> {
        return this.exportTimeSeriesData(homeId, smartModuleId, undefined, collectionIds, startTime, endTime, includeHeader, padding, fileNames);
    }


    /**
     * Get videos for a home from a video smart module
     *
     * @param homeId
     * @param videoSmartModuleId
     * @param filters OPTIONAL filters
     * @param skip the index of the video to start. Minimum value is 0 and default is 0.
     * @param limit the number of videos to fetch starting from the 'skip' index. Value must be in the range 1 - 100 inclusive. Default is 20.
     * @param sortBy The name of the field to sort by e.g. 'searchKey', 'homeId'
     * @param sortOrder The order to sort them, e.g. 'asc' or 'desc'
     */
    public async getHomeVideos (homeId: number, videoSmartModuleId: string, filters?: FetchHomeVideosFilters): Promise<readonly VideoInfo[]> {

        // Backend expect "sortBy" to includes both the sort by field and sort order e.g. 'asc', 'desc' so we need to combine filters.sortBy
        // and filters.sortOrder
        const modifiedFilter = {
            searchKeys     : filters?.searchKeys,
            searchKeyPrefix: filters?.searchKeyPrefix,
            skip           : filters?.skip,
            limit          : filters?.limit,
            sortBy         : filters?.sortBy && filters?.sortOrder  // sortBy and sortOrder BOTH need to be provided or none but can't have 1 only.
                ? `${filters.sortBy}:${filters.sortOrder}`          // concatenate filters.sortBy and filters.sortOrder with ":"
                : undefined,
        };
        const response = await this.sendRequest(RequestMethod.GET, `/homes/${homeId}/smartModules/${videoSmartModuleId}/videos`, modifiedFilter);

        if (response.data?.items) {
            // OLD API which returns an Object that has 'items' as an array of VideoInfo
            // so we need to return the response.data.items instead
            return response.data.items as VideoInfo[];
        }
        return response.data as VideoInfo[];
    }



    /**
     * Delete all home videos that has the specified searchKey
     * @param homeId
     * @param videoSmartModuleId
     * @param searchKey
     */
    public async deleteHomeVideos (homeId: number, videoSmartModuleId: string, searchKey: string): Promise<void> {
        await this.sendRequest(RequestMethod.DELETE, `/homes/${homeId}/smartModules/${videoSmartModuleId}/videos?searchKey=${searchKey}`);
    }


    /**
     * We have a few API call that log the user in and return the login info. Instead of writing the same code to handle the
     * response in many places, this function will take care of handling the response for all of them
     */
    private async handleLoginResponse (response: any): Promise<UserLoginInfo> {

        // Make sure the response has all the necessary data
        if (response.data && response.data.userId && response.data.token) {
            const loginInfo: UserLoginInfo = response.data as UserLoginInfo;
            this.authToken = loginInfo.token;
            return loginInfo;
        }

        // Invalid response from backend, just use 500 status code
        return Promise.reject(new ApiError(ApiErrorCode.INVALID_RESPONSE, 500, 'Invalid response', response?.data));
    }


    /**
     * Get multiple entity classes for a project
     * @param projectId
     * @returns
     */
    public async getEntityClasses (projectId: number): Promise<readonly EntityClass[]> {
        const response = await this.sendRequest(RequestMethod.GET, `/projects/${projectId}/entityClasses`);

        if (response.data instanceof Array) {
            return response.data as readonly EntityClass[];
        }
        return [];
    }


    /**
     * Get 1 entity class by id
     * @param projectId
     * @returns
     */
    public async getEntityClassById (projectId: number, entityClassId: string): Promise<EntityClass> {
        const response = await this.sendRequest(RequestMethod.GET, `/projects/${projectId}/entityClasses/${entityClassId}`);
        return response.data as EntityClass;
    }


    /**
     * Get multiple entities for a project with the provided filters
     * @param projectId
     * @param filters
     * @returns
     */
    public async getEntities (projectId: number, filters: FetchEntityFilters): Promise<PaginationDataSet<Entity>> {

        // Front end separate "sortField", "sortFieldType", and "sortOrder" as 3 different params while back end only accept 1 param
        // "sortOrder". Therefore we need to combine the "sortField", "sortFieldType", and "sortOrder" as 1 param before sending it to the back end
        // Here is the template
        //      If "sortFieldType" is undefined then "sortOrder='${sortField}:${sortOrder}"
        //      If "sortFieldType" is NOT undefined then "sortOrder='${sortFieldType}.${sortField}:${sortOrder}"
        const modifiedFilters = {
            ...filters,
            sortBy: filters?.sortField && filters?.sortOrder    // sortField and sortOrder BOTH need to be provided or none but can't have 1 only.
                ? `${filters.sortFieldType ? `${filters.sortFieldType}.` : ''}${filters.sortField}:${filters.sortOrder}`
                : undefined,
        };

        // Delete these 3 params because we don't need to pass them to the back end
        delete modifiedFilters.sortFieldType;
        delete modifiedFilters.sortField;
        delete modifiedFilters.sortOrder;

        const response = await this.sendRequest(RequestMethod.GET, `/projects/${projectId}/entities`, modifiedFilters);

        if (response.data instanceof Array) {
            const range = parseDataRange(response.headers[DATA_RANGE_HEADER_KEY]);
            return {
                range,
                items: response.data as readonly Entity[],
            };
        }

        return {
            range: {
                start: 0, end: 0, total: 0,
            },
            items: [],
        };
    }


    /**
     * Get 1 entity by id
     * @param projectId
     * @param entityId
     * @returns
     */
    public async getEntityById (projectId: number, entityId: string): Promise<Entity> {
        const response = await this.sendRequest(RequestMethod.GET, `/projects/${projectId}/entities/${entityId}`);
        return response.data as Entity;
    }


    /**
     * Create an entity
     * @param projectId
     * @param params
     */
    public async createEntity (projectId: number, params: CreateEntityParams): Promise<Entity> {
        const response = await this.sendRequest(RequestMethod.POST, `/projects/${projectId}/entities`, params);
        return response.data as Entity;
    }


    /**
     * Update an entity
     * @param projectId
     * @param entityId
     * @param params
     */
    public async updateEntity (projectId: number, entityId: string, params: UpdateEntityParams): Promise<void> {
        await this.sendRequest(RequestMethod.PATCH, `/projects/${projectId}/entities/${entityId}`, params);
    }


    /**
     * Delete an entity by Id
     * @param projectId
     * @param entityId
     */
    public async deleteEntity (projectId: number, entityId: string, deleteDescendants: boolean = false): Promise<void> {
        await this.sendRequest(RequestMethod.DELETE, `/projects/${projectId}/entities/${entityId}?deleteDescendants=${deleteDescendants}`);
    }


    /**
     * Start upload an image for entity. This WILL NOT upload any image. It will only return an endpoint the caller need to call to actually
     * upload the image. Once the image is uploaded, the caller need to make another call to finish the upload.
     * @param projectId
     * @param entityId
     * @param params
     */
    public async startEntityImageUpload (projectId: number, entityId: string, params: {
        readonly target: 'icon' | 'image';
        readonly fileName: string;
    }, projectApiKey?: string): Promise<{ readonly uploadUrl: string; }> {
        const response = await this.sendRequest(RequestMethod.POST, `/projects/${projectId}/entities/${entityId}/manageMedia`, {
            action: 'open-upload',
            ...params,
        }, projectApiKey ? {
            [AUTHORIZATION_KEY]: `${AUTHORIZATION_KEY_PREFIX} ${projectApiKey}`,
        } : undefined);
        return response.data;
    }


    /**
     * To complete the image upload.
     */
    public async completeEntityImageUpload (projectId: number, entityId: string, params: {
        readonly target: 'icon' | 'image';
    }, projectApiKey?: string): Promise<void> {
        await this.sendRequest(RequestMethod.POST, `/projects/${projectId}/entities/${entityId}/manageMedia`, {
            action: 'close-upload',
            ...params,
        }, projectApiKey ? {
            [AUTHORIZATION_KEY]: `${AUTHORIZATION_KEY_PREFIX} ${projectApiKey}`,
        } : undefined);
    }



    /**
     * To delete an entity's image
     */
    public async deleteEntityImage (projectId: number, entityId: string, params: {
        readonly target: 'icon' | 'image';
    }, projectApiKey?: string): Promise<void> {
        await this.sendRequest(RequestMethod.POST, `/projects/${projectId}/entities/${entityId}/manageMedia`, {
            action: 'delete',
            ...params,
        }, projectApiKey ? {
            [AUTHORIZATION_KEY]: `${AUTHORIZATION_KEY_PREFIX} ${projectApiKey}`,
        } : undefined);
    }



    /**
     * Get a list of alert rules
     * @param projectId
     * @param entityId
     * @returns
     */
    public async getAlertRules (projectId: number, filters?: FetchAlertRulesFilters): Promise<PaginationDataSet<AlertRule>> {
        const response = await this.sendRequest(RequestMethod.GET, '/alertRules', {
            ...filters,
            projectId,
        });

        if (response.data instanceof Array) {
            const range = parseDataRange(response.headers[DATA_RANGE_HEADER_KEY]);
            return {
                range,
                items: response.data as readonly AlertRule[],
            };
        }

        return {
            range: {
                start: 0, end: 0, total: 0,
            },
            items: [],
        };
    }


    /**
     * Get 1 alert rule by id
     * @param alertRuleId
     */
    public async getAlertRuleById (alertRuleId: number): Promise<AlertRule> {
        const response = await this.sendRequest(RequestMethod.GET, `/alertRules/${alertRuleId}`);
        return response.data as AlertRule;
    }


    /**
     * Create an entity
     * @param params
     */
    public async createAlertRule (params: CreateAlertRuleParams): Promise<void> {
        await this.sendRequest(RequestMethod.POST, '/alertRules', params);
    }


    /**
     * Update an alert rule
     * @param alertRuleId
     * @param params
     */
    public async updateAlertRule (alertRuleId: number, params: UpdateAlertRuleParams): Promise<void> {
        await this.sendRequest(RequestMethod.PATCH, `/alertRules/${alertRuleId}`, params);
    }


    /**
     * Delete an alert rule by Id
     * @param alertRuleId
     */
    public async deleteAlertRule (alertRuleId: number): Promise<void> {
        await this.sendRequest(RequestMethod.DELETE, `/alertRules/${alertRuleId}`);
    }


    /**
     * Get a list of alerts
     * @param projectId
     * @param entityId
     * @returns
     */
    public async getAlerts (projectId: number, filters: FetchAlertsFilters): Promise<PaginationDataSet<Alert>> {
        const response = await this.sendRequest(RequestMethod.GET, '/alerts', {
            ...filters,
            projectId: filters.homeId === undefined ? projectId : undefined,
        });

        if (response.data instanceof Array) {
            const range = parseDataRange(response.headers[DATA_RANGE_HEADER_KEY]);
            return {
                range,
                items: response.data as readonly Alert[],
            };
        }

        return {
            range: {
                start: 0, end: 0, total: 0,
            },
            items: [],
        };
    }


    /**
     * Get 1 alert  by id
     * @param alertId
     */
    public async getAlertById (alertId: string): Promise<Alert> {
        const response = await this.sendRequest(RequestMethod.GET, `/alerts/${alertId}`);
        return response.data as Alert;
    }


    /**
     * Intercept all API requests and do something with the request before sending it to the server
     */
    protected onFulfilledRequest (config: AxiosRequestConfig): AxiosRequestConfig | Promise<AxiosRequestConfig> {
        if (this.authToken && config.headers && !config.headers[AUTHORIZATION_KEY]) {
            // If we have the authentication token and the header does not have an authentication set yet,
            // add it to the header.
            // eslint-disable-next-line no-param-reassign
            config.headers[AUTHORIZATION_KEY] = `${AUTHORIZATION_KEY_PREFIX} ${this.authToken}`;
        }
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
     * There is no need to create multiple instances of AppAPI so we will make the constructor
     * private to prevent the dev from creating instance of this class
     */
    public constructor (apiBaseUrl: string, authToken?: string) {
        super({
            baseURL        : apiBaseUrl,
            withCredentials: false,
        });

        // If we have authToken, set it
        this.authToken = authToken;
    }
}
