import {
    RobotInfo,
} from '@moderepo/mode-apis';
import {
    BaseListCompProps,
} from '../..';



/**
 * This is a very base interface for all components that are implemented for displaying a list of Robots. Each specific implementation
 * of Robots list component must override ths interface and add other attributes necessary.
 */
export interface RCBaseRobotsListProps extends BaseListCompProps<RobotInfo> {
}
