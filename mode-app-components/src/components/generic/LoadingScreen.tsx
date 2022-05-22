import React from 'react';
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';
import {
    makeStyles, Theme,
} from '@material-ui/core';


const useStyle = makeStyles((theme: Theme) => {
    return {
        root: {
            zIndex: theme.zIndex.modal + 1,     // Make loading container higher z-index than modal
            color : '#fff',
        },
    };
}, {
    name: 'LoadingScreen',
});



/**
 * This is a component that show a loading spinner over the app.
 */
export const LoadingScreen: React.FC = () => {
    const classes = useStyle();
    return (
        <Backdrop
            className={classes.root}
            open
        >
            <CircularProgress color="inherit" />
        </Backdrop>
    );

};
