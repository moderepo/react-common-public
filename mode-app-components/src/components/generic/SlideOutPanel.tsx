import {
    Button, Divider, Icon, IconButton, ListItemIcon, makeStyles, Menu, MenuItem, Theme,
} from '@material-ui/core';
import {
    hideSlideOutPanel, modeUIContext, selectSlideOutPanelOptions, SlideOutPanelLocation,
} from '@moderepo/mode-ui-state';
import clsx from 'clsx';
import React, {
    CSSProperties, PropsWithChildren, useCallback, useContext, useEffect, useMemo, useState,
} from 'react';
import {
    BaseCompAction,
} from '../../componentInterfaces/globalInterfaces';
import {
    useDropdown,
} from '../../utils/customHooks';
import {
    FontIcon,
} from '../mode/FontIcon';


const contentWidthMedium = 500;
const contentWidthLarge = 700;
const contentHeightMedium = 200;
const contentHeightLarge = 300;
const animationSpeedInMS = 500;

const useSlideOutPanelStyle = makeStyles((theme: Theme) => {

    return {
        root: {
            // The panel will have 2 sections, actionBar and content. This allows the content to be scrolled without moving the action bar
            display          : 'grid',
            gridTemplateAreas: `
                                    'actions'
                                    'content'
                               `,
            // There will be 2 rows, the first row will be used for the action bar and the second row will be the content which take 100% height
            gridTemplateRows: 'auto 1fr',

            '&.left': {
                width : '100%',
                height: '100%',
            },
            '&.right': {
                width : '100%',
                height: '100%',
            },
            '&.top': {
                width : '100%',
                height: '100%',
            },
            '&.bottom': {
                width : '100%',
                height: '100%',
            },
        },


        actionBarContainer: {
            padding       : theme.spacing(1),
            display       : 'flex',
            flexDirection : 'row',
            alignItems    : 'center',
            justifyContent: 'space-between',
            flexWrap      : 'wrap',
            borderBottom  : `1px solid ${theme.palette.divider}`,
            gridArea      : 'actions',

            '& .title': {
                fontWeight : 'bold',
                marginRight: theme.spacing(1),
                fontSize   : 16,
            },

            '& button': {
                textTransform: 'none',
                whiteSpace   : 'nowrap',
            },

            /* Primary actions should contain normal buttons but keep it 2 buttons max because they take up lots of space */
            '& .primary-actions': {
                display       : 'flex',
                flex          : 1,
                justifyContent: 'flex-start',
                alignItems    : 'center',

                '& button': {
                    marginRight: theme.spacing(1),
                },

                '& .title': {
                    color                       : `${theme.palette.text.primary}`,
                    fontSize                    : '24px',
                    fontWeight                  : 500,
                    [theme.breakpoints.up('md')]: {
                        fontSize: '26px',
                    },
                },
            },

            /* secondary actions should contain icon buttons to take up less space */
            '& .secondary-actions': {
                display       : 'flex',
                flex          : 1,
                justifyContent: 'flex-end',
                alignItems    : 'center',
            },
        },

        contentContainer: {
            gridArea: 'content',
            overflow: 'auto',
            padding : theme.spacing(1),
            width   : '100%',
        },


        [theme.breakpoints.up('md')]: {
            root: {
                '&.left': {
                    height               : '100%',
                    width                : 'fit-content',
                    '& $contentContainer': {
                        width: contentWidthMedium,
                    },
                },
                '&.right': {
                    height               : '100%',
                    width                : 'fit-content',
                    '& $contentContainer': {
                        width: contentWidthMedium,
                    },
                },
                '&.top': {
                    width                : '100%',
                    height               : 'fit-content',
                    '& $contentContainer': {
                        width: '100%',
                    },
                },
                '&.bottom': {
                    width                : '100%',
                    height               : 'fit-content',
                    '& $contentContainer': {
                        width: '100%',
                    },
                },
            },

            actionBarContainer: {
                padding   : theme.spacing(1, 2),
                '& .title': {
                    marginRight: theme.spacing(2),
                },

                '& .primary-actions': {
                    '& button': {
                        marginRight: theme.spacing(2),
                    },
                },
            },

            contentContainer: {
                padding: theme.spacing(2),
            },
        },


        [theme.breakpoints.up('lg')]: {
            root: {
                '&.left': {
                    '& $contentContainer': {
                        width: contentWidthLarge,
                    },
                },
                '&.right': {
                    '& $contentContainer': {
                        width: contentWidthLarge,
                    },
                },

            },

            actionBarContainer: {
                '& .title': {
                    marginRight: theme.spacing(2),
                },
                padding             : theme.spacing(1, 3),
                '& .primary-actions': {
                    '& button': {
                        marginRight: theme.spacing(2),
                    },
                },
            },

            contentContainer: {
                padding: theme.spacing(3),
                width  : contentWidthLarge,
            },
        },
    };
}, {
    name: 'SlidingPanel',
});


export interface SlideOutCompProps {
    readonly className?: string | undefined;
    readonly style?: CSSProperties | undefined;

    // Addition props to be applied to the action bar if the user want to customize the action bar
    readonly actionBarProps?: {
        readonly className?: string | undefined;
        readonly style?: CSSProperties | undefined;
    } | undefined;

    // Additional props to applied to the container of the main content's container if the user want to customize the container
    readonly contentContainerProps?: {
        readonly className?: string | undefined;
        readonly style?: CSSProperties | undefined;
    } | undefined;

    // The title to be displayed in the action bar
    readonly title?: string | undefined;

    // The set of actions to be shown on the Action bar. These buttons has Icons and Label so they can take up a lot
    // of space therefore make sure we don't try to add too many actions as primary actions
    readonly primaryActions?: readonly BaseCompAction[] | undefined;

    // The set of actions to be shown on the Action bar BUT under the "..." dropdown menu. This is an Array of BaseCompAction
    // But there can be null/undefined items in the middle of the array. These null/undefined items will be treated as dividers
    readonly secondaryActions?: readonly (BaseCompAction | null | undefined)[] | undefined;

    // The main content to be displayed in the body of the slide out component
    readonly compContent: JSX.Element | undefined;

    // Whether the panel can be closed, has a Close button. Default will be yes unless specifically set to false
    readonly closable?: boolean;

    // OPTIONAL option to hide the action bar
    readonly hideActionBar?: boolean | undefined;

    readonly onCloseButtonClicked?: (event: React.MouseEvent)=> void;
}


/**
 * SlideOutComp is a component that can be displayed in a SlideOutPanel. Most SlideOut component can use this component instead of
 * implementing everything from scratch. This component provides the implementation for the actions bar and the component content.
 * The SlideOutComp user can just provide the necessary props e.g. primaryActions, secondaryActions, component, etc...
 * @param props
 */
export const SlideOutComp: React.FC<SlideOutCompProps> = (props: SlideOutCompProps) => {
    const { state:uiState, dispatch:uiDispatch } = useContext(modeUIContext);
    const slideOutPanelOptions = selectSlideOutPanelOptions(uiState);
    const classes = useSlideOutPanelStyle();


    // The dropdown menu used in the top action bar
    const [menuAnchorEl, isMenuOpened, onMenuAnchorElClicked, onMenuClosed] = useDropdown();


    const onCloseButtonClicked = useCallback((event: React.MouseEvent) => {
        uiDispatch(hideSlideOutPanel());
        if (props.onCloseButtonClicked) {
            props.onCloseButtonClicked(event);
        }
    }, [props, uiDispatch]);


    // Show actions bar if there is at least 1 primaryAction or 1 secondaryAction or the panel is closable
    const hasActionsBar = useMemo(() => {
        return (
            props.hideActionBar !== true
            && (props.title
            || (props.primaryActions && props.primaryActions.length > 0)
            || (props.secondaryActions && props.secondaryActions.length > 0)
            || props.closable !== false));
    }, [props.closable, props.primaryActions, props.secondaryActions, props.title, props.hideActionBar]);


    return (
        <div
            className={clsx(classes.root, props.className, slideOutPanelOptions?.location || SlideOutPanelLocation.RIGHT)}
            style={props.style}
        >
            {hasActionsBar && (

                <div
                    className={clsx(classes.actionBarContainer, props.actionBarProps?.className)}
                    style={props.actionBarProps?.style}
                >
                    {props.title && (
                        <div className="title">{props.title}</div>
                    )}
                    <div className="primary-actions">
                        {props.primaryActions && props.primaryActions.length > 0 && (
                            <>
                                {props.primaryActions.map((action: BaseCompAction) => {
                                    return (
                                        <Button
                                            key={action.label}
                                            className={action.className}
                                            variant="contained"
                                            color="primary"
                                            style={action.style}
                                            disabled={action.disabled}
                                            startIcon={action.icon && <FontIcon className="icon" iconName={action.icon} />}
                                            onClick={(event: React.MouseEvent) => {
                                                event.stopPropagation();
                                                event.preventDefault();
                                                action.onClick();
                                            }}
                                        >
                                            {action.label}
                                        </Button>
                                    );
                                })}
                            </>
                        )}
                    </div>

                    <div className="secondary-actions">
                        {props.secondaryActions && props.secondaryActions.length > 0 && (
                            <>
                                <IconButton
                                    onClick={(event: React.MouseEvent<HTMLElement>) => {
                                        event.preventDefault();
                                        event.stopPropagation();
                                        onMenuAnchorElClicked(event);
                                    }}
                                >
                                    <Icon>more_vert</Icon>
                                </IconButton>
                                <Menu
                                    getContentAnchorEl={null}
                                    anchorEl={menuAnchorEl}
                                    anchorOrigin={{
                                        vertical  : 'bottom',
                                        horizontal: 'right',
                                    }}
                                    transformOrigin={{
                                        vertical  : 'top',
                                        horizontal: 'right',
                                    }}
                                    keepMounted
                                    open={isMenuOpened}
                                    onClose={() => {
                                        onMenuClosed();
                                    }}
                                >
                                    {props.secondaryActions.map((action: BaseCompAction | null | undefined, index: number) => {
                                        if (action) {
                                            return (
                                                <MenuItem
                                                    key={action.label}
                                                    className={action.className}
                                                    style={action.style}
                                                    disabled={action.disabled}
                                                    onClick={(event: React.MouseEvent) => {
                                                        event.stopPropagation();
                                                        event.preventDefault();
                                                        onMenuClosed();
                                                        action.onClick();
                                                    }}
                                                >
                                                    {action.icon && (
                                                        <ListItemIcon>
                                                            <FontIcon className="icon" iconName={action.icon} />
                                                        </ListItemIcon>
                                                    )}
                                                    {action.label}
                                                </MenuItem>
                                            );
                                        }
                                        return <Divider key={index.toString()} />;
                                    })}
                                </Menu>
                            </>
                        )}
                    </div>

                    {props.closable !== false && (
                        <IconButton
                            onClick={onCloseButtonClicked}
                        >
                            <Icon>close</Icon>
                        </IconButton>
                    )}
                </div>
            )}
            <div
                className={clsx(classes.contentContainer, props.contentContainerProps?.className || '')}
                style={props.contentContainerProps?.style}
            >
                {props.compContent}
            </div>
        </div>
    );
};



const useSlideOutPanelContainerStyle = makeStyles((theme: Theme) => {

    return {
        root: {
            overflow  : 'hidden',
            background: theme.palette.background.default,
            position  : 'fixed',
            zIndex    : theme.zIndex.modal,
            top       : 0,
            left      : 0,

            transition: `transform ${animationSpeedInMS}ms cubic-bezier(0.23, 1, 0.32, 1)`,

            '&.left': {
                width    : '100%',
                height   : '100%',
                transform: 'translateX(-100%)',                                             // hide the content by moving 100% to the right
            },
            '&.right': {
                width    : '100%',
                height   : '100%',
                transform: 'translateX(100%)',                                             // hide the content by moving 100% to the right
            },
            '&.top': {
                width    : '100%',
                height   : '100%',
                transform: 'translateY(-100%)',                                             // hide the content by moving 100% to the right
            },
            '&.bottom': {
                width    : '100%',
                height   : '100%',
                transform: 'translateY(100%)',                                             // hide the content by moving 100% to the right
            },

            '&.show': {
                boxShadow: '0 0 25px 0px rgba(0, 0, 0, 0.2)',
                '&.left' : {
                    transform: 'translateX(0%)',                                             // hide the content by moving 100% to the right
                },
                '&.right': {
                    transform: 'translateX(0%)',                                             // hide the content by moving 100% to the right
                },
                '&.top': {
                    transform: 'translateY(0%)',                                             // hide the content by moving 100% to the right
                },
                '&.bottom': {
                    transform: 'translateY(0%)',                                             // hide the content by moving 100% to the right
                },
            },
        },


        [theme.breakpoints.up('md')]: {
            root: {
                zIndex  : 1,
                position: 'absolute',

                '&.left': {
                    left    : 0,
                    right   : 'unset',
                    top     : 'unset',
                    bottom  : 'unset',
                    minWidth: contentWidthMedium,
                    width   : 'fit-content',            // Allow the container to go beyond minWidth if the content require larger width
                },
                '&.right': {
                    left    : 'unset',
                    right   : 0,
                    top     : 'unset',
                    bottom  : 'unset',
                    minWidth: contentWidthMedium,
                    width   : 'fit-content',            // Allow the container to go beyond minWidth if the content require larger width
                },
                '&.top': {
                    left     : 'unset',
                    right    : 'unset',
                    top      : 0,
                    bottom   : 'unset',
                    minHeight: contentHeightMedium,
                    height   : 'fit-content',
                },
                '&.bottom': {
                    left     : 'unset',
                    right    : 'unset',
                    top      : 'unset',
                    bottom   : 0,
                    minHeight: contentHeightMedium,
                    height   : 'fit-content',
                },

                '&.show': {
                    '&.left': {
                        transform: 'translateX(0%)',                           // show the content by moving to the left
                    },
                    '&.right': {
                        transform: 'translateX(0%)',                           // show the content by moving to the right
                    },
                    '&.top': {
                        transform: 'translateY(0%)',                           // show the content by moving to the top
                    },
                    '&.bottom': {
                        transform: 'translateY(0%)',                           // show the content by moving to the bottom
                    },
                },
            },
        },


        [theme.breakpoints.up('lg')]: {
            root: {
                '&.left': {
                    minWidth: contentWidthLarge,
                },
                '&.right': {
                    minWidth: contentWidthLarge,
                },
                '&.top': {
                    minHeight: contentHeightLarge,
                },
                '&.bottom': {
                    minHeight: contentHeightLarge,
                },
            },
        },
    };
}, {
    name: 'SlideOutPanelContainer',
});



export const SlideOutPanel: React.FC = (props: PropsWithChildren<React.ReactNode>) => {
    const { state:uiState } = useContext(modeUIContext);
    const slideOutPanelOptions = selectSlideOutPanelOptions(uiState);
    const [previousLocation, setPreviousLocation] = useState<SlideOutPanelLocation | undefined>();
    const classes = useSlideOutPanelContainerStyle();


    useEffect(() => {
        if (slideOutPanelOptions) {
            setPreviousLocation(slideOutPanelOptions.location);
        }
    }, [slideOutPanelOptions]);



    return (
        <div
            className={clsx(
                classes.root, slideOutPanelOptions && 'show', slideOutPanelOptions?.location || previousLocation || SlideOutPanelLocation.RIGHT,
            )}
        >
            { props.children }
        </div>
    );
};
