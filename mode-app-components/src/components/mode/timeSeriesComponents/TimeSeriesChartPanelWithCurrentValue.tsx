import React from 'react';
import {
    CircularProgress, Paper, makeStyles, Box, Theme,
} from '@material-ui/core';
import clsx from 'clsx';
import {
    useModePanelStyle,
} from '../../..';
import {
    CompPanelHeader,
} from '../compPanelHeader';
import {
    BaseCompProps,
} from '../../../componentInterfaces';



const useStyle = makeStyles((theme: Theme) => {
    return {
        root: {
            overflow: 'hidden',
            height  : 500,
        },

        panelContent: {
            padding      : 0,
            height       : '100%',
            display      : 'flex',
            flexDirection: 'column',
        },

        currentValueDisplay: {
            paddingLeft   : theme.spacing(1),
            display       : 'flex',
            flexDirection : 'row',
            alignItems    : 'center',
            justifyContent: 'flex-end',

            '& .label': {
                color      : theme.palette.text.secondary,
                fontSize   : 15,
                marginRight: theme.spacing(1),
            },

            '& .unit': {
                color     : theme.palette.text.secondary,
                marginLeft: theme.spacing(0.5),
                fontSize  : 20,
            },

            '& .value': {
                fontWeight: 500,
                paddingTop: 2,
                fontSize  : 30,
                color     : theme.palette.text.primary,
            },
        },


        [theme.breakpoints.up('md')]: {
            currentValueDisplay: {
                '& .label': {
                    fontSize: 20,
                },
                '& .unit': {
                    fontSize: 25,
                },
                '& .value': {
                    fontSize: 35,
                },
            },
        },
        [theme.breakpoints.up('lg')]: {
            currentValueDisplay: {
                '& .label': {
                    fontSize: 25,
                },
                '& .unit': {
                    fontSize: 35,
                },
                '& .value': {
                    fontSize: 45,
                },
            },
        },
    };
}, {
    name: 'TimeSeriesChartPanel', index: 1,
});



export interface TimeSeriesChartPanelWithCurrentValueProps extends BaseCompProps {
    readonly currentValue?: {
        readonly label?: string | undefined;
        readonly value: string,
        readonly unit?: string | undefined;
        readonly className?: string | undefined;
    } | undefined;
    readonly dataCount: number | undefined;
    readonly seriesCount: number | undefined;
    // The component to show when there are no data
    readonly noDataMessageComp: React.ReactNode;
}


/**
 * This component is just a panel to wrap charts. It has logic to show/hide charts based on the data count and some logic for the
 * header but otherwise it doesn't do anything else.
 */
export const TimeSeriesChartPanelWithCurrentValue: React.FC<TimeSeriesChartPanelWithCurrentValueProps & React.PropsWithChildren<React.ReactNode>> = (
    props: TimeSeriesChartPanelWithCurrentValueProps & React.PropsWithChildren<React.ReactNode>,
) => {

    const panelClasses = useModePanelStyle();
    const classes = useStyle();


    return (
        <Paper
            elevation={2}
            className={clsx(panelClasses.root, classes.root, props.className, props.showCustomActionOnHover && 'show-custom-action-on-hover')}
        >

            <CompPanelHeader
                {...(props as object)}
                customContent={(
                    <>
                        {props.currentValue && (
                            <div className={clsx(classes.currentValueDisplay, props.currentValue.className)}>
                                {props.currentValue.label && (
                                    <div className="label">
                                        {props.currentValue.label}
                                    </div>
                                )}
                                <div className="value">
                                    {props.currentValue.value}
                                </div>
                                {props.currentValue.unit && (
                                    <div className="unit">
                                        {props.currentValue.unit}
                                    </div>
                                )}
                            </div>
                        )}
                    </>
                )}
            />

            <div className={clsx(panelClasses.panelContent, classes.panelContent)}>

                {props.seriesCount !== undefined && props.seriesCount > 0 && props.dataCount !== undefined && props.dataCount > 0 && (
                    props.children
                )}

                {/*
                    If there is no selected metrics or empty data points which mean either the user didn't select and column or there is no data for
                    the selected filters so show empty result message
                */}
                {(props.seriesCount === 0 || props.dataCount === 0) && props.noDataMessageComp}

                {/* If dataPoints is undefined, that mean we have not loaded data so show loading spinner */}
                {props.dataCount === undefined && (
                    <Box padding={2}>
                        <CircularProgress />
                    </Box>
                )}
            </div>
        </Paper>
    );
};
