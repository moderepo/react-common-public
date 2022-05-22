import React from 'react';
import {
    Paper, Table, TableRow, TableCell, TableHead, TableBody, makeStyles, CircularProgress, Box,
} from '@material-ui/core';
import clsx from 'clsx';
import {
    BaseListCompField, BaseListCompFieldsSet, BaseListCompFieldsSettings, BaseListCompProps, BaseListCompDataItem, MultiSeriesDataPoint,
    roundValue, useModePanelStyle, useModeTableStyle, createHeaderColumn,
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
                width    : '50%',
                textAlign: 'left',
            },
            '&.value-col': {
                textAlign: 'center',
            },
        },
    };
}, {
    name: 'TimeSeriesDataTable', index: 1,
});



/**
 * Table columns setting for TimeSeriesDataTable. TimeSeriesDataTable columns settings MUST contain these column keys
 */
export interface TimeSeriesTableFieldsSet extends BaseListCompFieldsSet {
    readonly date: BaseListCompField;
}


export interface TimeSeriesDataTableProps extends BaseListCompProps<MultiSeriesDataPoint<number | string>> {
    readonly listData: readonly BaseListCompDataItem<MultiSeriesDataPoint<number | string>>[] | undefined;
    readonly fieldsSettings: BaseListCompFieldsSettings<TimeSeriesTableFieldsSet>;
    readonly decimalPlaces: number;
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
                                            dataItem: BaseListCompDataItem<MultiSeriesDataPoint<number | string>>, rowIndex: number,
                                        ): JSX.Element => {
                                            return (
                                                <TableRow
                                                    className={clsx(tableClasses.tableBodyRow)}
                                                    key={`${dataItem.actualValue.dateString}-${rowIndex.toString()}`}
                                                >
                                                    <TableCell
                                                        className={clsx(tableClasses.tableCol, classes.tableCol, 'date-col')}
                                                    >
                                                        {dataItem.actualValue.dateString}
                                                    </TableCell>
                                                    {Object.values(props.fieldsSettings.fields).filter((column: BaseListCompField | undefined) => {
                                                        return !column?.hidden && column !== props.fieldsSettings.fields.date
                                                            && column !== props.fieldsSettings.fields.remove;
                                                    }).map((column: BaseListCompField | undefined) => {
                                                        if (column) {
                                                            return (
                                                                <TableCell
                                                                    key={`${column.dataItemProp || column.label}}`}
                                                                    className={clsx(tableClasses.tableCol, classes.tableCol, 'value-col')}
                                                                >
                                                                    {
                                                                        column.dataItemProp
                                                                        && typeof dataItem.actualValue.values[column.dataItemProp] === 'number'
                                                                            ? roundValue(
                                                                                Number(dataItem.actualValue.values[column.dataItemProp]),
                                                                                props.decimalPlaces,
                                                                            )
                                                                            : (
                                                                                column.dataItemProp
                                                                                && dataItem.actualValue.values[column.dataItemProp]
                                                                            ) || props.labels.emptyValues
                                                                    }
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
