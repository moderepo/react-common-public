import React from 'react';
import {
    Paper, Table, TableRow, TableCell, TableHead, TableBody, makeStyles, CircularProgress, Box, Theme,
} from '@material-ui/core';
import clsx from 'clsx';
import {
    HomeDevice,
} from '@moderepo/mode-apis';
import {
    BaseListCompFieldsSet, BaseListCompField, BaseListCompFieldsSettings, createHeaderColumn, useModeTableStyle, useModePanelStyle,
    BaseHomeDevicesListProps, BaseListCompDataItem,
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

        panelHeaderIcon: {
        },

        panelContent: {
            padding      : 0,
            height       : '100%',
            display      : 'flex',
            flexDirection: 'column',
        },

        tableContainer: {
            overflow: 'auto',
            flex    : 1,
        },

        tableCol: {
            '&.id-col': {
                textAlign: 'center',
            },
            '&.deviceClass-col': {
                textAlign: 'left',
            },
            '&.tag-col': {
                textAlign: 'left',
                width    : '50%',
            },
            '&.name-col': {
                textAlign: 'left',
                width    : '50%',
            },
            '&.status-col': {
                textAlign : 'center',
                '& .value': {
                    fontSize     : 'smaller',
                    fontWeight   : 500,
                    padding      : theme.spacing(0.3, 1),
                    borderRadius : 100,
                    textTransform: 'lowercase',
                    width        : '100%',
                    display      : 'inline-block',
                },

                '&.connected': {
                    '& .value': {
                        background: theme.palette.success.main,
                        color     : theme.palette.success.contrastText,
                    },
                },
                '&.disconnected': {
                    '& .value': {
                        background: theme.palette.error.main,
                        color     : theme.palette.error.contrastText,
                    },
                },
            },
            '&.connectivityDate-col': {
                textAlign: 'left',
            },
            '&.claimTime-col': {
                textAlign: 'left',
            },
        },


        addDeviceButton: {
            backgroundColor: theme.palette.success.main,
            color          : theme.palette.success.contrastText,
            marginLeft     : theme.spacing(1),
            '&:hover'      : {
                backgroundColor: theme.palette.success.light,
            },
        },
    };
}, {
    name: 'HomeDevicesTable', index: 1,
});


/**
 * This is the data structure for the row data to be displayed in the table. The value for all these fields will be strings because
 * they will be displayed in the table. These values MUST be localized/formatted/processed by the container. The table is a dumb
 * component and does not know what these values mean so it will only display these values and nothing else.
 * For each column this table has, there should be a field in this data structure corresponding to that column.
 */
export interface DisplayableHomeDevicesTableDataItem {
    readonly id?: string;
    readonly deviceClass?: string;
    readonly tag?: string;
    readonly name?: string;
    readonly status?: string;
    readonly connectivityDate?: String;
    readonly claimTime?: string;
}

/**
 * Each row of table data will have 2 data, the display data (all strings) used for displaying in the table cell. The actual data used for adding
 * special UI for the data. Actual data is not used often but we will need it in some cases. For example, sometime the data contain some status
 * such as connected/disconnected, verified/not verified, etc... For these cases, we don't just want to show plain text but we also want to add
 * some color to highlight these statuses. For example, we want to show green background for connected or verified status and red background for
 * disconnected or not verified statuses. Therefore, this is the reason we need both displayed data and actual data for all table data.
 */
export interface HomeDevicesTableDataItem extends BaseListCompDataItem<HomeDevice> {
    readonly displayValue: DisplayableHomeDevicesTableDataItem;
}


/**
 * Table columns setting for Devices table. Devices table columns settings MUST contain these column keys
 */
interface HomeDevicesTableFieldsSet extends BaseListCompFieldsSet {
    readonly id?: BaseListCompField;
    readonly deviceClass?: BaseListCompField;
    readonly tag?: BaseListCompField;
    readonly name?: BaseListCompField;
    readonly status?: BaseListCompField;
    readonly connectivityDate?: BaseListCompField;
    readonly claimTime?: BaseListCompField;
}


/**
 * This is an implementation of HomeDevicesList Component which display home devices in table form.
 */
export interface HomeDevicesTableProps extends BaseHomeDevicesListProps {
    readonly listData: readonly HomeDevicesTableDataItem[] | undefined;
    readonly fieldsSettings: BaseListCompFieldsSettings<HomeDevicesTableFieldsSet>;
}


/**
 * This is a DUMB component that is in charge of displaying the list of devices with pagination. All this component does is display data
 * provided through props. This component does not have any logic and any user action will be dispatched to the container's handlers.
 */
export const HomeDevicesTable: React.FC<HomeDevicesTableProps> = (props: HomeDevicesTableProps) => {

    const tableClasses = useModeTableStyle();
    const panelClasses = useModePanelStyle();
    const classes = useStyle();



    return (
        <Paper elevation={2} className={clsx(panelClasses.root, props.className, props.showCustomActionOnHover && 'show-custom-action-on-hover')}>

            <CompPanelHeader {...props} />

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
                                                return createHeaderColumn(props.fieldsSettings, fieldName, field,
                                                    `${tableClasses.tableCol} ${classes.tableCol} ${fieldName}-col`,
                                                );
                                            }
                                            return <></>;
                                        })}
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {props.listData.map((dataItem: HomeDevicesTableDataItem): JSX.Element => {
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

                                                    if (fieldName === 'status' && props.fieldsSettings.fields.status
                                                        && !props.fieldsSettings.fields.status.hidden) {
                                                        return (
                                                            <TableCell
                                                                key={fieldName}
                                                                className={clsx(tableClasses.tableCol, classes.tableCol, `${fieldName}-col`,
                                                                    dataItem.actualValue.isConnected ? 'connected' : 'disconnected')}
                                                            >
                                                                <div className="value">
                                                                    {dataItem.displayValue.status}
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

                        {props.paginationComp}
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
