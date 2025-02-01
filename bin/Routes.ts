import { App } from "App";
import { RMapConvert, RouteMap } from "RouteMap";

export interface Route{
    view : string,
    controller: string,
    action: string,
    handle: (url : string) => string | RouteMap,
    aregment?: Array<any>,
}

export enum DecisionRouteMode {
    Success = "success",
    Notfound = "notfound",
}

export interface DecisionRoute {
    url? : string,
    mode? : DecisionRouteMode,
    controller?: string,
    action?: string,
    args? : Array<string>,
    view? : string,
    handle?: (url : string) => string | RouteMap,
}

export class Routes{

    public static _routes : {[url : string] : Route} = null;
    public static _decision : DecisionRoute = null;

    public static searchRoute(url: string = null){

        const MyApp : typeof App = use("app/config/App").MyApp;

        if(!Routes._routes){        
            if (MyApp.maps) MyApp.routes = RMapConvert(MyApp.maps);
            Routes._routes = Routes.routeConvert(MyApp.routes);
        }

        let targetUrl : string = location.hash.substring(1);
        if(url) targetUrl = url;

        if(!targetUrl){
            targetUrl = "/";
        }
        else{
            if(targetUrl != "/"){
                if(targetUrl.substring(targetUrl.length - 1) == "/"){
                    targetUrl = targetUrl.substring(0, targetUrl.length - 1);
                }
            }
        }

        Routes._decision = Routes.routeSelect(targetUrl);
        return Routes._decision;
    }

    public static getRoute() : DecisionRoute{
        return Routes._decision;
    }

    private static routeConvert(routes) : {[url : string] : Route} {
        let res : {[url : string] : Route} = {};
        var columns = Object.keys(routes);
        for(var n = 0 ; n < columns.length ; n++){
            let url = columns[n];
            let val = routes[url];

            if(typeof val == "string"){
                let vals = val.split(",");

                let buffer : Route = {
                    controller: null,
                    view: null,
                    action: null,
                    handle: null,
                };
                for(let n2 = 0; n2 < vals.length ; n2++){
                    let v_ = vals[n2];
                    v_ = v_.trim();

                    if(v_.indexOf("controller:") === 0){
                        buffer.controller = v_.substring("controller:".length).trim();
                    }
                    else if(v_.indexOf("c:") === 0){
                        buffer.controller = v_.substring("c:".length).trim();
                    }
                    else if(v_.indexOf("action:") === 0){
                        buffer.action = v_.substring("action:".length).trim();
                    }
                    else if(v_.indexOf("a:") === 0){
                        buffer.action = v_.substring("a:".length).trim();
                    }
                    else if(v_.indexOf("view:") === 0){
                        buffer.view = v_.substring("view:".length).trim();
                    }
                    else if(v_.indexOf("v:") === 0){
                        buffer.view = v_.substring("v:".length).trim();
                    }
                }

                if(
                    !buffer.controller && 
                    !buffer.view &&
                    !buffer.action
                ){
                    buffer.view = val;
                }

                res[url] = buffer;             
            }
            else if(typeof val == "function") {
                let buffer : Route = {
                    controller: null,
                    view: null,
                    action: null,
                    handle: null,
                };                
                buffer.handle = val;
                res[url] = buffer;
            }
            else{
                var buffers = Routes.routeConvert(val);

                var columns2 = Object.keys(buffers);
                for(var n2 = 0 ; n2 < columns2.length ; n2++){
                    var url2 = columns2[n2];
                    var val2 = buffers[url2];

                    if(url2 == "/"){
                        url2 = "";
                    }
                    res[url + url2] = val2;
                }
            }
        }

        return res;
    }

    private static routeSelect(targetUrl : string) : DecisionRoute {

        var sect0 = targetUrl.split("/");

        var decision = null;

        var columns = Object.keys(this._routes);
        for(var n = 0 ; n < columns.length ; n++){
            var url = columns[n];
            var val = this._routes[url];

            var sect1 = url.split("/");

            var status1 = true;
            var status2 = true;

            for(var n2 = 0 ; n2 < sect0.length ; n2++){

                var aregment = [];

                if(!sect1[n2]){
                    sect1[n2] = "";
                }

                if(sect0[n2] != sect1[n2]){
                    if(sect1[n2].indexOf("{") === 0 && sect1[n2].indexOf("}") === (sect1[n2].length - 1)){
                        if(sect1[n2].indexOf("?}") !== (sect1[n2].length -2)){
                            if(!sect0[n2]){
                                status1 = false;
                            }
                        }
                    }
                    else{
                        status1 = false;
                    }
                }
            }

            for(var n2 = 0 ; n2 < sect1.length ; n2++){

                if(!sect0[n2]){
                    sect0[n2] = "";
                }

                if(sect0[n2] != sect1[n2]){
                    if(sect1[n2].indexOf("{") === 0 && sect1[n2].indexOf("}") === (sect1[n2].length - 1)){
                        if(sect1[n2].indexOf("?}") !== (sect1[n2].length -2)){
                            if(!sect0[n2]){
                                status1 = false;
                            }
                        }
                        
                        aregment.push(sect0[n2]);
                    }
                    else{
                        status2 = false;
                    }
                }
            }

            if(status1 && status2){
                decision = val;
                decision.aregment = aregment;
            }
        }

        let res : DecisionRoute= {};
        if(decision){

            if (decision.handle){
                const handleRes = decision.handle(targetUrl);
                if (handleRes instanceof RouteMap) {
                    decision.view = handleRes.view; 
                }
                else {
                    decision.view = handleRes;
                }
            }

            res = {
                url : targetUrl,
                mode: DecisionRouteMode.Success,
                controller: decision.controller,
                action: decision.action,
                args: decision.aregment,
                view : decision.view,
                handle: decision.handle,
            };
        }
        else{
            res = {
                url : targetUrl,
                mode: DecisionRouteMode.Notfound,
            };
        }
        
        return res;
    }
    
}