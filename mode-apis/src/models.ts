/**
 * This is where we define the data structure for all the data we receive from backend e.g. User, Project, Device, etc...
 */

import {
    LoginInfo, AppSettings,
} from '@moderepo/mode-apis-base';



// The Key we will add to the REQUEST header when we make API call to AppAPI to pass user's auth token to the backend
export const AUTHORIZATION_KEY: string = 'Authorization';

// The Prefix that we will add to the auth token when we add the auth token to the REQUEST header.
export const AUTHORIZATION_KEY_PREFIX: string = 'ModeCloud';


/**
 * Interface for end user login info
 */
export interface UserLoginInfo extends LoginInfo {
    readonly userId: number;
    readonly token: string;
}


/**
 * Interface for user session info
 */
export interface UserSessionInfo {
    readonly userId: number;
    readonly appId: string;
    readonly projectId: number;
    readonly creationTime: string;
}



/**
 * This is the app settings for end user apps. We don't know what we need yet so it will be empty for now.
 */
export interface UserAppSettings extends AppSettings {
}
