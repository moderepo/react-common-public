import {
    HomeMember,
} from '@moderepo/mode-apis';
import {
    BaseListCompProps,
} from '../..';



/**
 * This is a very base interface for all components that are implemented for displaying a list of home members. Each specific implementation
 * of HomeMembersList component must override ths interface and add other attributes necessary.
 */
export interface BaseHomeMembersListProps extends BaseListCompProps<HomeMember> {
}
