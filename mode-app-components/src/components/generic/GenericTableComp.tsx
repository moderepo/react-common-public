import React from 'react';
import {
    Paper, Table, TableRow, TableCell, TableHead, TableBody, makeStyles, Theme,
} from '@material-ui/core';
import clsx from 'clsx';
import {
    BaseListCompDataItem, BaseListCompField, BaseListCompFieldsSet, BaseListCompFieldsSettings, BaseListCompProps, BLANK_IMAGE, CompPanelHeader,
    createHeaderColumn, createPreviewItemCell, createRemoveItemCell, useModePanelStyle, useModeTableStyle,
} from '../..';


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
            textAlign: 'left',

            '&.image-col': {
                textAlign : 'center',
                '& .image': {
                    width    : 100,
                    height   : 75,
                    objectFit: 'cover',
                    boxShadow: theme.shadows[2],
                },
            },

            '&.text-align-center': {
                textAlign: 'center',
            },

            '&.text-align-left': {
                textAlign: 'left',
            },
            
            '&.text-align-right': {
                textAlign: 'right',
            },
        },
    };
}, {
    name: 'GenericTableComp', index: 1,
});


// GenericTableListCompField settings is just a BaseListCompField with an additional attribute "valueType" which can be used for customizing
// style for each field.
export interface GenericTableListCompField extends BaseListCompField {
    readonly valueType?: 'string' | 'image' | undefined;
    readonly textAlign?: 'left' | 'right' | 'center' | undefined;
}


export interface GenericTableCompFieldsSet extends BaseListCompFieldsSet {
    readonly [fieldName: string]: GenericTableListCompField | undefined;
}


export interface GenericTableCompProps <T> extends BaseListCompProps<T> {
    readonly listData: readonly BaseListCompDataItem<T>[] | undefined;
    readonly fieldsSettings: BaseListCompFieldsSettings<GenericTableCompFieldsSet>;
}


/**
 * This is an implementation of generic table component that can be used for displaying a table of any object
 */
export const GenericTableComp = <T extends unknown>(props: GenericTableCompProps<T>) => {

    const tableClasses = useModeTableStyle();
    const panelClasses = useModePanelStyle();
    const classes = useStyle();


    return (
        <Paper
            elevation={2}
            className={clsx(panelClasses.root, props.className, props.showCustomActionOnHover && 'show-custom-action-on-hover')}
            style={props.style}
        >

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
                                            const isImage = props.fieldsSettings.fields[fieldName]?.valueType === 'image';
                                            const textAlign = props.fieldsSettings.fields[fieldName]?.textAlign;
                                            return createHeaderColumn(
                                                props.fieldsSettings, fieldName, field,
                                                clsx(
                                                    tableClasses.tableCol, classes.tableCol, `${fieldName}-col`,
                                                    isImage && 'image-col', textAlign && `text-align-${textAlign}`,
                                                ),
                                            );
                                        }
                                        return <></>;
                                    })}
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {props.listData.map((dataItem): JSX.Element => {
                                    return (
                                        <TableRow
                                            className={clsx(tableClasses.tableBodyRow, 'clickable', dataItem.selected && 'selected')}
                                            key={JSON.stringify(dataItem.actualValue)}
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
                                                if (props.fieldsSettings.fields[fieldName] && !props.fieldsSettings.fields[fieldName]?.hidden) {
                                                    const isImage = props.fieldsSettings.fields[fieldName]?.valueType === 'image';
                                                    const value = dataItem.displayValue?.[fieldName] ?? dataItem.actualValue[fieldName];
                                                    const textAlign = props.fieldsSettings.fields[fieldName]?.textAlign;
                                                    return (
                                                        <TableCell
                                                            key={fieldName}
                                                            className={clsx(
                                                                tableClasses.tableCol, classes.tableCol, `${fieldName}-col`, isImage && 'image-col',
                                                                textAlign && `text-align-${textAlign}`,
                                                            )}
                                                        >
                                                            {isImage ? (
                                                                <>
                                                                    {value && (
                                                                        <img
                                                                            className="image"
                                                                            alt={value.toString()}
                                                                            src={value}
                                                                        />
                                                                    )}
                                                                </>
                                                            ) : (
                                                                value?.toString()
                                                            )}
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
