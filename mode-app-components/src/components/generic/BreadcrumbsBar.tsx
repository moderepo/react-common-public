import React, {
    useMemo,
} from 'react';
import {
    Breadcrumbs, makeStyles, Theme, Tooltip,
} from '@material-ui/core';
import clsx from 'clsx';
import {
    comparePaths, getSubRouteAbsolutePath, RouteGroup, SubRoute,
} from '../..';
import {
    FontIcon,
} from '../mode';



const useStyle = makeStyles((theme: Theme) => {
    return {
        root: {
            background                  : theme.palette.background.paper,
            padding                     : theme.spacing(0, 1),
            [theme.breakpoints.up('md')]: {
                padding: theme.spacing(0, 2),
            },
            '&.hidden': {
                display: 'none',
            },
        },

        breadcrumb: {
            padding      : theme.spacing(1, 0),
            textTransform: 'none',
            fontSize     : '1rem',
            display      : 'flex',
            flexDirection: 'row',
            alignItems   : 'center',
            fontWeight   : 'normal',
            color        : theme.palette.text.primary,

            '&.link': {
                color : theme.palette.text.secondary,
                cursor: 'pointer',
            },

            '&.icon-only': {
                '& $icon': {
                    marginRight: theme.spacing(0),
                },
            },
        },

        icon: {
            marginRight: theme.spacing(1),
        },
    };
}, {
    name: 'BreadcrumbsBar',
});



interface Breadcrumb {
    readonly routeName?: string;
    readonly icon?: string;
    readonly routeId?: string;
    readonly routePath: string;
}



const getUserFriendlyPathName = (
    pathName: string | undefined,
    entityId: string | undefined,
    pathnameToUserFriendlyNameMap?: {
        readonly [pathName: string]: {
            readonly singular: string;
            readonly plural?: string;       // OPTIONAL - if pathName does not have a plural friendly name, singular name will be used.
        }
    },
): string => {
    if (pathName && pathnameToUserFriendlyNameMap && pathnameToUserFriendlyNameMap[pathName]) {
        if (entityId) {
            return pathnameToUserFriendlyNameMap[pathName].singular;
        }
        return pathnameToUserFriendlyNameMap[pathName].plural || pathnameToUserFriendlyNameMap[pathName].singular;
    }

    // There is no special mapping of pathName -> userFriendlyName so just return the path name
    return pathName || '';
};



/**
  * Given a pathTemplate and a pathname, return TRUE if pathname matches the pathTemplate, the have the same pattern.
  * @param pathTemplate - The template of ONE existing path. If pathname matches the pattern of this pathTemplate, we will assume pathname exist.
  *                       pathTemplate can be a string or a GROUP of routes. If pathTemplate is a Group of routes, we will need to compare EACH
  *                       sub route in the group with pathname.
  * @param pathname - The pathname we want to check if exist in the app, whether or not there is a route to this pathname.
  */
const isPathExist = (pathTemplate: string | RouteGroup, pathname: string, excludedRoutePaths: readonly string[] | undefined): boolean => {
    if (typeof pathTemplate === 'string') {
        return !excludedRoutePaths?.includes(pathTemplate) && comparePaths(pathTemplate, pathname);
    }

    // pathTemplate is an Object then it is probably an object of RouteGroup type. Go through each subRoutes in pathTemplate and call isPathExist
    // on each subRoute to compare with the pathname
    const routeGroup = pathTemplate as RouteGroup;
    return routeGroup.subRoutes.find((subRoute: SubRoute) => {
        // subRoute.path contains only the relative path, e.g. /logs, /settings, therefore we need to call getSubRouteAbsolutePath
        // to get the subRoute's absolute path
        return isPathExist(getSubRouteAbsolutePath(routeGroup, subRoute.name), pathname, excludedRoutePaths);
    }) !== undefined;
};



/**
 * Split the path into breadcrumbs e.g.
 *      From: '/projects/1235/users/1774/homes/1649'
 *      To: ['/projects/1235', '/projects/1235/users/1774', '/projects/1235/users/1774/homes/1649']
 */
const buildBreadcrumbLinks = (
    path: string,
    projectPaths: {[name: string]: string | RouteGroup},
    routeNameToIconMap: {[name: string]: string} | undefined,
    excludedRoutePaths: readonly string[] | undefined,
): readonly Breadcrumb[] => {
    const tokens = path.substring(1).split('/');

    const links = tokens.reduce((result: Breadcrumb[], token: string): Breadcrumb[] => {
        if (token && token.length > 0) {
            if (result.length === 0) {
                // If this is the first token, add it to the result
                result.push({
                    routeName: token,
                    routePath: `/${token}`,
                    icon     : routeNameToIconMap ? routeNameToIconMap[token] : undefined,
                });
            } else {
                // If this is NOT the first token, check to see if we need to add the current token to the
                // last link in the result or start a new link
                const prevLink: Breadcrumb = result[result.length - 1];
                if (Number.isNaN(Number(token))) {
                    // Token is a string so we will create a new link with the same path as the previousLink + token
                    // e.g. prevLink = '/projects' and token is 'agents', we will add a new link '/projects/agents'
                    result.push({
                        routeName: token,
                        routePath: `${prevLink.routePath}/${token}`,
                        icon     : routeNameToIconMap ? routeNameToIconMap[token] : undefined,
                    });
                } else {
                    // Token is a number, it must be some ID e.g. projectId, userId, homeId, etc...
                    // so it should be part of the prevLink. Therefore, we just need to append token to the prevLink
                    result.push({
                        routeName: prevLink.routeName,
                        routeId  : token,
                        routePath: `${prevLink.routePath}/${token}`,
                        icon     : routeNameToIconMap && prevLink.routeName ? routeNameToIconMap[prevLink.routeName] : undefined,
                    });
                }
            }
        }
        return result;
    }, []);


    // filter out links that do not exits
    const allAllowedPaths = Object.values(projectPaths);
    return links.filter((breadcrumb: Breadcrumb): boolean => {
        return allAllowedPaths.find((allowedPath: string | RouteGroup): boolean => {
            return isPathExist(allowedPath, breadcrumb.routePath, excludedRoutePaths);
        }) !== undefined;
    });
};


export interface BreadcrumbsBarProps {
    readonly pathname: string;
    readonly routePaths: {[name: string]: string | RouteGroup};
    readonly excludedRoutePaths?: readonly string[] | undefined;
    readonly separatorIcon?: string;
    readonly minimal?: boolean;     // Whether or not to show the minimal UI. If true, we will not show name if icon is available.

    readonly rootBreadcrumb?: Breadcrumb;   // Optional breadcrumb to show for the Root '/' since the '/' is not considered as one of the breadcrumbs

    readonly routeNameToUserFriendlyNameMap?: {
        [pathName: string]: {
            readonly singular: string;
            readonly plural?: string;
        }
    };
    readonly routeNameToIconMap?: {
        readonly [pathName: string]: string;
    }
    readonly routeNameToTitleMap?: {
        readonly [pathName: string]: string;
    }
    readonly onBreadcrumbClick: (path: string)=> void;
}


/**
 * This is a BreadcrumbsBar components. This is used for displaying breadcrumbs on top of the page so that the
 * user can easily navigate to the previous path. The breadcrumbs will be generated dynamically based on the
 * current page's pathname.
 */
export const BreadcrumbsBar = (props: BreadcrumbsBarProps) => {
    const classes = useStyle();

    const breadcrumbs = useMemo(() => {
        const regularBreadcrumbs = buildBreadcrumbLinks(props.pathname, props.routePaths, props.routeNameToIconMap, props.excludedRoutePaths);
        if (props.rootBreadcrumb) {
            return [props.rootBreadcrumb, ...regularBreadcrumbs];
        }

        return regularBreadcrumbs;
    }, [props.pathname, props.routePaths, props.rootBreadcrumb, props.routeNameToIconMap, props.excludedRoutePaths]);


    return (
        <Breadcrumbs
            className={clsx(classes.root, breadcrumbs.length <= 0 && 'hidden')}
            separator={<FontIcon iconName={props.separatorIcon || 'navigate_next'} />}
        >
            {breadcrumbs.map((breadcrumb: Breadcrumb, index: number): JSX.Element => {
                return (
                    <Tooltip
                        key={`${breadcrumb.routePath}-${breadcrumb.routeName || ''}-${breadcrumb.icon || ''}`}
                        title={props.routeNameToTitleMap && breadcrumb.routeName && props.routeNameToTitleMap[breadcrumb.routeName]
                            ? props.routeNameToTitleMap[breadcrumb.routeName]
                            : ''}
                    >
                        <div
                            className={clsx(
                                classes.breadcrumb, index < breadcrumbs.length - 1 && 'link', (props.minimal || !breadcrumb.routeName) && 'icon-only',
                            )}
                            onClick={() => {
                                props.onBreadcrumbClick(breadcrumb.routePath);
                            }}
                        >
                            {breadcrumb.icon && (
                                <FontIcon
                                    className={clsx(classes.icon)}
                                    iconName={breadcrumb.icon}
                                />
                            )}
                            {(!breadcrumb.icon || !props.minimal) && (
                                `${getUserFriendlyPathName(breadcrumb.routeName, breadcrumb.routeId, props.routeNameToUserFriendlyNameMap)}
                                        ${breadcrumb.routeId ? ` #${breadcrumb.routeId}` : ''}`
                            )}
                        </div>
                    </Tooltip>
                );
            })}
        </Breadcrumbs>
    );
};
