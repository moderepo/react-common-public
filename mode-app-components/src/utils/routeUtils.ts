/**
 * A SubRoute is just a normal route except that we need to display them in Tabs therefore we need other information about these routes
 * such as their 'name' which is used for highlighting the selected tab/sub route, and their 'label' which is used for displaying in the tab label.
 */
export interface SubRoute {
    readonly name: string;
    readonly relativePath: string;      // RELATIVE path to the RouteGroup's root
    readonly label: string;             // the path's display name, this should just be a key in the translation which will be translated later
}

/**
 * A group of routes
 */
export interface RouteGroup {
    readonly rootPath: string;
    readonly subRoutes: readonly SubRoute[];
}


/**
 * Compare 2 paths and return true if they are similar
 * Examples
 *      pathTemplate = '/projects/:projectId', pathname = '/projects/1234'  => true
 *      pathTemplate = '/projects/:projectId/devices', pathname = '/projects/1234/devices'  => true
 *      pathTemplate = '/projects/:projectId/users/:userId/homes/:homeId', pathname = '/projects/123/users/456/homes/798'  => true
 *      pathTemplate = '/projects/:projectId/users/:userId/homes/:homeId', pathname = '/projects/123/users/456/homes/798?params=abc'  => true
 *      pathTemplate = '/projects/:projectId/users/:userId/logs', pathname = '/projects/123/users/456/homes'  => false
 *      pathTemplate = '/projects/:projectId/users/:userId/logs', pathname = '/projects/123/logs'  => false
 *
 * @param pathTemplate - The path's template which has PLACEHOLDER for all the params e.g. :projectId, :deviceId, :userId, :homeId, etc...
 * @param pathname - The URL pathname]. The pathname will have the actual ID of all the entities instead of placeholder e.g. 123 instead of :projectId
 */
export const comparePaths = (pathTemplate: string, pathname: string): boolean => {
    const tokens1 = pathTemplate.split('/');
    const tokens2 = pathname.split('/');

    if (tokens1.length === tokens2.length) {
        for (let i = 0; i < tokens1.length; i += 1) {
            const token1 = tokens1[i];
            const token2 = tokens2[i];

            // if token1 is a variable, we will not compare with the value from token2, we will assume the value for token2 is the value
            // for token1's variable.
            // if token1 IS NOT a variable, then token1 MUST be EXACTLY the same as token2 or else they are treated as different
            if (!token1.startsWith(':') && token1 !== token2) {
                return false;
            }
        }
    } else {
        // if the 2 paths have different number of tokens, we can assume they are different
        return false;
    }

    return true;
};



/**
 * Given a routeGroup and a name of a subRoute, return the absolute path for that sub route.
 * @param routeGroup
 * @param subRouteName - OPTIONAL. If not provided OR if we can't find a subRoute of this name, we will return the routeGroup's root path
 */
export const getSubRouteAbsolutePath = (routeGroup: RouteGroup, subRouteName?: string): string => {
    if (subRouteName) {
        // Try to find the subRoute that has the same name as subRouteName. If we can find it, return the subRoute's ABSOLUTE path which
        // is a combination of the routeGroup's root path and subRoute's relative path
        const subRoute = routeGroup.subRoutes.find((sRound: SubRoute) => {
            return sRound.name === subRouteName;
        });
        if (subRoute) {
            return `${routeGroup.rootPath}${subRoute.relativePath}`;
        }
    }
    return routeGroup.rootPath;
};
