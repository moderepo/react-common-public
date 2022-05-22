import React from 'react';
import {
    Paper, Table, TableRow, TableCell, TableHead, TableBody, makeStyles, CircularProgress, Box, Theme,
} from '@material-ui/core';
import clsx from 'clsx';
import {
    KeyValuePair,
} from '@moderepo/mode-apis';
import {
    BaseListCompFieldsSet, BaseListCompField, BaseListCompFieldsSettings, createHeaderColumn, useModeTableStyle, useModePanelStyle,
    BaseKVPairsListProps, BaseListCompDataItem,
} from '../../..';
import {
    createPreviewItemCell,
    createRemoveItemCell,
} from '../../componentUtils';
import {
    CompPanelHeader,
} from '../compPanelHeader';



const useStyle = makeStyles((theme: Theme) => {
    return {

        panelContent: {
            padding      : 0,
            height       : '100%',
            display      : 'flex',
            flexDirection: 'column',
        },

        tableContainer: {
            overflow: 'hidden',
            flex    : 1,
        },

        table: {
        },

        tableCol: {
            '&.key-col': {
                textAlign: 'left',
                width    : '1%',
            },
            '&.value-col': {
                textAlign : 'left',
                width     : '100%',
                '& .value': {
                    wordBreak : 'break-all',
                    whiteSpace: 'normal',
                    lineClamp : 1,
                    overflow  : 'hidden',
                    display   : '-webkit-box',
                    boxOrient : 'vertical',
                },
            },
            '&.modificationTime-col': {
                textAlign: 'left',
                width    : '1%',
            },
        },

        addKVPairButton: {
            backgroundColor: theme.palette.success.main,
            color          : theme.palette.success.contrastText,
            '&:hover'      : {
                backgroundColor: theme.palette.success.light,
            },
        },
    };
}, {
    name: 'KVPairsTable', index: 1,
});


/**
 * This is the data structure for the row data to be displayed in the table. The value for all these fields will be strings because
 * they will be displayed in the table. These values MUST be localized/formatted/processed by the container. The table is a dumb
 * component and does not know what these values mean so it will only display these values and nothing else.
 * For each column this table has, there should be a field in this data structure corresponding to that column.
 */
export interface DisplayableKVPairsTableDataItem {
    readonly key?: string;
    readonly value?: string;
    readonly modificationTime?: string;
}


/**
 * Each row of table data will have 2 data, the display data (all strings) used for displaying in the table cell. The actual data used for adding
 * special UI for the data. Actual data is not used often but we will need it in some cases. For example, sometime the data contain some status
 * such as connected/disconnected, verified/not verified, etc... For these cases, we don't just want to show plain text but we also want to add
 * some color to highlight these statuses. For example, we want to show green background for connected or verified status and red background for
 * disconnected or not verified statuses. Therefore, this is the reason we need both displayed data and actual data for all table data.
 */
export interface KVPairsTableDataItem extends BaseListCompDataItem<KeyValuePair> {
    readonly displayValue: DisplayableKVPairsTableDataItem;
}


/**
 * Table columns setting for KV Pairs table. KV Pairs table columns settings MUST contain these column keys
 */
export interface KVPairsTableFieldsSet extends BaseListCompFieldsSet {
    readonly key?: BaseListCompField;
    readonly value?: BaseListCompField;
    readonly modificationTime?: BaseListCompField;
}


export interface KVPairsTableProps extends BaseKVPairsListProps {
    readonly listData: readonly KVPairsTableDataItem[] | undefined;
    readonly fieldsSettings: BaseListCompFieldsSettings<KVPairsTableFieldsSet>;
}


/**
 * This is a DUMB component that is in charge of displaying the list of KV Pair with pagination. All this component does is display data
 * provided through props. This component does not have any logic and any user action will be dispatched to the container's handlers.
 */
export const KVPairsTable = (props: KVPairsTableProps) => {

    const tableClasses = useModeTableStyle();
    const panelClasses = useModePanelStyle();
    const classes = useStyle();


    return (
        <Paper
            elevation={2}
            className={clsx(panelClasses.root, props.className,
                props.showCustomActionOnHover && 'show-custom-action-on-hover')}
        >

            <CompPanelHeader {...props} />

            <div className={clsx(panelClasses.panelContent, classes.panelContent)}>

                {props.listData && props.listData.length > 0 && (
                    <>
                        <div className={classes.tableContainer}>
                            <Table className={clsx(tableClasses.root, classes.table)} size="medium">
                                <TableHead className={tableClasses.tableHeader}>
                                    <TableRow className={tableClasses.tableHeaderRow}>
                                        {/* filter out hidden columns first and then go through each column to create Header Cell */}
                                        {Object.keys(props.fieldsSettings.fields).filter((fieldName: string) => {
                                            return !props.fieldsSettings.fields[fieldName]?.hidden;
                                        }).map((fieldName: string) => {
                                            const field = props.fieldsSettings.fields[fieldName];
                                            if (field && !field.hidden) {
                                                return createHeaderColumn(props.fieldsSettings, fieldName, field,
                                                    `${tableClasses.tableCol} ${classes.tableCol} ${fieldName}-col`,
                                                );
                                            }
                                            return <></>;
                                        })}
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {props.listData.map((dataItem: KVPairsTableDataItem): JSX.Element => {
                                        return (
                                            <TableRow
                                                className={clsx(tableClasses.tableBodyRow, 'clickable', dataItem.selected && 'selected')}
                                                key={dataItem.actualValue.key}
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

                                                    if (fieldName === 'value' && props.fieldsSettings.fields.value
                                                        && !props.fieldsSettings.fields.value.hidden) {
                                                        return (
                                                            <TableCell
                                                                key={fieldName}
                                                                className={clsx(tableClasses.tableCol, classes.tableCol, `${fieldName}-col`)}
                                                            >
                                                                <div className="value">
                                                                    {dataItem.displayValue.value}
                                                                </div>
                                                            </TableCell>
                                                        );
                                                    }

                                                    if (fieldName === 'remove' && props.fieldsSettings.fields.remove
                                                        && !props.fieldsSettings.fields.remove.hidden) {
                                                        return (
                                                            // NOTE: dataItem.canBeRemoved must be true
                                                            createRemoveItemCell(
                                                                dataItem, clsx(tableClasses.tableCol, classes.tableCol, `${fieldName}-col`),
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

                {!props.listData && (
                    <Box padding={2}>
                        <CircularProgress />
                    </Box>
                )}
            </div>
        </Paper>
    );
};
