import React, {
    CSSProperties, useCallback, useState,
} from 'react';
import clsx from 'clsx';
import {
    Button,
} from '@material-ui/core';
import {
    useModeFormStyle, FontIcon,
} from '../../..';


export interface FormInputSectionProps {
    readonly className?: string | undefined;
    readonly style?: CSSProperties | undefined;
    readonly title: string;
    readonly icon?: string | JSX.Element | undefined;
    readonly collapsible: boolean;
    readonly collapsed?: boolean | undefined;
}


export const ModeFormInputSection: React.FC<FormInputSectionProps & React.PropsWithChildren<React.ReactNode>> = (
    props: FormInputSectionProps & React.PropsWithChildren<React.ReactNode>,
) => {
    const [collapsed, setCollapsed] = useState<boolean>(props.collapsed || false);
    const formClasses = useModeFormStyle();


    const createTitleContent = useCallback(() => {
        return (
            <>
                {props.icon && typeof props.icon === 'string' && (<FontIcon className="header-icon" iconName={props.icon} />)}
                {props.icon && typeof props.icon !== 'string' && (<div className="header-icon wrapper">{props.icon}</div>)}

                <div className="text">{props.title}</div>

                {props.collapsible && (
                    <FontIcon className="toggle-icon" iconName="fas fa-chevron-up" />
                )}
            </>
        );
    }, [props.icon, props.collapsible, props.title]);


    return (
        <div
            className={clsx(
                props.className,
                formClasses.formInputSection,
                props.collapsible && 'collapsible',
                collapsed && 'collapsed',
            )}
            style={props.style}
        >
            {props.collapsible ? (
                <Button
                    className={formClasses.formInputSectionTitle}
                    variant={collapsed ? 'contained' : 'text'}
                    onClick={() => {
                        setCollapsed((currentValue) => {
                            return !currentValue;
                        });
                    }}
                >
                    {createTitleContent()}
                </Button>
            ) : (
                <div className={formClasses.formInputSectionTitle}>
                    {createTitleContent()}
                </div>
            )}
            <div className={formClasses.formInputSectionContent}>
                {props.children}
            </div>
        </div>
    );
};
