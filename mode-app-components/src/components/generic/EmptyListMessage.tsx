import React, {
    CSSProperties,
} from 'react';
import {
    Typography, Theme, makeStyles, Icon, Button,
} from '@material-ui/core';
import clsx from 'clsx';


const useStyle = makeStyles((theme: Theme) => {
    return {
        root: {
            display                     : 'flex',
            alignItems                  : 'center',
            flexDirection               : 'column',
            padding                     : theme.spacing(1),
            [theme.breakpoints.up('sm')]: {
                padding: theme.spacing(2),
            },
        },

        icon: {
            fontSize                    : '4em',
            marginBottom                : theme.spacing(2),
            [theme.breakpoints.up('md')]: {
                fontSize: '6em',
            },
        },

        title: {
            marginBottom                : theme.spacing(1),
            textAlign                   : 'center',
            fontSize                    : '1.5em',
            [theme.breakpoints.up('md')]: {
                fontSize: '2em',
            },
        },

        message: {
            textAlign                   : 'center',
            fontSize                    : '1em',
            [theme.breakpoints.up('md')]: {
                fontSize: '1.5em',
            },
        },

        action: {
            marginTop     : theme.spacing(1),
            display       : 'flex',
            alignItems    : 'center',
            justifyContent: 'center',
            width         : '100%',
            '& button'    : {
                fontSize: 'smaller',
            },
            [theme.breakpoints.up('md')]: {
                marginTop : theme.spacing(2),
                '& button': {
                    fontSize: 'unset',
                },
            },
        },
    };
}, {
    name: 'EmptyList',
});



export interface EmptyListMessageProps {
    readonly className?: string | undefined;
    readonly style?: CSSProperties | undefined;

    readonly title?: string;            // Pre-translated text used for title
    readonly message?: string;          // Pre-translated text used for message
    readonly icon?: string | null;      // Undefined mean to use the default icon. Set to NULL to hide icon.
    readonly color?: 'inherit' | 'default' | 'disabled' | 'action' | 'primary' | 'secondary' | 'error';

    readonly action?: string | null;            // Optional action button
    readonly actionColor?: 'inherit' | 'primary' | 'secondary' | 'default';
    readonly actionHandler?: (event: React.MouseEvent<HTMLElement>)=> void;
}


/**
 * This Component can be used for showing a loading message.
 */
export const EmptyContentLoadingMessage: React.FC<EmptyListMessageProps> = (props: EmptyListMessageProps) => {
    const classes = useStyle();

    return (
        <div className={clsx(classes.root, props.className)} style={props.style}>
            <Icon
                className={classes.icon}
                color={props.color ? props.color : 'primary'}
            >
                {props.icon ? props.icon : 'hourglass_empty'}
            </Icon>
            {props.title
                && <Typography variant="h4" color="textPrimary" className={classes.title}>{props.title}</Typography>}
            {props.message
                && <Typography variant="h5" color="textPrimary" className={classes.message}>{props.message}</Typography>}
        </div>
    );
};



/**
 * This Component can be used for showing an Empty list message. Whenever we have a page that display list of items and when we
 * have an empty list, we can use this to display a message to let the user know the list is empty.
 */
export const EmptyListMessage: React.FC<EmptyListMessageProps> = (props: EmptyListMessageProps) => {
    const classes = useStyle();

    return (
        <div className={clsx(classes.root, props.className)} style={props.style}>
            {props.icon !== null && (
                <Icon
                    className={classes.icon}
                    color={props.color ? props.color : 'error'}
                >
                    {props.icon ? props.icon : 'sentiment_very_dissatisfied'}
                </Icon>
            )}

            {props.title
                && <Typography variant="h4" color="textPrimary" className={classes.title}>{props.title}</Typography>}
            {props.message
                && <Typography variant="h5" color="textPrimary" className={classes.message}>{props.message}</Typography>}
            {props.action && props.actionHandler && (
                <div className={classes.action}>
                    <Button
                        variant="contained"
                        color={props.actionColor ? props.actionColor : 'primary'}
                        onClick={props.actionHandler}
                    >
                        {props.action}
                    </Button>
                </div>
            )}
        </div>
    );
};


/**
 * This Component can be used for showing an Empty search result message. Whenever we have a page that let user search for items
 * and when the search return an empty result, we can use this to display a message to let the user know we can't find any item
 * the user is trying to search for.
 */
export const EmptySearchResultMessage: React.FC<EmptyListMessageProps> = (props: EmptyListMessageProps) => {
    const classes = useStyle();

    return (
        <div className={clsx(classes.root, props.className)} style={props.style}>
            <Icon
                className={classes.icon}
                color={props.color ? props.color : 'error'}
            >
                {props.icon ? props.icon : 'find_in_page'}
            </Icon>
            {props.title
                && <Typography variant="h4" color="textPrimary" className={classes.title}>{props.title}</Typography>}
            {props.message
                && <Typography variant="h5" color="textPrimary" className={classes.message}>{props.message}</Typography>}
            {props.action && props.actionHandler && (
                <div className={classes.action}>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={props.actionHandler}
                    >
                        {props.action}
                    </Button>
                </div>
            )}
        </div>
    );
};
