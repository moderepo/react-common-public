import React, {
    useMemo,
} from 'react';
import {
    Paper, Table, TableRow, TableCell, TableHead, TableBody, makeStyles, CircularProgress, Box,
} from '@material-ui/core';
import clsx from 'clsx';
import {
    BaseListCompField, BaseListCompFieldsSet, BaseListCompFieldsSettings, BaseListCompProps, useModePanelStyle, useModeTableStyle, createHeaderColumn,
    MultiMetricsDataPoint, getNumberFormatter, getDateTimeFormatter,
} from '../../..';
import {
    CompPanelHeader,
} from '../compPanelHeader';



const useStyle = makeStyles(() => {
    return {

        panelContent: {
            padding      : 0,
            height       : '100%',
            display      : 'flex',
            flexDirection: 'column',
            overflow     : 'auto',
        },

        tableContainer: {
            overflow: 'auto',
            flex    : 1,
        },

        tableCol: {
            '&.date-col': {
                textAlign: 'left',
            },
            '&.spacer-col': {
                width: '100%',
            },
            '&.value-col': {
                textAlign: 'center',
            },
        },
    };
}, {
    name: 'TimeSeriesDataTable', index: 1,
});


// TimeSeriesTableCompField settings is just a BaseListCompField with an additional attribute "decimalPlaces" which can be used for customizing
// decimalPlaces for each field.
export interface TimeSeriesTableCompField extends BaseListCompField {
    // Decimal places to apply to all metrics
    readonly decimalPlaces?: number | undefined;
}


/**
 * Table columns setting for TimeSeriesDataTable. TimeSeriesDataTable columns settings MUST contain these column keys
 */
export interface TimeSeriesTableFieldsSet extends BaseListCompFieldsSet {
    readonly date: BaseListCompField;
    readonly [fieldName: string]: TimeSeriesTableCompField | undefined;
}


export interface TimeSeriesDataTableProps extends Omit<BaseListCompProps<MultiMetricsDataPoint>, 'listData'> {
    readonly listData: readonly MultiMetricsDataPoint[] | undefined;
    readonly fieldsSettings: BaseListCompFieldsSettings<TimeSeriesTableFieldsSet>;

    readonly locale?: string | undefined;

    // Decimal places to apply to all metrics
    readonly decimalPlaces?: number | undefined;

    readonly dateTimeFormat?: 'full' | 'compact' | 'date' | 'time' | Intl.DateTimeFormatOptions | undefined;

    readonly labels: {
        readonly emptyValues: string;           // value to be displayed if there is no value
    }
}



/**
 * This is a DUMB component that is in used for displaying time series data. All this component does is display data
 * provided through props. This component does not have any logic and any user action will be dispatched to the container's handlers.
 */
export const TimeSeriesDataTable = (props: TimeSeriesDataTableProps) => {

    const tableClasses = useModeTableStyle();
    const panelClasses = useModePanelStyle();
    const classes = useStyle();

    // Count the total number of columns excluding the date column
    const columnsCount = Object.keys(props.fieldsSettings.fields).filter((key: string): boolean => {
        return key !== 'date';
    }).length;


    const defaultNumberFormatter = useMemo(() => {
        return getNumberFormatter(props.locale ?? 'en', props.decimalPlaces ?? 3);
    }, [props.decimalPlaces, props.locale]);


    // Because Intl.NumberFormatter can only round number to 0 and 20 decimalPlaces therefore we can pre-create number formatter ahead of time
    const numberFormatterByDecimalPlaces = useMemo(() => {
        const result: Intl.NumberFormat[] = [];
        for (let i = 0; i <= 20; i += 1) {
            result[i] = getNumberFormatter(props.locale ?? 'en', i);
        }
        return result;
    }, [props.locale]);


    const dateFormatter = useMemo(() => {
        return getDateTimeFormatter(props.locale ?? 'en', props.dateTimeFormat ?? 'full');
    }, [props.dateTimeFormat, props.locale]);


    return (
        <Paper elevation={2} className={clsx(panelClasses.root, props.className, props.showCustomActionOnHover && 'show-custom-action-on-hover')}>

            <CompPanelHeader {...props} />

            <div className={clsx(panelClasses.panelContent, classes.panelContent)}>

                {columnsCount > 0 && props.listData && props.listData.length > 0 && (
                    <>
                        <div className={classes.tableContainer}>
                            <Table className={tableClasses.root} size="medium">
                                <TableHead className={tableClasses.tableHeader}>
                                    <TableRow className={tableClasses.tableHeaderRow}>
                                        <>
                                            {
                                                createHeaderColumn(
                                                    props.fieldsSettings, 'date', props.fieldsSettings.fields.date,
                                                    `${tableClasses.tableCol} ${classes.tableCol} date-col`,
                                                )
                                            }
                                            <TableCell className={`${tableClasses.tableCol} ${classes.tableCol} spacer-col`} />

                                            {Object.values(props.fieldsSettings.fields).filter((column: BaseListCompField | undefined) => {
                                                return !column?.hidden && column !== props.fieldsSettings.fields.date
                                                        && column !== props.fieldsSettings.fields.remove;
                                            }).map((column: BaseListCompField | undefined) => {
                                                if (column) {
                                                    return (
                                                        createHeaderColumn(
                                                            props.fieldsSettings, '', column,
                                                            `${tableClasses.tableCol} ${classes.tableCol} value-col`,
                                                        )
                                                    );
                                                }
                                                return <></>;
                                            })}
                                        </>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    <>
                                        {props.listData.map((
                                            dataItem, rowIndex: number,
                                        ): JSX.Element => {
                                            return (
                                                <TableRow
                                                    className={clsx(tableClasses.tableBodyRow)}
                                                    key={`${dataItem.dataPointTimestamp}-${rowIndex.toString()}`}
                                                >
                                                    <TableCell
                                                        className={clsx(tableClasses.tableCol, classes.tableCol, 'date-col')}
                                                    >
                                                        {dateFormatter.format(dataItem.dataPointTimestamp)}
                                                    </TableCell>
                                                    
                                                    <TableCell className={`${tableClasses.tableCol} ${classes.tableCol} spacer-col`} />

                                                    {Object.values(props.fieldsSettings.fields).filter((column) => {
                                                        return !column?.hidden && column !== props.fieldsSettings.fields.date
                                                            && column !== props.fieldsSettings.fields.remove;
                                                    }).map((column) => {
                                                        if (column) {
                                                            const value = column.dataItemProp ? dataItem[column.dataItemProp] : undefined;
                                                            const formattedValue = (() => {
                                                                if (value !== undefined && value !== null) {
                                                                    if (typeof value === 'number') {
                                                                        if (column.decimalPlaces !== undefined) {
                                                                            // Make sure the decimalPlaces is between 0 and 20
                                                                            const decimalPlaces = Math.max(0, Math.min(20, column.decimalPlaces));
                                                                            return numberFormatterByDecimalPlaces[decimalPlaces].format(value);
                                                                        }
                                                                        // Use default number formatter
                                                                        return defaultNumberFormatter.format(value);
                                                                    }
                                                                    // value is a string so return it as is
                                                                    return value;
                                                                }
                                                                return props.labels.emptyValues;
                                                            })();

                                                            return (
                                                                <TableCell
                                                                    key={`${column.dataItemProp || column.label}}`}
                                                                    className={clsx(tableClasses.tableCol, classes.tableCol, 'value-col')}
                                                                >
                                                                    { formattedValue }
                                                                </TableCell>
                                                            );
                                                        }
                                                        return <></>;
                                                    })}
                                                </TableRow>
                                            );
                                        })}
                                    </>
                                </TableBody>
                            </Table>
                        </div>

                        {props.paginationComp}
                    </>
                )}

                {/*
                    If there is no column or empty data points which mean either the user didn't select and column or there is no data for
                    the selected filters so show empty result message
                */}
                {(columnsCount <= 0 || (props.listData && props.listData.length === 0)) && props.emptyDataMessageComp }

                {/* If dataPoints is undefined, that mean we have not loaded data so show loading spinner */}
                {!props.listData && (
                    <Box padding={2}>
                        <CircularProgress />
                    </Box>
                )}
            </div>
        </Paper>
    );
};
