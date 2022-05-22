import {
    User, LoginInfo,
} from '@moderepo/mode-apis';
import {
    UserAppDataState,
} from '../model';
import {
    AuthState,
} from './models';


/**
 * Return the entire auth state
 */
export const selectAuth = (state: UserAppDataState): AuthState => {
    return state.auth;
};



/**
 * Return the logged in user profile. Return undefined if the user is not logged in or
 * we have not fetched the logged in user's profile
 */
export const selectLoggedInUser = (state: UserAppDataState): User | undefined => {
    return state.auth.loggedInUser;
};


/**
 * Return the login info of the logged in user
 */
export const selectLoginInfo = (state: UserAppDataState): LoginInfo | undefined => {
    return state.auth.loginInfo;
};
