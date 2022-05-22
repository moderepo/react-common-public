import {
    HomeMember,
} from '@moderepo/mode-apis';


export interface HomeMembersState {
    readonly membersById: {
        [memberId: number]: HomeMember | undefined;
    };
    readonly memberIdsByHomeId: {
        [homeId: number]: readonly number[] | undefined}
    ;
}


export const initialHomeMembersState: HomeMembersState = {
    membersById: {
    },
    memberIdsByHomeId: {
    },
};
