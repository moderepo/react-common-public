import React, {
    useMemo,
} from 'react';
import {
    MenuItem, Theme, makeStyles, Icon, Menu, ListItemIcon, Button,
} from '@material-ui/core';
import {
    useDropdown,
} from '../../utils/customHooks';
import {
    SelectInputOption,
} from '../..';

const useStyle = makeStyles((theme: Theme) => {
    return {
        menu: {
            minWidth: '8em',
        },

        languageName: {
            fontSize     : '0.875rem',
            textTransform: 'uppercase',
            fontWeight   : 500,

            [theme.breakpoints.down('sm')]: {
                display: 'none',
            },
        },
    };
}, {
    name: 'LanguageSelector',
});


export interface LanguageSelectorProps<T> {
    readonly className?: string;
    readonly minimal?: boolean;     // Whether or not to show the minimal UI. If true, we will not show the language name, only the dropdown arrow.
    readonly options: SelectInputOption<T>[];     // This LanguageSelector will accept ANY type of Language object type
    readonly onChange?: (event: React.MouseEvent, language: T)=> void;
}


/**
 * This is the Language dropdown selector component which can be used any where in the app. To use the component, add this to the
 * template <LanguageSelector />
 * This is a DUMB component. All it does is display the data provided through props. It does not have any logic to change the app's
 * language. The container must handle the onChange event and change the app's language accordingly.
 *
 * This Component is also GENERIC which accept any type of Language object depending on the app that use this component. Each app will have its
 * own Language object structure therefore this Component will not force the container to use a specific Language object type.
 */
export const LanguageSelector: React.FC<LanguageSelectorProps<any>> = <T extends any>(props: LanguageSelectorProps<T>) => {
    const [menuAnchorEl, isMenuOpened, onAnchorElClicked, onMenuClosed] = useDropdown();
    const classes = useStyle();

    // Find the selected option
    const selectedOption = useMemo(() => {
        return props.options.find((langOption: SelectInputOption<T>): boolean => {
            return langOption.selected === true;
        });
    }, [props.options]);


    return (
        <div className={props.className || undefined}>
            <Button
                onClick={onAnchorElClicked}
                color="inherit"
                startIcon={<Icon>translate</Icon>}
                endIcon={<Icon>arrow_drop_down</Icon>}
            >
                {!props.minimal && <span className={classes.languageName}>{selectedOption?.label}</span>}
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
                onClose={onMenuClosed}
            >
                {props.options.map((option: SelectInputOption<T>): JSX.Element => {
                    return (
                        <MenuItem
                            className={classes.menu}
                            key={option.label}
                            onClick={(event: React.MouseEvent) => {
                                onMenuClosed();
                                if (props.onChange) {
                                    props.onChange(event, option.value);
                                }
                            }}
                            selected={option.selected}
                        >
                            <ListItemIcon>
                                <Icon>
                                    {option.selected ? 'check' : ''}
                                </Icon>
                            </ListItemIcon>
                            {option.label}
                        </MenuItem>
                    );
                })}
            </Menu>
        </div>
    );
};
