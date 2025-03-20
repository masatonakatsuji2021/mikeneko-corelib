import { Lib } from "Lib";
import { Routes as AppRoutes } from "App";
import { View } from "View";

export interface RouteMaps{
    [name: string] : RouteMaps | RouteMap | typeof View,
}

export const RMapConvert = (maps : RouteMaps, continued?: boolean) : AppRoutes => {
    let res = {};
    const c = Object.keys(maps);
    for(let n = 0 ; n < c.length ; n++) {
        const name = c[n];
        let value = maps[name];
        
        if ((value as typeof View).___PATH___) value = RMap(value as typeof View);

        if (value instanceof RouteMap) {
            if (!value.url) {
                if (!continued && n == 0) {
                    value.url = "/";
                }
                else {
                    value.url = "/" + Lib.uniqId();
                }
            }
            if (value.handle) {
                res[value.url] = value.handle;
            }
            else {
                res[value.url] = value.view;
            }
        }
        else if (typeof value == "string") {
            // Impossible...
        }
        else {
            const buffers = RMapConvert(value as RouteMaps, true);
            const c2 = Object.keys(buffers);
            for(let n2 = 0 ; n2 < c2.length ; n2++){
                const name2 = c2[n2];
                const value2 = buffers[name2];
                res[name2] = value2;
            }
        }
    }

    return res;
};

export class RouteMap {

    public url : string;

    public view : string;

    public handle: (url : string) => RouteMap;

    public constructor(option : RouteMapDataCaseView | RouteMapDataCaseHandle | string | typeof View) {
        
        if (typeof option == "string") {
            this.view = option;
        }
        else if ((option as typeof View).___PATH___) {
            this.view = this.getViewName(option as typeof View);
        }
        else {
            option = option as RouteMapDataCaseView | RouteMapDataCaseHandle;
            if (option.url) {
                this.url = option.url;
            }
            else {
                this.url = "/" + Lib.uniqId();
            }
            const optionView = option as RouteMapDataCaseView;
            if (optionView.view) {
                if ((optionView.view as typeof View).___PATH___) optionView.view = this.getViewName(optionView.view as typeof View);
                this.view = optionView.view as string;
            }
            const optionHandle = option as RouteMapDataCaseHandle;
            if (optionHandle.handle) this.handle = optionHandle.handle;
        }
    }

    private getViewName(view : typeof View) : string {
        let viewName = view.___PATH___.substring("app/view/".length);
        let viewNames = viewName.split("/");
        let lastViewNames = viewNames[viewNames.length - 1];
        lastViewNames = lastViewNames.substring(0,1).toLowerCase() + lastViewNames.substring(1, lastViewNames.length - "View".length);
        viewNames[viewNames.length - 1] = lastViewNames;
        viewName = viewNames.join("/");
        return viewName;
    }
}

export interface RouteMapDataCaseView {

    /**
     * ***url*** : The URL to be accessed.  
     * (Only valid if routeType is Web) 
     */
    url? : string,

    /**
     * ***view*** : View class name to apply.
     */
    view: string | typeof View,
}

export interface RouteMapDataCaseHandle {

    /**
     * ***url*** : The URL to be accessed.  
     * (Only valid if routeType is Web) 
     */
    url? : string,

    /**
     * ***handle*** : Handler to execute on access.
     * @param {string} url Access URL
     * @returns 
     */
    handle: (url : string) => RouteMap;
}

/**
 * RMap
 * Initialize RouteMap class object.
 * @param {RouteMapDataCaseView | RouteMapDataCaseHandle | string} option RouteMap Option
 * @returns 
 */
export const RMap = (option : RouteMapDataCaseView | RouteMapDataCaseHandle | string | typeof View) : RouteMap => {
    return new RouteMap(option);
};

// @ts-ignore
import { Maps } from "app/config/Maps";

export const GetMaps = ()=>{
    return require("app/config/Maps").Maps as typeof Maps;
};