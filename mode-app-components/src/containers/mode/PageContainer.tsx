import React, {
    useContext,
} from 'react';
import {
    alpha,
    makeStyles, Theme,
} from '@material-ui/core';
import {
    Helmet,
} from 'react-helmet';
import clsx from 'clsx';
import {
    modeUIContext,
} from '@moderepo/mode-ui-state';
import * as UISelectors from '@moderepo/mode-ui-state';


const useStyle = makeStyles((theme: Theme) => {
    return {
        pageContent: {
            height  : '100%',
            position: 'relative',

            '&.editing-form': {
                /**
                 * When editing-form, disable mouse event on the page, this will disable mouse event even on the children and grandchildren
                 */
                pointerEvents: 'none',

                /**
                 * Allow the container that has 'editing' className to have mouse event. This mean all of its children, grandchildren will also
                 * have mouse event automatically.
                 */
                '& .editing': {
                    pointerEvents: 'auto',
                    boxShadow    : `0px 0px 20px 10px ${alpha(theme.palette.primary.main, 0.4)}`,
                },

                /**
                 * Also allow 'page-main-content', 'slide-out-comp-container', and elements with className 'scrollable-container' to have mouse event.
                 * However, don't allow its children to have mouse event. We just need to enable mouse event on these containers so that the user
                 * can still scroll
                 */
                '& .page-main-content, .slide-out-comp-container, .scrollable-container': {
                    pointerEvents: 'auto',

                    // Disable mouse event on the children
                    '& > :not(.editing)': {
                        pointerEvents: 'none',
                    },
                },
            },

            '& .page-main-content': {
                padding : theme.spacing(1),
                overflow: 'hidden auto',
                position: 'relative',
                zIndex  : 1,
            },


            '& .title-bar': {
                padding      : theme.spacing(0, 0, 1, 0),
                display      : 'flex',
                alignItems   : 'flex-end',
                flexDirection: 'column',

                '& .title-bar-item': {
                    flex      : 1,
                    width     : '100%',
                    alignItems: 'flex-start',

                    '&:first-child': {
                        marginBottom: theme.spacing(1),
                    },
                },

                '& .title-text': {
                    '& .page-title': {
                        color                       : `${theme.palette.text.secondary}`,
                        fontSize                    : '12px',
                        textTransform               : 'uppercase',
                        fontWeight                  : 500,
                        [theme.breakpoints.up('md')]: {
                            fontSize: '14px',
                        },
                    },

                    '& .page-subtitle': {
                        color                       : `${theme.palette.text.primary}`,
                        fontSize                    : '24px',
                        fontWeight                  : 500,
                        [theme.breakpoints.up('md')]: {
                            fontSize: '26px',
                        },
                    },
                },
            },

        },

        [theme.breakpoints.up('sm')]: {
            pageContent: {
                '& .title-bar': {
                    flexDirection : 'row',
                    alignItems    : 'center',
                    justifyContent: 'space-between',

                    '& .title-bar-item': {
                        '&:first-child': {
                            marginBottom: theme.spacing(0),
                            marginLeft  : theme.spacing(1),
                        },
                        '&:not(:first-child)': {
                            flex      : '0',
                            alignItems: 'flex-end',
                        },
                    },
                },
            },
        },

        [theme.breakpoints.up('md')]: {
            pageContent: {
                display            : 'grid',
                overflow           : 'hidden',
                gridTemplateColumns: '1fr auto',
                gridTemplateRows   : '1fr',
                gridTemplateAreas  : `
                                        'mainContent previewContent'
                                    `,

                '& .page-main-content': {
                    padding : theme.spacing(2, 2, 5, 2),
                    gridArea: 'mainContent',

                    '& .title-bar': {
                        padding: theme.spacing(0, 0, 2, 0),
                    },
                },
            },
        },

        [theme.breakpoints.up('lg')]: {
            pageContent: {
                '& .page-main-content': {
                    padding       : theme.spacing(3, 3, 10, 3),
                    '& .title-bar': {
                        padding: theme.spacing(0, 0, 2, 0),
                    },
                },
            },
        },
    };
}, {
    name: 'GenericPage',
});



export interface PageContainerProps {
    readonly children: React.ReactNode;
    readonly isLoading?: boolean;
    readonly appTitle: string;
    readonly appDescription: string;
    readonly appThemeColor: string;
    readonly layoutComp: React.FC;
}


/**
 * This is a wrapper for all pages in the app. Every page has the same layout, top nav, drawer menu therefore instead of
 * creating these base layout in each page, we use this as the main component and each page will only need to implement
 * the content for the page.
 */
export const PageContainer: React.FC<PageContainerProps> = (props: PageContainerProps) => {
    const classes = useStyle();
    const { state } = useContext(modeUIContext);
    const isEditingForm = UISelectors.selectIsEditingForm(state);
    const LayoutComp = props.layoutComp;


    return (
        <LayoutComp>
            <Helmet>
                <title>{props.appTitle}</title>
                <meta name="description" content={props.appDescription} />
                <meta name="theme-color" content={props.appThemeColor} />
            </Helmet>
            {props.isLoading
                ? (
                    <div
                        className={clsx(classes.pageContent)}
                    >
                        {props.children}
                    </div>
                )
                : (
                    <div
                        className={clsx(classes.pageContent, isEditingForm && 'editing-form')}
                    >
                        {props.children}
                    </div>
                )}
        </LayoutComp>
    );
};
