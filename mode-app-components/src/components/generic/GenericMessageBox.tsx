import React, {
    CSSProperties,
} from 'react';
import {
    Typography, Theme, makeStyles, Button, ButtonProps, TypographyProps,
} from '@material-ui/core';
import clsx from 'clsx';
import {
    FontIcon,
} from '..';


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
            fontSize                    : '3em',
            marginBottom                : theme.spacing(2),
            [theme.breakpoints.up('md')]: {
                fontSize: '4em',
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
    name: 'GenericMessageBox',
});



export interface GenericMessageBoxProps {
    readonly className?: string | undefined;
    readonly style?: CSSProperties | undefined;
    readonly title?: string | undefined;            // Pre-translated text used for title
    readonly titleColor?: TypographyProps['color'] | undefined;
    readonly message?: string | undefined;          // Pre-translated text used for message
    readonly messageColor?: TypographyProps['color'] | undefined;
    readonly icon?: string | undefined;
    readonly iconColor?: 'primary' | 'secondary' | 'error' | 'success' | 'warning' | 'info';
    readonly action?: string | null;
    readonly actionVariant?: ButtonProps['variant'] | undefined;
    readonly actionColor?: ButtonProps['color'] | undefined;
    readonly actionHandler?: (event: React.MouseEvent<HTMLElement>)=> void;
}



export const GenericMessageBox: React.FC<GenericMessageBoxProps> = (props: GenericMessageBoxProps) => {
    const classes = useStyle();

    return (
        <div className={clsx(classes.root, props.className)} style={props.style}>
            {props.icon && (
                <FontIcon
                    className={classes.icon}
                    iconName={props.icon}
                    color={props.iconColor}
                />
            )}
            {props.title
                && <Typography variant="h4" color={props.titleColor ?? 'textPrimary'} className={classes.title}>{props.title}</Typography>}
            {props.message
                && <Typography variant="h5" color={props.messageColor ?? 'textPrimary'} className={classes.message}>{props.message}</Typography>}
            {props.action && props.actionHandler && (
                <div className={classes.action}>
                    <Button
                        variant={props.actionVariant ?? 'contained'}
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
