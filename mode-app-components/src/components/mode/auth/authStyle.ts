import {
    makeStyles, Theme,
} from '@material-ui/core/styles';

export const useAuthStyle = makeStyles((theme: Theme) => {
    return {
        root: {
            width         : '100%',
            height        : '100%',
            position      : 'fixed',
            top           : 0,
            left          : 0,
            display       : 'flex',
            alignItems    : 'center',
            justifyContent: 'center',
        },

        authBox: {
            position       : 'relative',
            backgroundColor: theme.palette.background.paper,
            top            : '0',
            left           : '0',
            border         : 'none',
            borderRadius   : theme.shape.borderRadius,
            width          : '100%',
            height         : '100%',
            maxWidth       : 400,
            maxHeight      : 700,
            overflow       : 'hidden',
            display        : 'flex',
            flexDirection  : 'column',
            boxShadow      : '0px 11px 15px -7px rgba(0,0,0,0.2), 0px 24px 38px 3px rgba(0,0,0,0.14), 0px 9px 46px 8px rgba(0,0,0,0.12)',
            '&.no-form'    : {
                maxHeight: 350,
            },
        },

        headerContainer: {
            position      : 'relative',
            padding       : theme.spacing(1),
            display       : 'flex',
            flexDirection : 'column',
            alignItems    : 'center',
            justifyContent: 'center',
            background    : '#007584',
            flex          : 1,
        },


        header: {
            width         : '100%',
            display       : 'flex',
            flexDirection : 'column',
            alignItems    : 'center',
            justifyContent: 'center',
        },

        headerText: {
            top      : 0,
            left     : 0,
            width    : '100%',
            textAlign: 'center',
            zIndex   : 2,
        },

        headerTitle: {
            fontSize           : '2.125rem',
            fontWeight         : 900,
            color              : '#ffffff',
            '& $headerSubtitle': {
                paddingTop: theme.spacing(1),
            },
        },

        headerSubtitle: {
            fontSize  : '1.25rem',
            fontWeight: 500,
            color     : '#ffffff',
        },

        languageSelector: {
            position: 'absolute',
            top     : 10,
            right   : 10,
            zIndex  : 2,
            color   : '#ffffff',
        },

        formContainer: {
            flex   : 1,
            padding: theme.spacing(1),
        },

        form: {
        },

        formMessage: {
            paddingBottom: theme.spacing(2),
        },

        formActionLink: {
            paddingRight: theme.spacing(1),
        },

        externalLoginContainer: {
            width         : '100%',
            display       : 'flex',
            flexDirection : 'column',
            alignItems    : 'center',
            justifyContent: 'center',
            flex          : 1,
        },

        externalLoginServiceAction: {
            width       : '100%',
            margin      : theme.spacing(1, 0),
            borderRadius: 100,
            padding     : '8px 16px',
            background  : theme.palette.background.paper,
            color       : theme.palette.text.primary,
        },

        externalLoginServiceActionLabel: {
            flex: 1,
        },


        [`${theme.breakpoints.up('sm')}, (orientation: landscape)`]: {
            authBox: {
                flexDirection: 'row',
                maxWidth     : 800,
                height       : '100%',
                maxHeight    : 400,
                '&.no-form'  : {
                    maxWidth: 400,
                },
            },

            headerContainer: {
                padding: theme.spacing(2),
                flex   : 1,
            },

            header: {
                flex         : 1,
                paddingBottom: 0,
            },

            formContainer: {
                padding: theme.spacing(2),
            },

            form: {
            },
        },
    };
});
