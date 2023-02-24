import React from 'react';
import {
    Paper, Table, TableRow, TableCell, TableHead, TableBody, makeStyles, Theme,
} from '@material-ui/core';
import clsx from 'clsx';
import {
    Home,
} from '@moderepo/mode-apis';
import {
    BaseListCompFieldsSet, BaseListCompField, BaseListCompFieldsSettings, createHeaderColumn, useModeTableStyle, useModePanelStyle,
    BaseHomesListProps, BaseListCompDataItem,
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
            '&.name-col': {
                textAlign: 'left',
                width    : '100%',
            },
            '&.creationTime-col': {
                textAlign: 'left',
            },
            '&.deactivated-col': {
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

                '&.active': {
                    '& .value': {
                        background: theme.palette.success.main,
                        color     : theme.palette.success.contrastText,
                    },
                },
                '&.deactivated': {
                    '& .value': {
                        background: theme.palette.error.main,
                        color     : theme.palette.error.contrastText,
                    },
                },
            },
        },

        addHomeButton: {
            backgroundColor: theme.palette.success.main,
            color          : theme.palette.success.contrastText,
            '&:hover'      : {
                backgroundColor: theme.palette.success.light,
            },
        },

    };
}, {
    name: 'HomesTable', index: 1,
});


/**
 * This is the data structure for the row data to be displayed in the table. The value for all these fields will be strings because
 * they will be displayed in the table. These values MUST be localized/formatted/processed by the container. The table is a dumb
 * component and does not know what these values mean so it will only display these values and nothing else.
 * For each column this table has, there should be a field in this data structure corresponding to that column.
 */
export interface DisplayableHomesTableDataItem {
    readonly id?: string;
    readonly name?: string;
    readonly deactivated?: string;
    readonly creationTime?: string;
}


/**
 * Each row of table data will have 2 data, the display data (all strings) used for displaying in the table cell. The actual data used for adding
 * special UI for the data. Actual data is not used often but we will need it in some cases. For example, sometime the data contain some status
 * such as connected/disconnected, verified/not verified, etc... For these cases, we don't just want to show plain text but we also want to add
 * some color to highlight these statuses. For example, we want to show green background for connected or verified status and red background for
 * disconnected or not verified statuses. Therefore, this is the reason we need both displayed data and actual data for all table data.
 */
export interface HomesTableDataItem extends BaseListCompDataItem<Home> {
    readonly displayValue: DisplayableHomesTableDataItem;
}


/**
 * Table columns setting for Homes table. Homes table columns settings MUST contain these column keys
 */
interface HomesTableFieldsSet extends BaseListCompFieldsSet {
    readonly id?: BaseListCompField;
    readonly name?: BaseListCompField;
    readonly deactivated?: BaseListCompField;
    readonly creationTime?: BaseListCompField;
}


export interface HomesTableProps extends BaseHomesListProps {
    readonly listData: readonly HomesTableDataItem[] | undefined;
    readonly fieldsSettings: BaseListCompFieldsSettings<HomesTableFieldsSet>;
}


/**
 * This is an implementation of HomesList component that display list of homes in table form.
 */
export const HomesTable: React.FC<HomesTableProps> = (props: HomesTableProps) => {

    const tableClasses = useModeTableStyle();
    const panelClasses = useModePanelStyle();
    const classes = useStyle();


    return (
        <Paper elevation={2} className={clsx(panelClasses.root, props.className, props.showCustomActionOnHover && 'show-custom-action-on-hover')}>

            <CompPanelHeader {...props} />

            <div className={clsx(panelClasses.panelContent, classes.panelContent)}>

                {/* If we have listData AND it has 1 or more items then show the list of items */}
                {props.listData && props.listData.length > 0 && (
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
                                {props.listData.map((dataItem: HomesTableDataItem): JSX.Element => {
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

                                                if (fieldName === 'deactivated' && props.fieldsSettings.fields.deactivated
                                                && !props.fieldsSettings.fields.deactivated.hidden) {
                                                    return (
                                                        <TableCell
                                                            key={fieldName}
                                                            className={clsx(tableClasses.tableCol, classes.tableCol, `${fieldName}-col`,
                                                                dataItem.actualValue.deactivated ? 'deactivated' : 'active')}
                                                        >
                                                            <div className="value">
                                                                {dataItem.displayValue.deactivated}
                                                            </div>
                                                        </TableCell>
                                                    );
                                                }

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
                )}

                {/* If we have listData but it is an empty array then show Empty Message */}
                {props.listData && props.listData.length === 0 && props.emptyDataMessageComp}

                {/* If we have listData, doesn't matter if it is empty, show pagination */}
                {props.listData && props.paginationComp}

                {/* If we DON'T have listData, it is undefined, then it means it is not loaded therefore show No Data message  */}
                {!props.listData && props.noDataMessageComp}
            </div>
        </Paper>
    );
};
