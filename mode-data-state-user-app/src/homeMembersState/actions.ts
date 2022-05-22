import {
    AppAPI, HomeMember, MemberRole,
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
export enum HomeMembersActionType {
    SET_HOME_MEMBERS = 'set home members',
    SET_HOME_MEMBER = 'set home member',
    CLEAR_HOME_MEMBERS = 'clear home members',
}



/**
 * The Action interface for setting a list of members that belonged to a home
 * @param type - The action type
 * @param members - The array of home members
 */
export interface SetHomeMembersAction extends BaseAction {
    readonly type: HomeMembersActionType.SET_HOME_MEMBERS;
    readonly homeId: number;
    readonly members: readonly HomeMember[];
}


/**
 * The Action interface for setting a home member that belonged to a home.
 * @param type - The action type
 * @param member - The member
 */
export interface SetHomeMemberAction extends BaseAction {
    readonly type: HomeMembersActionType.SET_HOME_MEMBER;
    readonly homeId: number;
    readonly member: HomeMember;
}

/**
 * The Action interface for clearing the list of members that belonged to a home
 * @param type - The action type
 */
export interface ClearHomeMembersAction extends BaseAction {
    readonly type: HomeMembersActionType.CLEAR_HOME_MEMBERS;
    readonly homeId: number;
}



export const setHomeMembers = (homeId: number, members: readonly HomeMember[]): SetHomeMembersAction => {
    return {
        type: HomeMembersActionType.SET_HOME_MEMBERS,
        homeId,
        members,
    };
};


export const clearHomeMembers = (homeId: number): ClearHomeMembersAction => {
    return {
        type: HomeMembersActionType.CLEAR_HOME_MEMBERS,
        homeId,
    };
};



/**
 * Get all members belonged to a home
 * @param homeId - The id of the home
 */
export const fetchHomeMembers = (homeId: number): UserAppThunkAction => {
    return async (dataDispatch: ExtDispatch<UserAppDataStateAction>): Promise<void> => {
        const members = await AppAPI.getInstance().getHomeMembers(homeId);
        await dataDispatch(setHomeMembers(homeId, members));
    };
};



/**
 * Add/Invite a member to a home
 * @param homeId - The id of the home we want to add the member
 * @param email | phoneNumber - The email or phone number of the user we want to add.
 */
export const addHomeMember = (
    homeId: number, { email, phoneNumber, role }: {email?: string, phoneNumber?: string, role?: MemberRole},
): UserAppThunkAction => {
    return async (dataDispatch: ExtDispatch<UserAppDataStateAction>): Promise<void> => {
        await AppAPI.getInstance().addHomeMember(homeId, {
            email, phoneNumber, role,
        });
        // New member added so we need to clear the current home members list
        await dataDispatch(clearHomeMembers(homeId));
    };
};


/**
 * Update a home member. Only 'role' can be updated.
 * @param homeId - The id of the home the member belonged to
 * @param memberId - The id of the member we want to change
 * @param role - The role that we want to set
 */
export const updateHomeMember = (
    homeId: number, memberId: number, role: MemberRole,
): UserAppThunkAction => {
    return async (dataDispatch: ExtDispatch<UserAppDataStateAction>): Promise<void> => {
        await AppAPI.getInstance().updateHomeMember(homeId, memberId, role);
        // Home member updated so we need to clear the current home members list
        await dataDispatch(clearHomeMembers(homeId));
    };
};


/**
 * Remove a member from a home
 * @param homeId - The id of the home we want to remove the member from
 * @param memberId - The id of the member we want to remove
 */
export const removeHomeMember = (homeId: number, memberId: number): UserAppThunkAction => {
    return async (dataDispatch: ExtDispatch<UserAppDataStateAction>): Promise<void> => {
        await AppAPI.getInstance().removeHomeMember(homeId, memberId);
        // New member removed so we need to clear the current home members list
        await dataDispatch(clearHomeMembers(homeId));
    };
};
