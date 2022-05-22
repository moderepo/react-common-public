/**
 * This interface is for the State that is used for keeping track of the logged in agent. This is where we check to
 * see if an agent is logged in and if he is logged in, what his login info and profile data are.
 */

import {
    LoginInfo, User,
} from '@moderepo/mode-apis';


/**
 * This state is used for storing info about the logged in user. This is a GENERIC type because different application will have different
 * type of loginInfo and type for user profile. So when you use AuthState for your project, you need to specify these 2 types.
 */
export interface AuthState {
    readonly loginInfo: LoginInfo | undefined;
    readonly loggedInUser: User | undefined;
}



export const initialAuthState: AuthState = {
    loginInfo   : undefined,
    loggedInUser: undefined,
};
