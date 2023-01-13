import {
    makeStyles, Paper,
} from '@material-ui/core';
import clsx from 'clsx';
import React, {
    PropsWithChildren,
} from 'react';
import {
    InfoCompPanelHeader,
} from '..';
import {
    BaseCompProps, useModePanelStyle,
} from '../..';


const useStyle = makeStyles(() => {
    return {
        root: {
        },

        panelContent: {
            height : '100%',
            padding: 0,
        },
    };
}, {
    name: 'GenericPanelComp', index: 1,
});


export interface GenericPanelCompProps extends BaseCompProps {
    readonly panelContentClass?: string | undefined;
}


/**
 * This is a generic component that can be used for creating a component with panel header and body. The provided children will
 * be displayed in the body
 */
export const GenericPanelComp: React.FC<GenericPanelCompProps & PropsWithChildren<React.ReactNode>> = (
    props: GenericPanelCompProps & PropsWithChildren<React.ReactNode>,
) => {
    const panelClasses = useModePanelStyle();
    const classes = useStyle();

    return (
        <Paper
            elevation={2}
            className={clsx(panelClasses.root, props.className, classes.root)}
            style={props.style}
        >
            <InfoCompPanelHeader {...(props as object)} />
            <div className={clsx(panelClasses.panelContent, classes.panelContent, props.panelContentClass)}>
                {props.children}
            </div>
        </Paper>
    );
};
