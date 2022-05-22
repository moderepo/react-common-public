import {
    makeStyles, Theme,
} from '@material-ui/core';


/**
 * Style for generic Table.
 */
export const useModeTableStyle = makeStyles((theme: Theme) => {
    return {

        root: {
        },

        tableHeader: {
        },

        tableHeaderRow: {
            background      : '#fafafa',
            '& .sort-button': {
                textTransform : 'none',
                padding       : 0,
                justifyContent: 'flex-start',
                minWidth      : 'unset',
            },
        },

        tableBodyRow: {
            borderTop: '1px solid rgba(224, 224, 224, 1)',
            '&:hover': {
                background                  : theme.palette.action.hover,
                [theme.breakpoints.up('md')]: {
                    '& $tableCol': {
                        '&.remove-col': {
                            '& button': {
                                opacity: 1,
                            },
                        },
                        '&.preview-col': {
                            '& button': {
                                opacity: 1,
                            },
                        },
                    },
                },
            },
            '&.clickable': {
                cursor: 'pointer',
            },
            '&.selected': {
                background: theme.palette.action.selected,
            },
        },

        tableCol: {
            verticalAlign: 'middle',
            whiteSpace   : 'nowrap',
            borderBottom : 'none',
            padding      : theme.spacing(1, 1),

            '&.remove-col': {
                paddingTop     : 0,
                paddingBottom  : 0,
                '&:first-child': {
                    paddingRight: 0,
                },
                '&:last-child': {
                    paddingLeft: 0,
                },
            },
            '&.preview-col': {
                paddingTop     : 0,
                paddingBottom  : 0,
                '&:first-child': {
                    paddingRight: 0,
                },
                '&:last-child': {
                    paddingLeft: 0,
                },
            },
            [theme.breakpoints.up('sm')]: {
                padding       : theme.spacing(1, 2),
                '&.remove-col': {
                    width     : 50,
                    '& button': {
                        opacity: 0.2,
                    },
                },
                '&.preview-col': {
                    width     : 50,
                    '& button': {
                        opacity: 0.2,
                    },
                },
            },
        },

    };
}, {
    name: 'ModeTable',
});
