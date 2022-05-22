import {
    TimeSeriesCollectionInfo,
} from '@moderepo/mode-apis';
import {
    BaseListCompProps,
} from '../..';



/**
 * This is a very base interface for all components that are implemented for displaying a list of TimeSeries info. Each specific implementation
 * of TimeSeriesInfoList component must override ths interface and add other attributes necessary.
 */
export interface BaseCollectionsListProps extends BaseListCompProps<TimeSeriesCollectionInfo> {
}
