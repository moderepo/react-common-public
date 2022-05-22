import React from 'react';
import clsx from 'clsx';
import {
    makeStyles, Theme,
} from '@material-ui/core';

const useStyle = makeStyles((theme: Theme) => {
    return {
        root: {
            display       : 'flex',
            flexDirection : 'row',
            alignItems    : 'center',
            justifyContent: 'center',

            '&::after': {
                content     : '""',
                display     : 'inline-block',
                width       : '0.7em',
                height      : '0.7em',
                borderRadius: '50%',
                background  : 'linear-gradient(127deg, #fda0a0, #ff0000)',
                animation   : `$animate-flashing-off 1000ms infinite ${theme.transitions.easing.easeInOut}`,
            },

            '&.status-on': {
                '&::after': {
                    background: 'linear-gradient(127deg, #85ff8c, #2dde34)',
                    animation : `$animate-flashing-on 1000ms infinite ${theme.transitions.easing.easeInOut}`,
                },
            },
        },

        label: {
            fontWeight : 500,
            marginRight: theme.spacing(1),
            whiteSpace : 'nowrap',
        },

        '@keyframes animate-flashing-on': {
            '0%': {
                boxShadow: '0 0 0 0 rgba(133, 255, 140, 0)',
            },
            '40%': {
                boxShadow: '0 0 5px 3px rgba(133, 255, 140, 0.8)',
            },
        },

        '@keyframes animate-flashing-off': {
            '0%': {
                boxShadow: '0 0 0 0 rgba(253, 160, 160, 0)',
            },
            '40%': {
                boxShadow: '0 0 5px 3px rgba(253, 160, 160, 0.8)',
            },
        },
    };
}, {
    name: 'GenericStatus',
});

export interface GenericStatusIndicatorProps {
    readonly className?: string;
    readonly label?: string;
    readonly status: boolean;
}

export const GenericStatusIndicator: React.FC<GenericStatusIndicatorProps> = (props: GenericStatusIndicatorProps) => {
    const classes = useStyle();
    return (
        <span className={clsx(props.className, classes.root, props.status && 'status-on')}>
            {props.label && (
                <span className={clsx(classes.label)}>{props.label}</span>
            )}
        </span>
    );
};
