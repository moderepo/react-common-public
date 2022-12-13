import React from 'react';
import {
    Paper, Table, TableRow, TableCell, TableHead, TableBody, makeStyles, CircularProgress, Box, Theme,
} from '@material-ui/core';
import clsx from 'clsx';
import {
    TimeSeriesInfo,
} from '@moderepo/mode-apis';
import {
    BaseListCompFieldsSet, BaseListCompField, BaseListCompFieldsSettings, createHeaderColumn, useModeTableStyle, useModePanelStyle,
    BaseListCompDataItem,
} from '../../..';
import {
    createPreviewItemCell,
    createRemoveItemCell,
} from '../../componentUtils';
import {
    BaseTimeSeriesListProps,
} from '../../../componentInterfaces/listComponents/timeSeriesListInterfaces';
import {
    SearchBox,
} from '../../generic';
import {
    CompPanelHeader,
} from '../compPanelHeader';



const useStyle = makeStyles((theme: Theme) => {
    return {

        panelHeaderIcon: {
        },

        panelContent: {
            padding      : 0,
            height       : '100%',
            display      : 'flex',
            flexDirection: 'column',
        },

        searchBoxContainer: {
            width                       : '100%',
            marginLeft                  : theme.spacing(1),
            [theme.breakpoints.up('sm')]: {
                width   : 'auto',
                minWidth: '20em',
                maxWidth: '20em',
            },
        },

        tableContainer: {
            overflow: 'auto',
            flex    : 1,
        },

        tableCol: {
            '&.id-col': {
                textAlign: 'left',
            },
            '&.homeId-col': {
                textAlign: 'center',
            },
            '&.moduleId-col': {
                textAlign: 'center',
            },
            '&.timeZone-col': {
                textAlign: 'left',
            },
        },

    };
}, {
    name: 'TimeSeriesTable', index: 1,
});


/**
 * This is the data structure for the row data to be displayed in the table. The value for all these fields will be strings because
 * they will be displayed in the table. These values MUST be localized/formatted/processed by the container. The table is a dumb
 * component and does not know what these values mean so it will only display these values and nothing else.
 * For each column this table has, there should be a field in this data structure corresponding to that column.
 */
export interface DisplayableTimeSeriesTableDataItem {
    readonly id?: string;
    readonly homeId?: string;
    readonly moduleId?: string;
    readonly timeZone?: string;
}


/**
 * Each row of table data will have 2 data, the display data (all strings) used for displaying in the table cell. The actual data used for adding
 * special UI for the data. Actual data is not used often but we will need it in some cases. For example, sometime the data contain some status
 * such as connected/disconnected, verified/not verified, etc... For these cases, we don't just want to show plain text but we also want to add
 * some color to highlight these statuses. For example, we want to show green background for connected or verified status and red background for
 * disconnected or not verified statuses. Therefore, this is the reason we need both displayed data and actual data for all table data.
 */
export interface TimeSeriesTableDataItem extends BaseListCompDataItem<TimeSeriesInfo> {
    readonly displayValue: DisplayableTimeSeriesTableDataItem;
}


/**
 * Table columns setting for TimeSeriesTable. TimeSeriesTable columns settings MUST contain these column keys
 */
interface TimeSeriesTableFieldsSet extends BaseListCompFieldsSet {
    readonly id?: BaseListCompField;
    readonly homeId?: BaseListCompField;
    readonly moduleId?: BaseListCompField;
    readonly timeZone?: BaseListCompField;
}


export interface TimeSeriesTableProps extends BaseTimeSeriesListProps {
    readonly listData: readonly TimeSeriesTableDataItem[] | undefined;
    readonly fieldsSettings: BaseListCompFieldsSettings<TimeSeriesTableFieldsSet>;

    readonly texts: {
        readonly searchBox: {
            readonly placeholder: string;
        }
    }

    // true by default
    readonly enableSearch?: boolean;
    readonly onSearchTextChanged?: (searchText: string)=> void;
}


/**
 * This is an implementation of TimeSeriesList component that display list of TimeSeriesInfo in table form.
 */
export const TimeSeriesTable: React.FC<TimeSeriesTableProps> = (props: TimeSeriesTableProps) => {

    const tableClasses = useModeTableStyle();
    const panelClasses = useModePanelStyle();
    const classes = useStyle();


    return (
        <Paper elevation={2} className={clsx(panelClasses.root, props.className, props.showCustomActionOnHover && 'show-custom-action-on-hover')}>

            <CompPanelHeader
                {...props}
                customContent={(
                    <>
                        {props.enableSearch !== false && (
                            <div className={classes.searchBoxContainer}>
                                <SearchBox
                                    placeholder={props.texts.searchBox.placeholder}
                                    onChange={(value: string) => {
                                        if (props.onSearchTextChanged) {
                                            props.onSearchTextChanged(value);
                                        }
                                    }}
                                />
                            </div>
                        )}
                    </>
                )}
            />

            <div className={clsx(panelClasses.panelContent, classes.panelContent)}>

                {props.listData && props.listData.length > 0 && (
                    <>
                        <div className={classes.tableContainer}>
                            <Table className={tableClasses.root} size="medium">
                                <TableHead className={tableClasses.tableHeader}>
                                    <TableRow className={tableClasses.tableHeaderRow}>
                                        {/* filter out hidden columns first and then go through each column to create Header Cell */}
                                        {Object.keys(props.fieldsSettings.fields).filter((fieldName: string) => {
                                            return !props.fieldsSettings.fields[fieldName]?.hidden;
                                        }).map((fieldName: string) => {
                                            const field = props.fieldsSettings.fields[fieldName];
                                            if (field && !field.hidden) {
                                                return createHeaderColumn(
                                                    props.fieldsSettings, fieldName, field,
                                                    `${tableClasses.tableCol} ${classes.tableCol} ${fieldName}-col`,
                                                );
                                            }
                                            return <></>;
                                        })}
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {props.listData.map((dataItem: TimeSeriesTableDataItem): JSX.Element => {
                                        return (
                                            <TableRow
                                                className={clsx(tableClasses.tableBodyRow, 'clickable', dataItem.selected && 'selected')}
                                                key={dataItem.actualValue.id}
                                                onClick={() => {
                                                    if (props.onListItemSelected) {
                                                        props.onListItemSelected(dataItem.actualValue);
                                                    }
                                                }}
                                            >
                                                {/* filter out hidden columns first and then go through each column to create Table Cell */}
                                                {Object.keys(props.fieldsSettings.fields).filter((fieldName: string) => {
                                                    return !props.fieldsSettings.fields[fieldName]?.hidden;
                                                }).map((fieldName: string) => {

                                                    if (fieldName === 'remove' && props.fieldsSettings.fields.remove
                                                        && !props.fieldsSettings.fields.remove.hidden) {
                                                        return (
                                                        // NOTE: dataItem.canBeRemoved must be true
                                                            createRemoveItemCell(dataItem, clsx(
                                                                tableClasses.tableCol, classes.tableCol, `${fieldName}-col`,
                                                            ),
                                                            props.onRemoveItemClicked)
                                                        );
                                                    }
                                                    
                                                    if (fieldName === 'preview' && props.fieldsSettings.fields.preview
                                                        && !props.fieldsSettings.fields.preview.hidden) {
                                                        return createPreviewItemCell(
                                                            dataItem, clsx(tableClasses.tableCol, classes.tableCol, `${fieldName}-col`),
                                                            props.onPreviewItemClicked,
                                                        );
                                                    }

                                                    /**
                                                     * Handle all the other fields that don't have special UI. These are the fields that
                                                     * display dataItem.displayValue as plain text
                                                     */
                                                    if (props.fieldsSettings.fields[fieldName]
                                                        && !(props.fieldsSettings.fields[fieldName] as BaseListCompField).hidden) {
                                                        return (
                                                            <TableCell
                                                                key={fieldName}
                                                                className={clsx(tableClasses.tableCol, classes.tableCol, `${fieldName}-col`)}
                                                            >
                                                                {dataItem.displayValue[fieldName]}
                                                            </TableCell>
                                                        );
                                                    }

                                                    return <></>;
                                                })}
                                            </TableRow>
                                        );
                                    })}
                                </TableBody>
                            </Table>
                        </div>
                    </>
                )}

                {props.listData && props.listData.length === 0 && props.emptyDataMessageComp}

                {props.listData && props.paginationComp}

                {!props.listData && (
                    <Box padding={2}>
                        <CircularProgress />
                    </Box>
                )}
            </div>
        </Paper>
    );
};
