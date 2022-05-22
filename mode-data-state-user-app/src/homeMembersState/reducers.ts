import produce, {
    castDraft, Draft,
} from 'immer';
import {
    HomeMember,
} from '@moderepo/mode-apis';
import {
    BaseAction,
} from '@moderepo/mode-data-state-base';
import {
    HomeMembersActionType, SetHomeMembersAction, SetHomeMemberAction, ClearHomeMembersAction,
} from './actions';
import {
    HomeMembersState,
} from './models';


const homeMembersByIdReducer = (
    currentState: HomeMembersState['membersById'], action: BaseAction,
): HomeMembersState['membersById'] => {
    const { type } = action;

    switch (type) {
        case HomeMembersActionType.SET_HOME_MEMBERS:
            return produce(currentState, (draft: Draft<typeof currentState>) => {
                const actualAction = action as SetHomeMembersAction;

                actualAction.members.forEach((member: HomeMember) => {
                    draft[member.userId] = member;
                });
            });

        case HomeMembersActionType.SET_HOME_MEMBER:
            return produce(currentState, (draft: Draft<typeof currentState>) => {
                const actualAction = action as SetHomeMemberAction;
                draft[actualAction.member.userId] = actualAction.member;
            });

        default:
            return currentState;
    }
};


const allHomeMemberIdsReducer = (currentState: readonly number[] | undefined, action: BaseAction): readonly number[] | undefined => {
    const { type } = action;
    switch (type) {
        case HomeMembersActionType.SET_HOME_MEMBERS:
            return produce(currentState, () => {
                const actualAction = action as SetHomeMembersAction;

                // convert the list of actualAction.members to an Array of members ids and update the currentState with the new
                // list. NOTE: only need to update the currentState if NOT both of them are empty. If both of them are empty,
                // do not need to run this or else it will replace the currentState with a NEW empty array which cause unnecessary
                // UI re-render.
                if (actualAction.members.length !== 0 || !currentState || currentState.length !== 0) {
                    return actualAction.members.map((member: HomeMember): number => {
                        return member.userId;
                    });
                }

                return currentState;
            });

        default:
            return currentState;
    }
};


const homeMemberIdsByHomeIdReducer = (
    currentState: HomeMembersState['memberIdsByHomeId'], action: BaseAction,
): HomeMembersState['memberIdsByHomeId'] => {

    const { type } = action;

    switch (type) {
        case HomeMembersActionType.SET_HOME_MEMBERS:
            return produce(currentState, (draft: Draft<typeof currentState>) => {
                const { homeId } = action as SetHomeMembersAction;
                draft[homeId] = castDraft(allHomeMemberIdsReducer(currentState[homeId], action));
            });

        case HomeMembersActionType.CLEAR_HOME_MEMBERS:
            return produce(currentState, (draft: Draft<typeof currentState>) => {
                const { homeId } = action as ClearHomeMembersAction;
                delete draft[homeId];
            });
        default:
            return currentState;
    }
};



export const homeMembersStateReducer = (currentState: HomeMembersState, action: BaseAction): HomeMembersState => {
    return produce(currentState, (draft: Draft<HomeMembersState>) => {
        draft.membersById = homeMembersByIdReducer(currentState.membersById, action);
        draft.memberIdsByHomeId = castDraft(homeMemberIdsByHomeIdReducer(currentState.memberIdsByHomeId, action));
    });
};
