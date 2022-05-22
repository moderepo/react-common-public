import React from 'react';
import clsx from 'clsx';
import {
    makeStyles, Theme,
} from '@material-ui/core';
import {
    GenericStatusIndicator,
} from '../..';


const useStyle = makeStyles((theme: Theme) => {
    return {
        root: {
            display       : 'flex',
            flexDirection : 'column',
            alignItems    : 'flex-end',
            justifyContent: 'center',
        },

        deviceName: {
            color                       : theme.palette.text.secondary,
            textTransform               : 'uppercase',
            fontSize                    : 12,
            fontWeight                  : 500,
            whiteSpace                  : 'nowrap',
            marginBottom                : theme.spacing(0.2),
            [theme.breakpoints.up('md')]: {
                fontSize: 14,
            },
        },

        statusLabel: {
            fontSize                    : 18,
            [theme.breakpoints.up('md')]: {
                fontSize: 20,
            },
        },
    };
}, {
    name: 'DeviceStatus',
});


export interface DeviceStatusIndicatorProps {
    readonly className?: string;
    readonly deviceName: string;
    readonly statusLabel: string;
    readonly statusValue: boolean;
}


export const DeviceStatusIndicator: React.FC<DeviceStatusIndicatorProps> = (props: DeviceStatusIndicatorProps) => {

    const classes = useStyle();

    return (
        <div className={clsx(classes.root, props.className)}>
            <div className={clsx(classes.deviceName)}>{props.deviceName}</div>
            <GenericStatusIndicator
                className={clsx(classes.statusLabel)}
                label={props.statusLabel}
                status={Boolean(props.statusValue)}
            />
        </div>
    );
};
