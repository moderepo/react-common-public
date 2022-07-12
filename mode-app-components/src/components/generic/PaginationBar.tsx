import React, {
    useCallback,
} from 'react';
import {
    MenuItem, IconButton, Icon, Button, Menu, makeStyles, Box, Theme,
} from '@material-ui/core';
import clsx from 'clsx';
import {
    useDropdown,
} from '../../utils/customHooks';


/**
 * Style for pagination component.
 */
const useStyle = makeStyles((theme: Theme) => {
    return {

        root: {
            display                     : 'flex',
            alignItems                  : 'center',
            justifyContent              : 'flex-end',
            borderTop                   : '1px solid rgba(224, 224, 224, 1)',
            padding                     : theme.spacing(0.5, 1),
            [theme.breakpoints.up('md')]: {
                padding: theme.spacing(1, 2),
            },
        },

        paginationItemsPerPageLabel: {
            display                     : 'none',
            fontWeight                  : 500,
            color                       : theme.palette.text.primary,
            [theme.breakpoints.up('sm')]: {
                display: 'unset',
            },
        },

        paginationPrevNextButtonsContainer: {
            margin: theme.spacing(0, 0.5),
        },

        paginationPrevNextButton: {
            padding   : theme.spacing(0.5),
            fontWeight: 500,
            color     : theme.palette.text.primary,
        },

        paginationItemsPerPageDropdown: {
            fontSize                                       : 'unset',
            borderBottom                                   : 'none',
            background                                     : 'none',
            fontWeight                                     : 500,
            color                                          : theme.palette.text.primary,
            '&:before, &:after, &:active, &:focus, &:hover': {
                borderBottom: 'none',
                background  : 'none',
            },
            '& svg': {
                width : '20px',
                height: '20px',
            },
            '& .MuiSelect-select': {
                '&:before, &:after, &:active, &:focus': {
                    background: 'none',
                },
            },
        },

        paginationCurrentPageLabel: {
            textAlign : 'center',
            fontSize  : 'unset',
            fontWeight: 500,
            color     : theme.palette.text.primary,
        },

        paginationPageDropdown: {
            textTransform: 'none',
            color        : theme.palette.text.primary,
            fontWeight   : 500,
        },
    };
}, {
    name: 'Pagination',
});



/**
 * className - Custom class name if we need to override the style
 * labels - Custom label used for 'Items per page' dropdown list. If we want to replace the word 'Items' with any other word
 *            e.g. 'Users', 'Devices', 'Homes', etc..., we can pass in the itemName.
 * itemsPerPage - Initial items per page to use.
 * currentPage - The current page
 * totalItems - The total # of items. This is optional because sometime we don't know how many items there are. If this value is provided,
 *              we can enable other options in the UI such as >| button and even the page select dropdown.
 * maxPageLinks - Maximum number of direct links to pages e.g. links to Page 5, Page 6, etc... This is only used when totalItems is
 *                provided. And even if totalItem is provided but this is not provided, the default value is 10 links.
 * hasMoreItems - Whether or not there are more items to show. If this is true, we will enable the > button.
 * onItemsPerPageChange - Callback to handle the user changing items per page value.
 * onFirstPage - Callback to handle the user clicking on the |< button
 * onPrevPage - Callback to handle the user clicking on the < button
 * onNextPage - Callback to handle the user clicking on the > button
 * onLastPage - Callback to handle the user clicking on the >| button
 * onPage - Callback to handle the user clicking on the exact page number
 */
export interface PaginationBarProps {
    readonly className?: string;
    readonly itemsPerPageList?: readonly number[] | undefined;
    readonly itemsPerPage: number;
    readonly pagingMinPages: number;
    readonly currentPage: number;
    readonly totalItems?: number;
    readonly maxPageLinks?: number;
    readonly hasMoreItems: boolean;
    readonly texts: {
        readonly itemsPerPage: string;          // e.g. 'Customers per page', 'Devices per page', etc...
        readonly pageNTemplate: string;         // e.g. 'Page [[page_number]]' - when total page is unknown. NOTE: Use [[ ]] to wrap placeholders
        readonly pageNofMTemplate: string;      // e.g. 'Page [[page_number]] of [[total_page]]'. NOTE: Use [[ ]] to wrap placeholders
    };
    readonly onItemsPerPageChange: (value: number)=> void;
    readonly onPrevPage: ()=> void;
    readonly onNextPage: ()=> void;
    readonly onPage: (pageNumber: number)=> void;
}


/**
 * Create links to just directly to a specific pages. We will create 1 link per page but up to 'maxLinks'. So if
 * totalPages > maxLinks, we will only create maxLinks number of links. For example: if totalPage is 5 and maxLinks is 10,
 * we will create 5 links, 1 for each page [0, 1, 2, 3, 4], 0 based. However, if totalPage is 100, we will create 10 links,
 * 1 for each 10 pages e.g. [0, 10, 20, 30, 40, 50, 60, 70, 80, 90]. So each link will forward the user 10 pages.
 */
const createPageLinks = (totalPages?: number, maxLinks: number = 10): number[] => {
    if (totalPages !== undefined) {
        const interval = Math.ceil(totalPages / maxLinks);
        const start = Math.floor(interval / 2);
        const numberOfLinks = Math.floor(totalPages / interval);

        const pages: number[] = (new Array(numberOfLinks)).fill(0).map((value: number, index: number): number => {
            return start + (index * interval);
        });

        return pages;
    }
    return [];
};

/**
 * Pagination bar component. This component can be used with any table that need paging.
 */
const PaginationBarSrc: React.FC<PaginationBarProps> = (props: PaginationBarProps) => {
    const [jumpToMenuAnchorEl, isJumpToMenuOpened, onJumpToMenuAnchorClicked, onJumpToMenuClosed] = useDropdown();
    const [limitMenuAnchorEl, isLimitMenuOpened, onLimitMenuAnchorClicked, onLimitMenuClosed] = useDropdown();
    const classes = useStyle();
    const {
        onItemsPerPageChange: onItemsPerPageChangeHandler,
        onPrevPage: onPrevPageHandler,
        onNextPage: onNextPageHandler,
        onPage: onPageHandler,
    } = props;

    // Calculate the total number of pages we would have if we know the total number of items and items per page
    const totalPages: number | undefined = props.totalItems ? Math.ceil(props.totalItems / props.itemsPerPage) : undefined;


    // Use maxPageLinks from props if provided and make sure the value is between 1 and 100 inclusive
    const maxPageLinks: number | undefined = props.maxPageLinks ? Math.max(1, Math.min(100, props.maxPageLinks)) : undefined;

    // Create page links
    const pages: number[] = createPageLinks(totalPages, maxPageLinks);



    const onItemsPerPage = useCallback((value: number) => {
        onItemsPerPageChangeHandler(value);
    }, [onItemsPerPageChangeHandler]);

    const onPrevPage = useCallback(() => {
        onPrevPageHandler();
    }, [onPrevPageHandler]);


    const onNextPage = useCallback(() => {
        onNextPageHandler();
    }, [onNextPageHandler]);


    const onFirstPage = useCallback(() => {
        onPageHandler(0);
    }, [onPageHandler]);


    const onLastPage = useCallback(() => {
        if (totalPages !== undefined) {
            onPageHandler(totalPages - 1);
        }
    }, [onPageHandler, totalPages]);


    const onPage = useCallback((pageNumber: number) => {
        onPageHandler(pageNumber);
    }, [onPageHandler]);


    return (
        <div
            className={clsx(classes.root, props.className)}
        >
            {props.itemsPerPageList && props.itemsPerPageList.length > 0 && (
                <>
                    <span className={classes.paginationItemsPerPageLabel}>
                        {props.texts?.itemsPerPage}
                    </span>

                    <Button
                        className={classes.paginationPageDropdown}
                        onClick={onLimitMenuAnchorClicked}
                        endIcon={<Icon>arrow_drop_down</Icon>}
                    >
                        {props.itemsPerPage}
                    </Button>
                    <Menu
                        getContentAnchorEl={null}
                        anchorEl={limitMenuAnchorEl}
                        keepMounted
                        anchorOrigin={{
                            vertical  : 'bottom',
                            horizontal: 'right',
                        }}
                        transformOrigin={{
                            vertical  : 'top',
                            horizontal: 'right',
                        }}
                        open={isLimitMenuOpened}
                        onClose={onLimitMenuClosed}
                    >
                        {props.itemsPerPageList.map((value: number) => {
                            return (
                                <MenuItem
                                    value={value}
                                    key={value}
                                    selected={value === props.itemsPerPage}
                                    onClick={() => {
                                        onLimitMenuClosed();
                                        onItemsPerPage(value);
                                    }}
                                >{value}
                                </MenuItem>
                            );
                        })}
                    </Menu>
                </>
            )}

            <Box className={classes.paginationPrevNextButtonsContainer}>
                {(!totalPages || totalPages) > props.pagingMinPages && (
                    <IconButton
                        className={classes.paginationPrevNextButton}
                        disabled={props.currentPage <= 0}
                        onClick={onFirstPage}
                    >
                        <Icon>first_page</Icon>
                    </IconButton>

                )}
                <IconButton
                    className={classes.paginationPrevNextButton}
                    disabled={props.currentPage <= 0}
                    onClick={onPrevPage}
                >
                    <Icon>navigate_before</Icon>
                </IconButton>

                <IconButton
                    className={classes.paginationPrevNextButton}
                    disabled={!props.hasMoreItems}
                    onClick={onNextPage}
                >
                    <Icon>navigate_next</Icon>
                </IconButton>

                {(!totalPages || totalPages) > props.pagingMinPages && (
                    <IconButton
                        className={classes.paginationPrevNextButton}
                        disabled={totalPages === undefined || props.currentPage === totalPages - 1}
                        onClick={onLastPage}
                    >
                        <Icon>last_page</Icon>
                    </IconButton>
                )}
            </Box>

            {(!totalPages || totalPages <= props.pagingMinPages) && props.texts && (
                <span className={classes.paginationCurrentPageLabel}>
                    {totalPages && props.texts.pageNofMTemplate.replaceAll(
                        '[[page_number]]', (props.currentPage + 1).toString(),
                    ).replaceAll('[[total_page]]', totalPages?.toString())}

                    {!totalPages && props.texts.pageNTemplate.replaceAll('[[page_number]]', (props.currentPage + 1).toString())}
                </span>
            )}

            {/* Only need to show the direct links to the page if we have more than 2 pages. If less than that, the user can use the next button */}
            {totalPages && totalPages > props.pagingMinPages && props.texts && (
                <>
                    <Button
                        className={classes.paginationPageDropdown}
                        onClick={onJumpToMenuAnchorClicked}
                        endIcon={<Icon>arrow_drop_down</Icon>}
                    >
                        <>
                            {totalPages && props.texts.pageNofMTemplate.replaceAll(
                                '[[page_number]]', (props.currentPage + 1).toString(),
                            ).replaceAll('[[total_page]]', totalPages?.toString())}

                            {!totalPages && props.texts.pageNTemplate.replaceAll('[[page_number]]', (props.currentPage + 1).toString())}
                        </>
                    </Button>
                    <Menu
                        getContentAnchorEl={null}
                        anchorEl={jumpToMenuAnchorEl}
                        keepMounted
                        anchorOrigin={{
                            vertical  : 'bottom',
                            horizontal: 'right',
                        }}
                        transformOrigin={{
                            vertical  : 'top',
                            horizontal: 'right',
                        }}
                        open={isJumpToMenuOpened}
                        onClose={onJumpToMenuClosed}
                    >
                        {pages.map((page: number) => {
                            return (
                                <MenuItem
                                    key={page}
                                    selected={page === props.currentPage}
                                    onClick={() => {
                                        onJumpToMenuClosed();
                                        onPage(page);
                                    }}
                                >
                                    {page + 1}
                                </MenuItem>
                            );
                        })}
                    </Menu>
                </>
            )}
        </div>
    );
};


export const PaginationBar = React.memo(PaginationBarSrc);
