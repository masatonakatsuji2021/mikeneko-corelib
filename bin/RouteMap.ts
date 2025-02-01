import { Lib } from "Lib";
import { Routes as AppRoutes } from "App";

export interface RouteMaps{
    [name: string] : RouteMaps | RouteMap,
}

export const RMapConvert = (maps : RouteMaps) : AppRoutes => {
    let res = {};
    const c = Object.keys(maps);
    for(let n = 0 ; n < c.length ; n++) {
        const name = c[n];
        const value = maps[name];

        if (value instanceof RouteMap) {
            if (!value.url) value.url = "/" + Lib.uniqId();
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
            const buffers = RMapConvert(value);
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

    public constructor(option : RouteMapDataCaseView | RouteMapDataCaseHandle | string) {
        if (typeof option == "string") {
            this.view = option;
            if (!RMapIndex) this.url = "/";
        }
        else {
            if (!RMapIndex) {
                if (!option.url) this.url = "/";
            }
            else {
                if (option.url) this.url = option.url;
            }
            const optionView = option as RouteMapDataCaseView;
            if (optionView.view) this.view = optionView.view;
            const optionHandle = option as RouteMapDataCaseHandle;
            if (optionHandle.handle) this.handle = optionHandle.handle;
        }
        RMapIndex++;
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
    view: string,
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

let RMapIndex : number = 0;

/**
 * RMap
 * Initialize RouteMap class object.
 * @param {RouteMapDataCaseView | RouteMapDataCaseHandle | string} option RouteMap Option
 * @returns 
 */
export const RMap = (option : RouteMapDataCaseView | RouteMapDataCaseHandle | string) : RouteMap => {
    return new RouteMap(option);
};