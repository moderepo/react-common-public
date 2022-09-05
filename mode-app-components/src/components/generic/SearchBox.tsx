import React, {
    useState, useEffect, CSSProperties,
} from 'react';
import {
    Icon, Input, IconButton, makeStyles, Theme,
} from '@material-ui/core';
import {
    useDebounce,
} from 'use-debounce';
import clsx from 'clsx';



const useStyle = makeStyles((theme: Theme) => {
    return {
        root: {
            position: 'relative',
            width   : '100%',
        },

        searchIcon: {
            width         : theme.spacing(4),
            height        : '100%',
            position      : 'absolute',
            pointerEvents : 'none',
            display       : 'flex',
            alignItems    : 'center',
            justifyContent: 'center',
        },

        searchInputRoot: {
            color: 'inherit',
            width: '100%',
        },

        searchInput: {
            padding: theme.spacing(1, 3, 1, 4),
            width  : '100%',
        },

        clearSearchButton: {
            position      : 'absolute',
            right         : 0,
            top           : '50%',
            display       : 'flex',
            alignItems    : 'center',
            justifyContent: 'center',
            transform     : 'translateY(-50%)',
        },
    };
}, {
    name: 'SearchBox',
});



export interface SearchBoxProps {
    readonly className?: string | undefined;
    readonly style?: CSSProperties | undefined;
    readonly initialValue?: string | undefined;
    readonly placeholder?: string;           // placeholder to show in the input field
    readonly delay?: number;
    // Whether or not to allow case sensitive. If this is true, the user input will NOT automatically be converted to lowercase. The default is
    // FALSE and all input will be converted to lowercase
    readonly caseSensitive?: boolean | undefined;
    readonly onChange: (value: string)=> void;
}

export const SearchBox: React.FC<SearchBoxProps> = (props: SearchBoxProps) => {
    const [searchText, setSearchText] = useState<string>(props.initialValue ?? '');
    const [searchTextDebouncedValue] = useDebounce(searchText, props.delay ? props.delay : 1000);
    const searchInputRef = React.useRef<HTMLInputElement>();
    const classes = useStyle();
    const { onChange } = props;

    /**
     * This useEffect is used for listening to searchTextDebouncedValue and call the onChange callback
     */
    useEffect(() => {
        onChange(searchTextDebouncedValue);
    }, [onChange, searchTextDebouncedValue]);


    return (
        <div className={clsx(props.className, classes.root)} style={props.style}>
            <div className={classes.searchIcon}>
                <Icon>search</Icon>
            </div>
            <Input
                placeholder={props.placeholder || ''}
                classes={{
                    root : classes.searchInputRoot,
                    input: classes.searchInput,
                }}
                value={searchText}
                inputProps={{
                    ref: searchInputRef,
                }}
                onChange={(event: React.ChangeEvent) => {
                    if (props.caseSensitive === true) {
                        setSearchText((event.currentTarget as HTMLInputElement).value);
                    } else {
                        setSearchText((event.currentTarget as HTMLInputElement).value.toLowerCase());
                    }
                }}
            />
            {searchText.length > 0
                    && (
                        <IconButton
                            className={classes.clearSearchButton}
                            onClick={() => {
                                (searchInputRef.current as HTMLInputElement).value = '';
                                setSearchText('');
                            }}
                        >
                            <Icon>close</Icon>
                        </IconButton>
                    )}
        </div>
    );
};
