import React, {
    CSSProperties,
} from 'react';
import {
    Icon, PropTypes,
} from '@material-ui/core';
import clsx from 'clsx';


export interface IconProps {
    readonly className?: string;
    readonly style?: CSSProperties;
    readonly iconName: string;
    readonly color?: PropTypes.Color | 'action' | 'disabled' | 'error';
}


/**
 *      We have 3 font families that we can use for displaying icons, Material icons, Fontawesome icons, and Mode Icons. There are a few places where
 * which font we need to use to display icons are NOT known because they are configured from outside of the source code e.g. translation. Some icons
 * can be configured from the translation, Homes, Devices, Users and Terms icons. We can configure the app to replace the default icon for these
 * things from the translation file and we can use icons from any one of the 3 icon systems, Material Icon, Fontawesome, or Mode icons. Fontawesome
 * and Mode icons system uses className but Martial Icon use <Icon/> component.
 *      So when we display the icon, we have to check which icon system the icon is using. If the icon name starts with "fas" or "fab" we know it
 * is from fontawesome. If the icon name starts with "mode-icon", we know it uses Mode icon fonts. Otherwise, we will assume it is Material Icon.
 * So instead of putting all the icon name check logic everywhere, we created this FontIcon component to take care of that. Anywhere in the code
 * that need to display icon BUT we don't know which system the icon is from, we can use this FontIcon component and just pass in the icon name.
 * This component will take care of displaying the icon. However, this component DOES NOT style the icon. The container of this icon will need to
 * handle the styling e.g. icon size, color, etc... by using the className prop.
 *
 * This component should only be used when we don't know which icon we are using. If we know we are using Material Icon for example, there is no
 * need to use this component, we can just use <Icon>icon_name</Icon>. If we know we are using fontawesome icon, we can use
 * <span className="fas con-name" />.
 */
const ModeFontIcon = (props: IconProps) => {

    if (props.iconName.includes('mode-icon') || props.iconName.includes('fas') || props.iconName.includes('fab')) {
        return (
            <Icon
                color={props.color}
                className={clsx(props.className)}
                style={props.style}
            >
                <span
                    className={clsx(props.iconName)}
                    style={{
                        display: 'block',
                    }}
                />
            </Icon>
        );
    }

    return <Icon color={props.color} className={clsx(props.className)} style={props.style}>{props.iconName}</Icon>;
};

export const FontIcon = React.memo(ModeFontIcon);
