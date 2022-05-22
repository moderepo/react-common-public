import React, {
    useState, useCallback, useEffect, useMemo,
} from 'react';
import {
    useLocation,
} from 'react-router-dom';
import {
    useMediaQuery, useTheme,
} from '@material-ui/core';
import produce, {
    castDraft,
    Draft,
} from 'immer';
import {
    Breakpoint,
} from '@material-ui/core/styles/createBreakpoints';


/**
 * Custom hook that create URLSearchParams object from location.search params so that we can get
 * the search params key/values without having to parse it.
 */
export const useQueryParams = (): URLSearchParams => {
    const location = useLocation();
    const [queryParams, setQueryParams] = useState(new URLSearchParams(location.search));

    useEffect(() => {
        setQueryParams(new URLSearchParams(location.search));
    }, [location.search]);

    return queryParams;
};


/**
 * Just like useQueryParams but this hook will return all the params from the URL as an JSON Object instead of URLSearchParams object
 */
export const useQueryParamsData = (): {[key: string]: string | undefined} => {
    const queryParams = useQueryParams();

    const data = useMemo(() => {
        if (queryParams) {
            return Array.from(queryParams.entries()).reduce((result: {[key: string]: string}, [key, value]) => {
                return {
                    ...result,
                    [key]: value,
                };
            }, {
            });
        }

        return {
        };
    }, [queryParams]);

    return data;
};



/**
 * For each dropdown menu we use, we need to create 3-4 states and a couple of functions so we instead of repeating
 * those setup in many places, we created this hook to make the setup simpler
 */
export const useDropdown = (): [HTMLElement | null, boolean, (event: React.MouseEvent<HTMLElement>)=> void, ()=> void] => {
    const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
    const isMenuOpened = Boolean(anchorEl);

    const onMenuTogglerClicked = useCallback((event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget as HTMLElement);
    }, []);

    const onMenuClosed = useCallback(() => {
        setAnchorEl(null);
    }, []);

    return [anchorEl, isMenuOpened, onMenuTogglerClicked, onMenuClosed];
};



/**
 * Custom Hook to check if the current screen mode is landscape
 */
export const useIsLandscapeCheck = (): boolean => {
    const theme = useTheme();
    return useMediaQuery(`
        (max-width:${theme.breakpoints.values.md}px) and
        (min-width:500px) and (max-height:500px) and
        (orientation: landscape)
    `);
};


/**
 * Custom Hook to check if the current screen size is the specified screen size
 * @param size - The name of the screen size 'xs', 'sm', 'md', 'lg', 'xl'
 */
export const useScreenSizeCheck = (size: Breakpoint): boolean => {
    const theme = useTheme();
    return useMediaQuery(`
        (min-width:${theme.breakpoints.values[size]}px)
    `);
};



/**
 * Custom hook for dealing with local storage. To use a local storage, use this hook and pass in the key and optional default value.
 * This hook will return the current value and a couple of functions to update the value or delete the value.
 */
export const useLocalStorage = (key: string, defaultValue?: any): {value: any, setValue: (value: any)=> void, deleteValue: ()=> void} => {

    const [value, setValue] = useState<any | undefined>(() => {
        // Check if there is already a value stored in localStorage under the specified key. If there is, JSON.parse
        // the stored value and return it as an Object. If there isn't a value stored, use the provided default value.
        const storedValue = window.localStorage.getItem(key);
        if (storedValue) {
            try {
                return JSON.parse(storedValue);
            } catch (error) {
                // Unable to parse the value currently stored in localStorage, use the default value
                return defaultValue;
            }
        } else {
            return defaultValue;
        }
    });


    const setValueHelper = (newValue?: any) => {
        if (newValue) {
            // update the state
            setValue(newValue);

            // Store newValue into localStorage as string
            window.localStorage.setItem(key, JSON.stringify(newValue));
        } else {
            // There is no newValue
            setValue(newValue);
        }
    };


    const deleteValue = () => {
        window.localStorage.removeItem(key);
    };


    return {
        value,
        setValue: setValueHelper,
        deleteValue,
    };

};



/**
 * Instead of creating multiple useState, one for each of these params, we will group them into 1 object. This is for
 * optimizing the re-render. Sometime we make changes to multiple of these params at the same time and that would trigger
 * re-render multiple times if these were defined as separate useState.
 */
export interface SearchParams<T> {
    readonly searchText: string;
    readonly itemsPerPage: number;
    readonly currentPage: number;
    readonly otherFields: T;           // Additional maps of other fields, name/value pairs, we want to filter by
}

export const useSearchParams = <T extends {
    readonly [key: string]: any | undefined;
}>(defaultParams: SearchParams<T>) => {
    const [searchParams, setSearchParams] = useState<SearchParams<T>>({
        ...defaultParams,
    });

    /**
     * On itemsPerPage changed. When itemsPerPage changed, we need to also reset the currentPage to 0 because the current
     * value of currentPage doesn't make sense anymore.
     */
    const onItemsPerPageChange = useCallback((value: number) => {
        if (value !== searchParams.itemsPerPage) {
            setSearchParams(produce(searchParams, (draft: Draft<SearchParams<T>>) => {
                draft.itemsPerPage = value;
                draft.currentPage = 0;
            }));
        }
    }, [searchParams]);


    /**
     * On search text changed. When search text changed, we will also need to reset currentPage because the
     * value of currentPage doesn't make sense anymore.
     */
    const onSearchTextChange = useCallback((newSearchText: string) => {
        if (newSearchText.trim() !== searchParams.searchText) {
            setSearchParams(produce(searchParams, (draft: Draft<SearchParams<T>>) => {
                draft.searchText = newSearchText.trim();
                draft.currentPage = 0;
            }));
        }
    }, [searchParams]);


    const onOtherFieldsChange = useCallback((updatedOtherFields: T) => {
        setSearchParams(produce(searchParams, (draft: Draft<SearchParams<T>>) => {
            if (draft.otherFields && updatedOtherFields) {
                draft.otherFields = {
                    ...draft.otherFields,
                    ...updatedOtherFields,
                };
            } else {
                draft.otherFields = castDraft(updatedOtherFields);
            }
            draft.currentPage = 0;
        }));
    }, [searchParams]);


    /**
     * On prevPage clicked. Decrease the currentPage by 1 but make sure the new value is NOT less than 0.
     */
    const onPrevPage = useCallback(() => {
        setSearchParams(produce(searchParams, (draft: Draft<SearchParams<T>>) => {
            draft.currentPage = Math.max(0, searchParams.currentPage - 1);
        }));
    }, [searchParams]);


    /**
     * On nextPage clicked. Increase the currentPage by 1.
     */
    const onNextPage = useCallback(() => {
        setSearchParams(produce(searchParams, (draft: Draft<SearchParams<T>>) => {
            draft.currentPage = searchParams.currentPage + 1;
        }));
    }, [searchParams]);


    /**
     * On specific page # clicked
     */
    const onPage = useCallback((pageNumber: number) => {
        setSearchParams(produce(searchParams, (draft: Draft<SearchParams<T>>) => {
            draft.currentPage = pageNumber;
        }));
    }, [searchParams]);


    return {
        searchParams,
        onOtherFieldsChange,
        onSearchTextChange,
        onItemsPerPageChange,
        onPrevPage,
        onNextPage,
        onPage,
    };
};
