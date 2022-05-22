import {
    KeyValuePair,
} from '@moderepo/mode-apis';
import {
    BaseListCompProps,
} from '../..';



/**
 * This is a very base interface for all components that are implemented for displaying a list of KV Pairs. Each specific implementation
 * of KVPairList component must override ths interface and add other attributes necessary.
 */
export interface BaseKVPairsListProps extends BaseListCompProps<KeyValuePair> {
}
