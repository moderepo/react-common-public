import {
    LoginInfo, AppAPI, User,
} from '@moderepo/mode-apis';
import {
    BaseAction, ExtDispatch,
} from '@moderepo/mode-data-state-base';
import {
    UserAppDataStateAction, UserAppThunkAction,
} from '../actions';



/**
 * The types of action that can be dispatched to update this sub state.
 */
export enum AuthActionType {
    AUTHENTICATING = 'authenticating',
    AUTHENTICATE_SUCCESS = 'authenticate success',
    AUTHENTICATE_FAILURE = 'authenticate failure',
    SET_LOGIN_INFO = 'set login info',
    UPDATE_LOGGED_IN_USER = 'update logged in user',
    LOGOUT_USER = 'logout user',
}


export interface AuthenticatingAction extends BaseAction {
    readonly type: AuthActionType.AUTHENTICATING;
}

export interface AuthenticateSuccessAction extends BaseAction {
    readonly type: AuthActionType.AUTHENTICATE_SUCCESS;
    readonly loggedInUser: User;
}

export interface AuthenticateFailureAction extends BaseAction {
    readonly type: AuthActionType.AUTHENTICATE_FAILURE;
}


export interface SetLoginInfoAction extends BaseAction {
    readonly type: AuthActionType.SET_LOGIN_INFO;
    readonly loginInfo: LoginInfo;
}

export interface UpdateLoggedInUserAction extends BaseAction {
    readonly type: AuthActionType.UPDATE_LOGGED_IN_USER;
    readonly loggedInUser: User;
}


export interface LogoutUserAction extends BaseAction {
    readonly type: AuthActionType.LOGOUT_USER;
}


export const authenticating = (): AuthenticatingAction => {
    return {
        type: AuthActionType.AUTHENTICATING,
    };
};

export const authenticateSuccess = (user: User): AuthenticateSuccessAction => {
    return {
        type        : AuthActionType.AUTHENTICATE_SUCCESS,
        loggedInUser: user,
    };
};

export const authenticateFailure = (): AuthenticateFailureAction => {
    return {
        type: AuthActionType.AUTHENTICATE_FAILURE,
    };
};


export const setLoginInfo = (loginInfo: LoginInfo): SetLoginInfoAction => {
    return {
        type: AuthActionType.SET_LOGIN_INFO,
        loginInfo,
    };
};

export const updateLoggedInUser = (user: User): UpdateLoggedInUserAction => {
    return {
        type        : AuthActionType.UPDATE_LOGGED_IN_USER,
        loggedInUser: user,
    };
};


export const userLogout = (): LogoutUserAction => {
    return {
        type: AuthActionType.LOGOUT_USER,
    };
};



/**
 * Authenticate the user to make sure he is logged in by fetching the user's profile. If he is not logged
 * in or his token expired, an error will be thrown.
 * @param userId - number - The id of the user whose profile is to be loaded
 */
export const authenticateUser = (userId: number): UserAppThunkAction => {
    return async (dataDispatch: ExtDispatch<UserAppDataStateAction>): Promise<void> => {
        // flag that we are authenticating so that the UI doesn't do anything.
        await dataDispatch(authenticating());

        try {
            const user = await AppAPI.getInstance().getUserById(userId);
            await dataDispatch(authenticateSuccess(user));
        } catch (error) {
            await dataDispatch(authenticateFailure());
            throw error;
        }
    };
};



/**
 * Get the logged in user's session info to check if the user is logged in.
 */
export const getUserSession = (): UserAppThunkAction => {
    return async (): Promise<void> => {
        await AppAPI.getInstance().getUserSessionInfo();
        // TODO - Add userSession to the state
    };
};



/**
 * This is for fetching the LOGGED IN user's personal profile.
 */
export const fetchUserProfile = (
    userId: number,
): UserAppThunkAction => {
    return async (dataDispatch: ExtDispatch<UserAppDataStateAction>): Promise<void> => {
        const user = await AppAPI.getInstance().getUserById(userId);
        await dataDispatch(authenticateSuccess(user));
    };
};



/**
 * This is for updating the LOGGED IN user's personal profile.
 */
export const updateUserProfile = (
    userId: number,
    params: {name?: string, password?: string},
): UserAppThunkAction => {
    return async (dataDispatch: ExtDispatch<UserAppDataStateAction>): Promise<void> => {
        await AppAPI.getInstance().updateUser(userId, params);
        await dataDispatch(fetchUserProfile(userId));
    };
};


/**
 * Log the user out
 */
export const logoutUser = (): UserAppThunkAction => {
    return async (dataDispatch: ExtDispatch<UserAppDataStateAction>): Promise<void> => {
        await AppAPI.getInstance().logout();
        AppAPI.getInstance().clearAuthToken();       // Delete login info from AppAPI
        await dataDispatch(userLogout());
    };
};
