import {
    Home,
} from '@moderepo/mode-apis';
import {
    BaseListCompProps,
} from '../..';



/**
 * This is a very base interface for all components that are implemented for displaying a list of Homes. Each specific implementation
 * of HomesList component must override ths interface and add other attributes necessary.
 */
export interface BaseHomesListProps extends BaseListCompProps<Home> {
}
