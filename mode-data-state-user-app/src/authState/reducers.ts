import produce, {
    Draft,
} from 'immer';
import {
    User, LoginInfo,
} from '@moderepo/mode-apis';
import {
    BaseAction,
} from '@moderepo/mode-data-state-base';
import {
    AuthActionType, SetLoginInfoAction, AuthenticateSuccessAction, UpdateLoggedInUserAction,
} from './actions';
import {
    AuthState,
} from './models';



const loggedInUserReducer = (currentState: User | undefined, action: BaseAction): User | undefined => {
    const { type } = action;
    switch (type) {
        case AuthActionType.AUTHENTICATING: {
            // when authenticating start, we will clear loggedInUser data if there is any
            return undefined;
        }
        case AuthActionType.AUTHENTICATE_SUCCESS: {
            const actualAction = action as AuthenticateSuccessAction;
            return actualAction.loggedInUser;
        }
        case AuthActionType.AUTHENTICATE_FAILURE: {
            return undefined;
        }
        case AuthActionType.UPDATE_LOGGED_IN_USER: {
            const actualAction = action as UpdateLoggedInUserAction;
            return actualAction.loggedInUser;
        }
        case AuthActionType.LOGOUT_USER: {
            return undefined;
        }
        default: return currentState;
    }
};



const loginInfoReducer = (currentState: LoginInfo | undefined, action: BaseAction): LoginInfo | undefined => {
    const { type } = action;
    switch (type) {
        case AuthActionType.AUTHENTICATE_FAILURE: {
            // if unable to authenticate user, clear the loginInfo data
            return undefined;
        }
        case AuthActionType.SET_LOGIN_INFO: {
            const actualAction = action as SetLoginInfoAction;
            return actualAction.loginInfo;
        }
        case AuthActionType.LOGOUT_USER: {
            return undefined;
        }
        default:
            return currentState;
    }
};



export const authStateReducer = (currentState: AuthState, action: BaseAction): AuthState => {
    return produce(currentState, (draft: Draft<AuthState>) => {
        draft.loggedInUser = loggedInUserReducer(currentState.loggedInUser, action);
        draft.loginInfo = loginInfoReducer(currentState.loginInfo, action);
    });
};
