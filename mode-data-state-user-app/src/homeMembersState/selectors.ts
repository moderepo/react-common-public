import {
    createCachedSelector,
} from 're-reselect';
import {
    HomeMember,
} from '@moderepo/mode-apis';
import {
    UserAppDataState,
} from '../model';
import {
    HomeMembersState,
} from './models';


/**
 * This is the actual function that will get the data from the state and return the data requested. However, this function returns a new
 * object every time which can cause an infinite loop in re-rendering if used in React component. Therefore this function is not EXPORTED
 * and we will create another function below which use memoize to cache the result.
 */
const selectHomeMembersFunc = (
    membersById: HomeMembersState['membersById'],
    memberIdsByHomeId: HomeMembersState['memberIdsByHomeId'],
    homeId: number,
): readonly HomeMember[] | undefined => {
    return memberIdsByHomeId?.[homeId]?.reduce((result: HomeMember[], id: number) => {
        const member = membersById[id];
        if (member) {
            return [...result, member];
        }
        return result;
    }, []);
};



/**
 * Select ALL members for a specific home
 */
export const selectHomeMembers = createCachedSelector(
    (state: UserAppDataState) => { return state.homeMembers.membersById; },
    (state: UserAppDataState) => { return state.homeMembers.memberIdsByHomeId; },
    (state: UserAppDataState, homeId: number) => { return homeId; },
    selectHomeMembersFunc,
)((state: UserAppDataState, homeId: number) => {
    // use homeId as cache key
    return homeId.toString();
});



export const selectHomeMember = (state: UserAppDataState, memberId: number): HomeMember | undefined => {
    return state.homeMembers.membersById[memberId];
};
