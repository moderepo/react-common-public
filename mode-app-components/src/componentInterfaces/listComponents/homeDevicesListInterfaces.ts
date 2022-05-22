import {
    HomeDevice,
} from '@moderepo/mode-apis';
import {
    BaseListCompProps,
} from '../..';



/**
 * This is a very base interface for all components that are implemented for displaying a list of Home Devices. Each specific implementation
 * of HomeDevicesList component must override ths interface and add other attributes necessary.
 */
export interface BaseHomeDevicesListProps extends BaseListCompProps<HomeDevice> {
}
