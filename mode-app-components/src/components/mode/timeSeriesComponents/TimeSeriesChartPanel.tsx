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
            flexDirection : 'column',
            alignItems    : 'flex-end',
            justifyContent: 'center',
        },

        currentValueLabel: {
            color: theme.palette.text.secondary,
        },

        currentValue: {
            fontWeight: 500,
            paddingTop: 2,
            color     : theme.palette.text.primary,
        },
    };
}, {
    name: 'TimeSeriesChartPanel', index: 1,
});



export interface TimeSeriesChartPanelProps extends BaseCompProps {
    readonly currentValue?: string;
    readonly dataCount: number | undefined;
    readonly seriesCount: number | undefined;
    readonly texts?: {
        readonly currentValueLabel?: string;
    };
    // The component to show when there are no data
    readonly noDataMessageComp: React.ReactNode;
}


/**
 * This component is just a panel to wrap charts. It has logic to show/hide charts based on the data count and some logic for the
 * header but otherwise it doesn't do anything else.
 */
export const TimeSeriesChartPanel: React.FC<TimeSeriesChartPanelProps & React.PropsWithChildren<React.ReactNode>> = (
    props: TimeSeriesChartPanelProps & React.PropsWithChildren<React.ReactNode>,
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
                            <div className={classes.currentValueDisplay}>
                                {props.texts && props.texts.currentValueLabel && (
                                    <div className={classes.currentValueLabel}>
                                        {props.texts.currentValueLabel}
                                    </div>
                                )}
                                <div className={classes.currentValue}>
                                    {props.currentValue}
                                </div>
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
