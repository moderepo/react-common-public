import React from 'react';
import {
    Paper, Table, TableRow, TableCell, TableHead, TableBody, makeStyles, CircularProgress, Box, Theme,
} from '@material-ui/core';
import clsx from 'clsx';
import {
    HomeMember,
} from '@moderepo/mode-apis';
import {
    createHeaderColumn, BaseListCompField, BaseListCompFieldsSet, BaseListCompFieldsSettings, useModePanelStyle, useModeTableStyle,
    BaseHomeMembersListProps, BaseListCompDataItem,
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
            overflow: 'auto',
            flex    : 1,
        },

        tableCol: {
            '&.id-col': {
                textAlign: 'center',
            },
            '&.name-col': {
                textAlign: 'left',
                width    : '100%',
            },
            '&.email-col': {
                textAlign: 'left',
            },
            '&.phoneNumber-col': {
                textAlign: 'left',
            },
            '&.role-col': {
                textAlign : 'center',
                '& .value': {
                    textTransform: 'uppercase',
                },
            },
            '&.creationTime-col': {
                textAlign: 'left',
            },
            '&.verified-col': {
                textAlign: 'center',

                '& .value': {
                    display     : 'inline-block',
                    padding     : '2px 10px',
                    fontWeight  : 500,
                    fontSize    : 'smaller',
                    borderRadius: 50,
                    minWidth    : '5em',
                },
                '&.verified': {
                    '& .value': {
                        color     : theme.palette.success.contrastText,
                        background: theme.palette.success.main,
                    },
                },

                '&.not-verified': {
                    '& .value': {
                        color     : theme.palette.error.contrastText,
                        background: theme.palette.error.main,
                    },
                },
            },
        },

        addMemberButton: {
            backgroundColor: theme.palette.success.main,
            color          : theme.palette.success.contrastText,
            '&:hover'      : {
                backgroundColor: theme.palette.success.light,
            },
        },
    };
}, {
    name: 'HomeMembersTable', index: 1,
});


/**
 * This is the data structure for the row data to be displayed in the table. The value for all these fields will be strings because
 * they will be displayed in the table. These values MUST be localized/formatted/processed by the container. The table is a dumb
 * component and does not know what these values mean so it will only display these values and nothing else.
 * For each column this table has, there should be a field in this data structure corresponding to that column.
 */
export interface DisplayableHomeMembersTableDataItem {
    readonly id?: string;
    readonly name?: string;
    readonly email?: string;
    readonly phoneNumber?: string;
    readonly role?: string;
    readonly verified?: string;
    readonly creationTime?: string;
}

/**
 * Each row of table data will have 2 data, the display data (all strings) used for displaying in the table cell. The actual data used for adding
 * special UI for the data. Actual data is not used often but we will need it in some cases. For example, sometime the data contain some status
 * such as connected/disconnected, verified/not verified, etc... For these cases, we don't just want to show plain text but we also want to add
 * some color to highlight these statuses. For example, we want to show green background for connected or verified status and red background for
 * disconnected or not verified statuses. Therefore, this is the reason we need both displayed data and actual data for all table data.
 */
export interface HomeMembersTableData extends BaseListCompDataItem<HomeMember> {
    readonly displayValue: DisplayableHomeMembersTableDataItem;
}


/**
 * Table columns setting for Members table. Members table columns settings MUST contain these column keys
 */
export interface HomeMembersTableFieldsSet extends BaseListCompFieldsSet {
    readonly id?: BaseListCompField;
    readonly name?: BaseListCompField;
    readonly email?: BaseListCompField;
    readonly phoneNumber?: BaseListCompField;
    readonly role?: BaseListCompField;
    readonly verified?: BaseListCompField;
    readonly creationTime?: BaseListCompField;
}


export interface HomeMembersTableProps extends BaseHomeMembersListProps {
    readonly listData: readonly HomeMembersTableData[] | undefined;
    readonly fieldsSettings: BaseListCompFieldsSettings<HomeMembersTableFieldsSet>;
}



/**
 * This is a DUMB component that is in charge of displaying the list of home members with pagination. All this component does is display data
 * provided through props. This component does not have any logic and any user action will be dispatched to the container's handlers.
 */
export const HomeMembersTable = (props: HomeMembersTableProps) => {

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
                                    {props.listData.map((dataItem: HomeMembersTableData): JSX.Element => {
                                        return (
                                            <TableRow
                                                className={clsx(tableClasses.tableBodyRow, 'clickable', dataItem.selected && 'selected')}
                                                key={dataItem.actualValue.userId}
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

                                                    if (fieldName === 'verified' && props.fieldsSettings.fields.verified
                                                            && !props.fieldsSettings.fields.verified.hidden) {
                                                        return (
                                                            <TableCell
                                                                key={fieldName}
                                                                className={clsx(tableClasses.tableCol, classes.tableCol,
                                                                    `${fieldName}-col`,
                                                                    dataItem.actualValue.verified ? 'verified' : 'not-verified')}
                                                            >
                                                                <div className="value">
                                                                    {dataItem.displayValue.verified}
                                                                </div>
                                                            </TableCell>
                                                        );
                                                    }

                                                    if (fieldName === 'role' && props.fieldsSettings.fields.role
                                                        && !props.fieldsSettings.fields.role.hidden) {
                                                        return (
                                                            <TableCell
                                                                key={fieldName}
                                                                className={clsx(tableClasses.tableCol, classes.tableCol, `${fieldName}-col`)}
                                                            >
                                                                <div className="value">
                                                                    {dataItem.displayValue.role}
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
