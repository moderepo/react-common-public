import {
    IconButton, Button, Theme, makeStyles,
} from '@material-ui/core';
import clsx from 'clsx';
import React, {
    ReactNode,
} from 'react';
import {
    BaseCompProps,
    BaseInfoCompProps,
} from '../../componentInterfaces';
import {
    useModePanelStyle,
} from '../../style';
import {
    CompCustomActionsMenu,
} from './CompCustomActionsMenu';
import {
    FontIcon,
} from './FontIcon';


const useStyle = makeStyles((theme: Theme) => {
    return {
        icon: {
            '&.clickable': {
                cursor: 'pointer',
            },
        },

        title: {
            '&.clickable': {
                cursor: 'pointer',
            },
        },

        action: {
            '&.info': {
                backgroundColor: theme.palette.info.main,
                color          : theme.palette.info.contrastText,
                '&:hover'      : {
                    backgroundColor: theme.palette.info.light,
                },
            },

            '&.success': {
                backgroundColor: theme.palette.success.main,
                color          : theme.palette.success.contrastText,
                '&:hover'      : {
                    backgroundColor: theme.palette.success.light,
                },
            },

            '&.warning': {
                backgroundColor: theme.palette.warning.main,
                color          : theme.palette.warning.contrastText,
                '&:hover'      : {
                    backgroundColor: theme.palette.warning.light,
                },
            },

            '&.error': {
                backgroundColor: theme.palette.error.main,
                color          : theme.palette.error.contrastText,
                '&:hover'      : {
                    backgroundColor: theme.palette.error.light,
                },
            },
        },
    };
});


// eslint-disable-next-line max-len
export interface InfoCompPanelHeaderProps extends Pick<BaseInfoCompProps, 'title' | 'subtitle' | 'icon' | 'onIconClick' | 'onTitleClick' | 'isEditing'| 'actions' | 'customPrimaryActions' | 'customSecondaryActions' | 'headerless' | 'borderlessHeader'> {
    readonly headerClassName?: string | undefined;
    readonly customContent?: ReactNode | undefined;
    readonly endCustomContent?: ReactNode | undefined;  // custom contents to add to the end
}



/**
 * This is a Generic Header component that can be used for most of the InfoComponent. Most InfoComponent has a title, icon,
 * Edit button so they can use this Component instead of repeating this code
 * @param props
 */
export const InfoCompPanelHeader: React.FC<InfoCompPanelHeaderProps> = (props: InfoCompPanelHeaderProps) => {
    const panelClasses = useModePanelStyle();
    const classes = useStyle();

    if (props.headerless) {
        return (<></>);
    }
    
    return (
        <div className={clsx(panelClasses.panelHeader, props.headerClassName, props.borderlessHeader && 'borderless')}>
            <div className={panelClasses.panelHeaderLeft}>
                {props.icon && (
                    <div
                        className={clsx(panelClasses.panelHeaderIconContainer, classes.icon, props.onIconClick && 'clickable')}
                        onClick={props.onIconClick}
                    >
                        <FontIcon className={clsx(panelClasses.panelHeaderIcon)} iconName={props.icon} />
                    </div>
                )}

                {(props.title || props.subtitle) && (
                    <div
                        className={clsx(panelClasses.panelHeaderTitle, classes.title, props.onTitleClick && 'clickable')}
                        onClick={props.onTitleClick}
                    >
                        {props.title && <div className="title">{props.title}</div>}
                        {props.subtitle && <div className="subtitle">{props.subtitle}</div>}
                    </div>
                )}
            </div>

            <div className={panelClasses.panelHeaderRight}>
                {props.customContent}

                {props.actions?.startEdit && !props.isEditing && (
                    <IconButton
                        size="small"
                        onClick={() => {
                            if (props.actions?.startEdit) {
                                props.actions.startEdit.onClick();
                            }
                        }}
                    >
                        <FontIcon iconName={props.actions.startEdit.icon || 'edit'} />
                    </IconButton>
                )}
                {props.actions?.removeObject && !props.isEditing && (
                    <IconButton
                        color="secondary"
                        size="small"
                        onClick={() => {
                            if (props.actions?.removeObject) {
                                props.actions.removeObject.onClick();
                            }
                        }}
                    >
                        <FontIcon iconName={props.actions.removeObject.icon || 'delete_outline'} />
                    </IconButton>
                )}

                {!props.isEditing && props.customPrimaryActions?.map((action) => {
                    if (action.icon && !action.label) {
                        return (
                            <IconButton
                                key={`${action.icon}-${action.label}`}
                                className={clsx(panelClasses.panelHeaderCustomPrimaryAction, classes.action, action.type)}
                                color="primary"
                                size="small"
                                onClick={() => {
                                    action.onClick();
                                }}
                            >
                                <FontIcon iconName={action.icon} />
                            </IconButton>
                        );
                    }
                    return (
                        <Button
                            key={`${action.icon}-${action.label}`}
                            className={clsx(panelClasses.panelHeaderCustomPrimaryAction, classes.action, action.type)}
                            color="primary"
                            size="small"
                            startIcon={action.icon ? <FontIcon iconName={action.icon} /> : undefined}
                            onClick={() => {
                                action.onClick();
                            }}
                        >
                            {action.label}
                        </Button>
                    );
                })}

                {props.endCustomContent}

                {props.customSecondaryActions && !props.isEditing && (
                    <CompCustomActionsMenu customActions={props.customSecondaryActions} />
                )}
            </div>
        </div>
    );
};


// eslint-disable-next-line max-len
export interface CompPanelHeaderProps extends Pick<BaseCompProps, 'title' | 'subtitle' | 'icon' | 'onIconClick' | 'onTitleClick' | 'customPrimaryActions' | 'customSecondaryActions' | 'headerless' | 'borderlessHeader'> {
    readonly headerClassName?: string | undefined;
    readonly customContent?: ReactNode | undefined;
    readonly endCustomContent?: ReactNode | undefined;  // custom contents to add to the end
}


/**
 * This is a Generic Header component that can be used for most of the InfoComponent. Most InfoComponent has a title, icon,
 * Edit button so they can use this Component instead of repeating this code
 * @param props
 */
export const CompPanelHeader: React.FC<CompPanelHeaderProps> = (props: CompPanelHeaderProps) => {
    const panelClasses = useModePanelStyle();
    const classes = useStyle();

    if (props.headerless) {
        return (<></>);
    }

    return (
        <div className={clsx(panelClasses.panelHeader, props.headerClassName, props.borderlessHeader && 'borderless')}>
            <div className={panelClasses.panelHeaderLeft}>
                {props.icon && (
                    <div
                        className={clsx(panelClasses.panelHeaderIconContainer, classes.icon, props.onIconClick && 'clickable')}
                        onClick={props.onIconClick}
                    >
                        <FontIcon className={clsx(panelClasses.panelHeaderIcon)} iconName={props.icon} />
                    </div>
                )}

                {(props.title || props.subtitle) && (
                    <div
                        className={clsx(panelClasses.panelHeaderTitle, classes.title, props.onTitleClick && 'clickable')}
                        onClick={props.onTitleClick}
                    >
                        {props.title && <div className="title">{props.title}</div>}
                        {props.subtitle && <div className="subtitle">{props.subtitle}</div>}
                    </div>
                )}
            </div>

            <div className={panelClasses.panelHeaderRight}>

                {props.customContent}

                {props.customPrimaryActions?.map((action) => {
                    if (action.icon && !action.label) {
                        return (
                            <IconButton
                                key={`${action.icon}-${action.label}`}
                                className={clsx(panelClasses.panelHeaderCustomPrimaryAction, classes.action, action.type)}
                                color={action.color}
                                size="small"
                                onClick={() => {
                                    action.onClick();
                                }}
                            >
                                <FontIcon iconName={action.icon} />
                            </IconButton>
                        );
                    }
                    return (
                        <Button
                            key={`${action.icon}-${action.label}`}
                            className={clsx(panelClasses.panelHeaderCustomPrimaryAction, classes.action, action.type)}
                            color={action.color}
                            variant={action.variant}
                            size="small"
                            startIcon={action.icon ? <FontIcon iconName={action.icon} /> : undefined}
                            onClick={() => {
                                action.onClick();
                            }}
                        >
                            {action.label}
                        </Button>
                    );
                })}

                {props.endCustomContent}

                {props.customSecondaryActions && (
                    <CompCustomActionsMenu customActions={props.customSecondaryActions} />
                )}
            </div>
        </div>
    );
};
