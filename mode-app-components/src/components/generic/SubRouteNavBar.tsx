import React, {
    useCallback, useEffect, useMemo, useState,
} from 'react';
import {
    makeStyles, Tab, Tabs,
} from '@material-ui/core';
import {
    comparePaths, getSubRouteAbsolutePath, RouteGroup, SubRoute,
} from '../..';


const useStyle = makeStyles(() => {
    return {
        root: {
            background: '#eeeeee',
            minHeight : 40,
            '& button': {
                minHeight: 40,
            },
        },
    };
}, {
    name: 'SubNavBar',
});



/**
 * Check if the given pathname belonged to the specified routeGroup and return the group that the path belonged to along with the subRoute
 * that matches the path. A pathname belonged to a routeGroup if one of the routeGroup's subRoutes has similar path as the pathname.
 * @param routeGroup
 * @param pathname
 * @returns undefined if the path doesn't belonged to any group. Return the subRoute that matched the path AND the routeGroup that the subRoute
 *          belonged to as an Array.
 */
const findRouteGroup = (routeGroup: RouteGroup, pathname: string): [SubRoute, RouteGroup] | [undefined, undefined] => {
    const subRoute = routeGroup.subRoutes.find((sRoute: SubRoute) => {
        return comparePaths(getSubRouteAbsolutePath(routeGroup, sRoute.name), pathname);
    });

    if (subRoute) {
        return [subRoute, routeGroup];
    }

    return [undefined, undefined];
};


export interface SubRouteNavBarProps {
    readonly pathname: string;
    readonly projectPaths: {[name: string]: string | RouteGroup};
    readonly onSubRouteSelected: (routeGroup: RouteGroup, subRoute: SubRoute)=> void;
}



/**
 * This component is for displaying the list of Sub routes base on the route the user is in. Some routes has sub routes e.g. User details page has
 * User Info page, and Logs page. Home details page has Home Info page and Logs page. Device details page has Settings page, Logs page,
 * Data page (for RobotCloud project type), and Sensor Modules page (for SensorCloud project type).
 * When the user enter one of these pages, we will see which group the page belonged to based on the APP_ROUTES_PATH config. If they belonged to
 * a group, we will get the list of sub routes for that group and display them as Tabs.
 * @param props
 */
export const SubRouteNavBar: React.FC<SubRouteNavBarProps> = (props: SubRouteNavBarProps) => {
    const [selectedTab, setSelectedTab] = useState<number>(0);
    const classes = useStyle();


    // With the pathname, find the RouteGroup that it belonged to and the subRoute that matches the pathname. If this pathname DOES NOT belong
    // in any group, we can assume it is its own route.
    const [selectedSubRoute, routeGroup] = useMemo(() => {
        return Object.values(props.projectPaths).reduce((
            result: [SubRoute, RouteGroup] | [undefined, undefined], path: any,
        ): [SubRoute, RouteGroup] | [undefined, undefined] => {
            // If we haven't find the group yet, try the next group
            if ((!result[0] || !result[1]) && typeof path !== 'string') {
                return findRouteGroup(path, props.pathname);
            }

            // If we already have a result, return the result
            return result;
        }, [undefined, undefined]);
    }, [props.projectPaths, props.pathname]);



    /**
     * This useEffect will automatically set the selectedTab index on component load for cases where the user lands on a subRoute from clicking
     * on some link.
     */
    useEffect(() => {
        if (routeGroup && selectedSubRoute) {
            const selectedSubRouteIndex = routeGroup.subRoutes.indexOf(selectedSubRoute);

            if (selectedSubRouteIndex >= 0) {
                setSelectedTab(selectedSubRouteIndex);
            }
        }
    }, [routeGroup, selectedSubRoute]);



    /**
     * On Tab selected, we will select the selected tab AND also take the user to the subRoute's path.
     */
    const onTabSelected = useCallback((_, index: number) => {
        if (routeGroup) {
            setSelectedTab(index);
            props.onSubRouteSelected(routeGroup, routeGroup.subRoutes[index]);
        }
    }, [routeGroup, props]);



    // If the current route belonged to a routeGroup, show the Tabs of all the subRoutes in the group
    if (routeGroup) {
        return (
            <Tabs
                className={classes.root}
                value={Math.min(selectedTab, routeGroup.subRoutes.length - 1)}
                onChange={onTabSelected}
                indicatorColor="primary"
                textColor="primary"
            >
                {routeGroup.subRoutes.map((subRoute: SubRoute) => {
                    return (
                        <Tab key={subRoute.relativePath} label={subRoute.label} />
                    );
                })}
            </Tabs>
        );
    }

    return (
        <></>
    );
};
