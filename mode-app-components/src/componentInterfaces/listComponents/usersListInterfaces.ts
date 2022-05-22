import {
    User,
} from '@moderepo/mode-apis';
import {
    BaseListCompProps,
} from '../..';



/**
 * This is a very base interface for all components that are implemented for displaying a list of users. Each specific implementation
 * of UsersList component must override ths interface and add other attributes necessary.
 */
export interface BaseUsersListProps extends BaseListCompProps<User> {
}
