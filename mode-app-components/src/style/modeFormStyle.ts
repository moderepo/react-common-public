import {
    makeStyles, Theme,
} from '@material-ui/core';

/**
 * Style for generic form.
 */
export const useModeFormStyle = makeStyles((theme: Theme) => {
    return {
        root: {
            height        : '100%',
            display       : 'flex',
            flexDirection : 'column',
            alignItems    : 'center',
            justifyContent: 'space-between',

            '&.single-column': {
                '& $formInputGroup': {
                    gridTemplateColumns: '1fr',
                    columnGap          : theme.spacing(0),
                    rowGap             : 0,
                },
            },
        },

        formInputGroup: {
            width    : '100%',
            display  : 'grid',
            columnGap: theme.spacing(1),
            rowGap   : 0,

            [theme.breakpoints.up('sm')]: {
                columnGap: theme.spacing(2),
            },
                
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(400px, 100%), 1fr))',

            '&.medium': {
                gridTemplateColumns: 'repeat(auto-fit, minmax(min(300px, 100%), 1fr))',
            },

            '&.small': {
                gridTemplateColumns: 'repeat(auto-fit, minmax(min(200px, 100%), 1fr))',
            },

            '&.x-small': {
                gridTemplateColumns: 'repeat(auto-fit, minmax(min(150px, 100%), 1fr))',
            },

            '&.xx-small': {
                gridTemplateColumns: 'repeat(auto-fit, minmax(min(100px, 100%), 1fr))',
            },
        },

        formInputSection: {
            width: '100%',

            '&.collapsible': {

                '&.collapsed': {
                    marginBottom                : theme.spacing(1.5),
                    [theme.breakpoints.up('md')]: {
                        marginBottom: theme.spacing(2),
                    },
                    '& $formInputSectionContent': {
                        display: 'none',
                    },

                    '& $formInputSectionTitle': {
                        padding         : theme.spacing(0.5, 1),
                        borderBottom    : 'none',
                        '& .toggle-icon': {
                            transform: 'rotateZ(180deg)',
                        },
                    },
                },
            },

            '&.error': {
                '& $formInputSectionTitle': {
                    backgroundColor: theme.palette.error.main,
                    color          : theme.palette.error.contrastText,
                },
            },
        },

        formInputSectionTitle: {
            fontSize     : 'larger',
            fontWeight   : 500,
            padding      : theme.spacing(1, 0),
            borderBottom : `2px solid ${theme.palette.divider}`,
            borderRadius : 0,
            textAlign    : 'left',
            width        : '100%',
            textTransform: 'none',

            display         : 'flex',
            alignItems      : 'center',
            '& .header-icon': {
                height                      : '1.3em',
                fontSize                    : '1.3em',
                marginRight                 : theme.spacing(1),
                display                     : 'flex',
                alignItems                  : 'center',
                justifyContent              : 'center',
                [theme.breakpoints.up('sm')]: {
                    height  : '1.5em',
                    fontSize: '1.5em',
                },
                '&.wrapper': {
                    '& > *': {
                        height  : '1em',
                        fontSize: '1em',
                    },
                },
            },
            '& .toggle-icon': {
                transition: 'all 1000ms',
            },
            '& .text': {
                flex: 1,
            },
        },

        formInputSectionContent: {
            margin                      : theme.spacing(1, 0, 1, 0),
            [theme.breakpoints.up('sm')]: {
                margin: theme.spacing(2, 0, 2, 2),
            },
        },

        formInputField: {
            textAlign   : 'left',
            marginBottom: theme.spacing(1.5),

            /* HACK - to get this style applied AFTER material ui component style */
            '&&': {
                width: '100%',

                '& .multiline': {
                    '& textarea': {
                        maxHeight: 400,
                        overflow : 'auto !important',
                    },
                },

                '&.readonly': {
                    '& .input-wrapper': {
                        pointerEvents: 'none',
                    },
                },

                '&.clickable': {
                    cursor   : 'pointer',
                    '&:hover': {
                        background: theme.palette.action.hover,
                    },
                },

                '&.fade': {
                    opacity: 0.4,
                    filter : 'blur(2px)',
                },

                '&.hidden': {
                    display: 'none',
                },

                [theme.breakpoints.up('sm')]: {
                    marginBottom: theme.spacing(2),
                },
            },

            '& .editable-label-icon': {
                '&::after': {
                    content   : '"edit"',
                    fontFamily: '"Material Icons"',
                    marginLeft: theme.spacing(0.5),
                    color     : theme.palette.success.main,
                },
            },

            '& .checkbox-label': {
                fontSize: '90%',
            },

            '& .multiline': {
                '&.standard': {
                    padding     : theme.spacing(1),
                    outline     : 'none',
                    whiteSpace  : 'pre',
                    marginTop   : theme.spacing(2.5),
                    borderRadius: theme.shape.borderRadius,
                    border      : `1px solid ${theme.palette.divider}`,
                    color       : theme.palette.text.primary,
                    background  : 'none',
                },
                '& .textarea': {
                    resize    : 'vertical',
                    fontFamily: 'monospace',
                },
            },
        },

        formError: {
            textAlign: 'center',
            color    : theme.palette.error.main,
            padding  : theme.spacing(1, 0),
        },

        formActionContainer: {
            width         : '100%',
            display       : 'flex',
            flexDirection : 'row',
            alignItems    : 'center',
            justifyContent: 'space-between',
            paddingTop    : theme.spacing(2),
        },

        formActionButton: {
            marginLeft                  : theme.spacing(1),
            [theme.breakpoints.up('sm')]: {
                marginLeft: theme.spacing(2),
            },
        },
    };
}, {
    name: 'ModeForm',
});
