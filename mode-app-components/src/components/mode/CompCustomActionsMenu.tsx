import {
    Icon, IconButton, ListItemIcon, Menu, MenuItem,
} from '@material-ui/core';
import React, {
    useState,
} from 'react';

import {
    BaseCompAction, BaseCompSubAction, isBaseCompAction, isBaseCompSubAction,
} from '../../componentInterfaces';
import {
    useModePanelStyle,
} from '../../style';
import {
    useDropdown,
} from '../../utils';
import {
    FontIcon,
} from './FontIcon';

export interface CompCustomActionsMenuProps {
    readonly customActions?: readonly (BaseCompAction | BaseCompSubAction)[] | undefined;
}

/**
 * This is a Generic Header component that can be used for most of the InfoComponent
 */
export const CompCustomActionsMenu: React.FC<CompCustomActionsMenuProps> = (
    props: CompCustomActionsMenuProps,
) => {
    const panelClasses = useModePanelStyle();
    const [customActionsMenuAnchorEl, isCustomActionsMenuOpened, onCustomActionAnchorElClicked, onCustomActionMenuClosed] = useDropdown();

    const [selectedSubMenu, setSelectedSubMenu] = useState<BaseCompSubAction>();
    const [customActionsSubMenuAnchorEl, isCustomActionsSubMenuOpened, onCustomSubActionAnchorElClicked, onCustomActionSubMenuClosed] = useDropdown();

    if (props.customActions && props.customActions.length > 0) {
        return (
            <>
                <IconButton className={panelClasses.panelHeaderCustomActionToggler} size="small" onClick={onCustomActionAnchorElClicked}>
                    <Icon>more_vert</Icon>
                </IconButton>
                <Menu
                    getContentAnchorEl={null}
                    anchorEl={customActionsMenuAnchorEl}
                    anchorOrigin={{
                        vertical  : 'bottom',
                        horizontal: 'right',
                    }}
                    transformOrigin={{
                        vertical  : 'top',
                        horizontal: 'right',
                    }}
                    keepMounted
                    open={isCustomActionsMenuOpened}
                    onClose={onCustomActionMenuClosed}
                >
                    {props.customActions.map((action: BaseCompAction | BaseCompSubAction) => {
                        return (
                            <MenuItem
                                key={action.label || action.icon}
                                disabled={action.disabled}
                                onClick={(event) => {
                                    if (isBaseCompAction(action)) {
                                        onCustomActionMenuClosed();
                                        action.onClick();
                                    } else if (isBaseCompSubAction(action)) {
                                        setSelectedSubMenu(action);
                                        onCustomSubActionAnchorElClicked(event);
                                    }
                                }}
                            >
                                {action.icon && (
                                    <ListItemIcon>
                                        <FontIcon iconName={action.icon} />
                                    </ListItemIcon>
                                )}
                                {action.label}
                            </MenuItem>
                        );
                    })}
                </Menu>

                {selectedSubMenu && (
                    <Menu
                        getContentAnchorEl={null}
                        anchorEl={customActionsSubMenuAnchorEl}
                        anchorOrigin={{
                            vertical  : 'top',
                            horizontal: 'left',
                        }}
                        transformOrigin={{
                            vertical  : 'top',
                            horizontal: 'right',
                        }}
                        keepMounted
                        open={isCustomActionsSubMenuOpened}
                        onClose={onCustomActionSubMenuClosed}
                    >
                        {selectedSubMenu.actions.map((action: BaseCompAction) => {
                            return (
                                <MenuItem
                                    key={action.label || action.icon}
                                    disabled={action.disabled}
                                    onClick={() => {
                                        onCustomActionMenuClosed();
                                        onCustomActionSubMenuClosed();
                                        action.onClick();
                                    }}
                                >
                                    {action.icon && (
                                        <ListItemIcon>
                                            <FontIcon iconName={action.icon} />
                                        </ListItemIcon>
                                    )}
                                    {action.label}
                                </MenuItem>
                            );
                        })}
                    </Menu>
                )}
            </>
        );
    }

    return (
        <></>
    );
};
