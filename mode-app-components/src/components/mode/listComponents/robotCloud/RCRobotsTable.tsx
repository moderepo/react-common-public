import React, {
    useMemo,
} from 'react';
import {
    Paper, Table, TableRow, TableCell, TableHead, Icon, TableBody, makeStyles, Button, Menu, MenuItem, Hidden, IconButton, Theme,
}
    from '@material-ui/core';
import clsx from 'clsx';
import {
    RobotHealthCondition, RobotInfo,
} from '@moderepo/mode-apis';
import {
    BaseListCompFieldsSet, BaseListCompField, BaseListCompFieldsSettings, createHeaderColumn, SelectInputOption, useModeTableStyle,
    useModePanelStyle, useDropdown, BaseListCompDataItem, RCBaseRobotsListProps,
} from '../../../..';
import {
    createPreviewItemCell,
    createRemoveItemCell,
} from '../../../componentUtils';
import {
    CompPanelHeader,
} from '../../compPanelHeader';



const useStyle = makeStyles((theme: Theme) => {
    return {

        panelContent: {
            padding      : 0,
            height       : '100%',
            display      : 'flex',
            flexDirection: 'column',
        },

        filter: {
            '&:not(:last-child)': {
                marginRight: theme.spacing(2),
            },

            '& .label': {
                display          : 'flex',
                textTransform    : 'none',
                flexDirection    : 'column',
                alignItems       : 'flex-start',
                '& .filter-label': {
                    fontWeight: 'normal',
                    fontSize  : 'smaller',
                    color     : theme.palette.text.secondary,
                    lineHeight: '1em',
                },

                '& .filter-value': {
                    color: theme.palette.text.primary,
                },
            },
        },

        tableContainer: {
            overflow: 'auto',
            flex    : 1,
        },

        tableCol: {
            '&.id-col': {
                textAlign: 'center',
            },
            '&.deviceId-col': {
                textAlign: 'center',
            },
            '&.homeId-col': {
                textAlign: 'center',
            },
            '&.name-col': {
                textAlign : 'left',
                width     : '100%',
                whiteSpace: 'normal',
            },
            '&.robotClass-col': {
                textAlign: 'left',
            },
            '&.overrideRobotDefinition-col': {
                textAlign: 'left',
                width    : '100%',
            },
            '&.createdAt-col': {
                textAlign: 'left',
            },
            '&.updatedAt-col': {
                textAlign: 'left',
            },
            '&.availability-col': {
                textAlign    : 'center',
                '&.available': {
                    '& .value': {
                        color: theme.palette.success.main,
                    },
                },
                '&.not-available': {
                    '& .value': {
                        color: theme.palette.error.main,
                    },
                },
            },
            '&.status-col': {
                textAlign: 'center',

                '& .value': {
                    fontSize     : 'smaller',
                    fontWeight   : 500,
                    padding      : theme.spacing(0.3, 1),
                    textTransform: 'lowercase',
                    background   : theme.palette.info.main,
                    color        : theme.palette.info.contrastText,
                    minWidth     : '5em',
                    maxWidth     : '10em',
                    width        : '100%',
                    display      : 'inline-block',
                    borderRadius : 20,
                },

                // unknown
                '&.status--1': {
                    '& .value': {
                        background: '#bbbbbb',
                    },
                },

                // normal
                '&.status-0': {
                    '& .value': {
                        background: theme.palette.success.main,
                        color     : theme.palette.success.contrastText,
                    },
                },

                // minor
                '&.status-1000': {
                    '& .value': {
                        background: theme.palette.info.main,
                        color     : theme.palette.info.contrastText,
                    },
                },

                // warning
                '&.status-6000': {
                    '& .value': {
                        background: theme.palette.warning.main,
                        color     : theme.palette.warning.contrastText,
                    },
                },

                // critical
                '&.status-11000': {
                    '& .value': {
                        background: theme.palette.error.main,
                        color     : theme.palette.error.contrastText,
                    },
                },
            },
        },

        linkRobotButton: {
            marginLeft: theme.spacing(1),
        },

        addRobotButton: {
            marginLeft: theme.spacing(1),
        },
    };
}, {
    name: 'RobotsTable', index: 1,
});


/**
 * This is the data structure for the row data to be displayed in the table. The value for all these fields will be strings because
 * they will be displayed in the table. These values MUST be localized/formatted/processed by the container. The table is a dumb
 * component and does not know what these values mean so it will only display these values and nothing else.
 * For each column this table has, there should be a field in this data structure corresponding to that column.
 */
export interface DisplayableRobotsTableDataItem {
    readonly id?: string;
    readonly deviceId?: string;
    readonly homeId?: string;
    readonly robotClass?: string;
    readonly name?: string;
    readonly overrideRobotDefinition?: string;
    readonly available?: boolean;
    readonly status?: string;
    readonly createdAt?: string;
    readonly updatedAt?: string;
}


/**
 * Each row of table data will have 2 data, the display data (all strings) used for displaying in the table cell. The actual data used for adding
 * special UI for the data. Actual data is not used often but we will need it in some cases. For example, sometime the data contain some status
 * such as connected/disconnected, verified/not verified, etc... For these cases, we don't just want to show plain text but we also want to add
 * some color to highlight these statuses. For example, we want to show green background for connected or verified status and red background for
 * disconnected or not verified statuses. Therefore, this is the reason we need both displayed data and actual data for all table data.
 */
export interface RCRobotsTableDataItem extends BaseListCompDataItem<RobotInfo> {
    readonly displayValue: DisplayableRobotsTableDataItem;
    readonly status?: RobotHealthCondition | undefined;
}


/**
 * Table columns setting for Robots table. Robots table columns settings MUST contain these column keys
 */
interface RCRobotsTableFieldsSet extends BaseListCompFieldsSet {
    readonly id?: BaseListCompField;
    readonly deviceId?: BaseListCompField;
    readonly homeId?: BaseListCompField;
    readonly robotClass?: BaseListCompField;
    readonly name?: BaseListCompField;
    readonly overrideRobotDefinition?: BaseListCompField;
    readonly availability?: BaseListCompField;
    readonly status?: BaseListCompField;
    readonly createdAt?: BaseListCompField;
    readonly updatedAt?: BaseListCompField;
}


export interface RCRobotsTableProps extends RCBaseRobotsListProps {
    readonly listData: readonly RCRobotsTableDataItem[] | undefined;
    readonly fieldsSettings: BaseListCompFieldsSettings<RCRobotsTableFieldsSet>;

    readonly canLinkRobots?: boolean;
    readonly canCreateRobots?: boolean;

    // texts used for Create and Link robot options. If canLinkRobots/canCreateRobots is true, need to provide texts
    readonly texts?: {
        readonly linkButtonLabel: string;
        readonly addButtonLabel: string;
        readonly linkExistingRobotsButtonLabel: string;
        readonly createNewRobotButtonLabel: string;
    };

    readonly filters?: {
        readonly robotClass?: {
            readonly currentValue: string | undefined;
            readonly label: string;
            readonly options: readonly SelectInputOption<string | ''>[];
            readonly onChange: (value: string | '')=> void;
        } | undefined;
    } | undefined;

    readonly onLinkRobotClicked?: ()=> void;
    readonly onCreateNewRobotClicked?: ()=> void;
}



/**
 * This is an implementation of RCBaseRobotsListComp which display robots in tabular form.
 */
export const RCRobotsTable: React.FC<RCRobotsTableProps> = (props: RCRobotsTableProps) => {
    const tableClasses = useModeTableStyle();
    const panelClasses = useModePanelStyle();
    const classes = useStyle();
    const [menuAnchorEl, isMenuOpened, onMenuAnchorElClicked, onMenuClosed] = useDropdown();
    const [robotClassFilterMenuAnchorEl, isRobotClassFilterMenuOpened,
        onRobotClassFilterAnchorElClicked, onRobotClassFilterMenuClosed] = useDropdown();


    /**
     * Get the label of the currently selected option so we can display the selected value in the dropdown
     */
    const currentRobotClassLabel = useMemo(() => {
        if (props.filters?.robotClass) {
            const selectedOption = props.filters.robotClass.options.find((option: SelectInputOption<string | ''>) => {
                return option.value === (props.filters?.robotClass?.currentValue || '');
            });
            return selectedOption?.label || '';
        }
        return '';
    }, [props.filters]);


    return (
        <Paper elevation={2} className={clsx(panelClasses.root, props.className, props.showCustomActionOnHover && 'show-custom-action-on-hover')}>
            <CompPanelHeader
                {...props}
                customContent={(
                    <>

                        {props.filters?.robotClass && (
                            <>
                                <Hidden xsDown>
                                    <Button
                                        className={classes.filter}
                                        onClick={onRobotClassFilterAnchorElClicked}
                                        endIcon={<Icon>arrow_drop_down</Icon>}
                                    >
                                        <div className="label">
                                            <div className="filter-label">
                                                {props.filters.robotClass.label}
                                            </div>
                                            <div className="filter-value">
                                                {currentRobotClassLabel}
                                            </div>
                                        </div>
                                    </Button>
                                </Hidden>
                                <Hidden smUp>
                                    <IconButton
                                        className={classes.filter}
                                        onClick={onRobotClassFilterAnchorElClicked}
                                    >
                                        <Icon>filter_list</Icon>
                                    </IconButton>
                                </Hidden>

                                <Menu
                                    getContentAnchorEl={null}
                                    anchorEl={robotClassFilterMenuAnchorEl}
                                    anchorOrigin={{
                                        vertical  : 'bottom',
                                        horizontal: 'right',
                                    }}
                                    transformOrigin={{
                                        vertical  : 'top',
                                        horizontal: 'right',
                                    }}
                                    keepMounted
                                    open={isRobotClassFilterMenuOpened}
                                    onClose={onRobotClassFilterMenuClosed}
                                >
                                    {props.filters.robotClass.options.map((option: SelectInputOption<string | ''>) => {
                                        return (
                                            <MenuItem
                                                key={option.label}
                                                selected={option.value === props.filters?.robotClass?.currentValue}
                                                onClick={() => {
                                                    onRobotClassFilterMenuClosed();
                                                    if (props.filters?.robotClass?.onChange) {
                                                        props.filters.robotClass.onChange(option.value);
                                                    }
                                                }}
                                            >
                                                {option.label}
                                            </MenuItem>
                                        );
                                    })}
                                </Menu>
                            </>
                        )}

                        {/** If the Agent can link Robots and create robot, show drop down menu with both choices */}
                        {props.canLinkRobots && props.canCreateRobots && props.texts && (
                            <>
                                <Button
                                    className={classes.addRobotButton}
                                    size="small"
                                    variant="contained"
                                    color="primary"
                                    startIcon={<Icon fontSize="small">add</Icon>}
                                    onClick={(event: React.MouseEvent<HTMLElement>) => {
                                        onMenuAnchorElClicked(event);
                                    }}
                                >
                                    {props.texts.addButtonLabel}
                                </Button>
                                <Menu
                                    getContentAnchorEl={null}
                                    anchorEl={menuAnchorEl}
                                    anchorOrigin={{
                                        vertical  : 'bottom',
                                        horizontal: 'right',
                                    }}
                                    transformOrigin={{
                                        vertical  : 'top',
                                        horizontal: 'right',
                                    }}
                                    keepMounted
                                    open={isMenuOpened}
                                    onClose={() => {
                                        onMenuClosed();
                                    }}
                                >
                                    <MenuItem
                                        onClick={(event: React.MouseEvent) => {
                                            event.preventDefault();
                                            event.stopPropagation();
                                            onMenuClosed();
                                            if (props.onLinkRobotClicked) {
                                                props.onLinkRobotClicked();
                                            }
                                        }}
                                    >
                                        {props.texts.linkExistingRobotsButtonLabel}
                                    </MenuItem>
                                    <MenuItem
                                        onClick={(event: React.MouseEvent) => {
                                            event.preventDefault();
                                            event.stopPropagation();
                                            onMenuClosed();
                                            if (props.onCreateNewRobotClicked) {
                                                props.onCreateNewRobotClicked();
                                            }
                                        }}
                                    >
                                        {props.texts.createNewRobotButtonLabel}
                                    </MenuItem>
                                </Menu>
                            </>
                        )}
                        {/** If the Agent can only link Robots but not Create robot, show 'Link' button */}
                        {props.canLinkRobots && !props.canCreateRobots && props.texts && (
                            <Button
                                className={classes.linkRobotButton}
                                size="small"
                                color="primary"
                                variant="contained"
                                startIcon={<Icon fontSize="small">link</Icon>}
                                onClick={() => {
                                    if (props.onLinkRobotClicked) {
                                        props.onLinkRobotClicked();
                                    }
                                }}
                            >
                                {props.texts.linkButtonLabel}
                            </Button>
                        )}
                        {/** If the Agent can only Create robot but not link robots, show 'Add' button */}
                        {props.canCreateRobots && !props.canLinkRobots && props.texts && (
                            <Button
                                className={classes.addRobotButton}
                                size="small"
                                color="primary"
                                variant="contained"
                                startIcon={<Icon fontSize="small">add</Icon>}
                                onClick={() => {
                                    if (props.onCreateNewRobotClicked) {
                                        props.onCreateNewRobotClicked();
                                    }
                                }}
                            >
                                {props.texts.addButtonLabel}
                            </Button>
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
                                                return createHeaderColumn(props.fieldsSettings, fieldName, field,
                                                    `${tableClasses.tableCol} ${classes.tableCol} ${fieldName}-col`,
                                                );
                                            }
                                            return <></>;
                                        })}
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {props.listData.map((dataItem: RCRobotsTableDataItem): JSX.Element => {
                                        return (
                                            <TableRow
                                                className={clsx(
                                                    tableClasses.tableBodyRow, 'clickable', dataItem.selected && 'selected',
                                                )}
                                                key={`${dataItem.actualValue.homeId}-${dataItem.actualValue.id}`}
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
                                                                className={clsx(
                                                                    tableClasses.tableCol, classes.tableCol,
                                                                    'status-col', `status-${dataItem.status}`,
                                                                )}
                                                            >
                                                                <div className="value">
                                                                    {dataItem.displayValue.status}
                                                                </div>
                                                            </TableCell>
                                                        );
                                                    }

                                                    if (fieldName === 'availability' && props.fieldsSettings.fields.availability
                                                        && !props.fieldsSettings.fields.availability.hidden) {
                                                        return (
                                                            <TableCell
                                                                key={fieldName}
                                                                className={clsx(tableClasses.tableCol, classes.tableCol, `${fieldName}-col`,
                                                                    dataItem.displayValue.available && 'available',
                                                                    !dataItem.displayValue.available && 'not-available')}
                                                            >
                                                                <div className="value">
                                                                    {dataItem.displayValue.available
                                                                        ? <Icon className="not-available">check</Icon>
                                                                        : <Icon className="available">not_interested</Icon>}
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

                            {props.listData && props.listData.length === 0 && props.emptyDataMessageComp}
                        </div>

                        {props.paginationComp}
                    </>
                )}

                {!props.listData && props.noDataMessageComp}
            </div>
        </Paper>
    );
};
