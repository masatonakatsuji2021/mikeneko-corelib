import { App, AppRouteType } from "App";
import { Routes, DecisionRoute, DecisionRouteMode, Route } from "Routes";
import { Lib } from "Lib";
import { Data, DataService } from "Data";
import { View } from "View";
import { Template } from "Template";
import { UI } from "UI";
import { dom, VirtualDom} from "VirtualDom";
import { RouteMap } from "RouteMap";
import { Hook, HookNames } from "Hook";

export interface PageHistory {

    view: string,

    url: string | number,

    args?: Array<string>,

    data?: any,
}

export class Transition {

    /**
     * ***isBack*** : A flag that determines if you are back from the previous screen.  
     * True if you return from the previous screen, false if you proceed from the previous screen
     */
    public static isBack : boolean = false;

    /**
     * ***lock*** : Flag to lock screen transition operations.  
     * If set to true, back operations such as Response.back will be temporarily disabled.
     */
    public static lock : boolean = false;

    private static get routeType() : AppRouteType {
        // @ts-ignore
        const MyApp : typeof App = use("app/config/App").MyApp;
        return MyApp.routeType;
    }

    /**
     * ***back*** : Return to the previous screen.  
     * However, this cannot be used if there is no history of the previous screen  
     * or if screen transitions are disabled using lock.  
     * The return value indicates whether the return to the previous screen was successful.
     * @returns {boolean} 
     */
    public static back() : boolean;


    /**
     * ***back*** : Return to the previous screen.  
     * However, this cannot be used if there is no history of the previous screen  
     * or if screen transitions are disabled using lock.  
     * The return value indicates whether the return to the previous screen was successful.
     * @param {number} index Number of screens to go back.
    * @returns {boolean} 
     */
    public static back(index : number) : boolean;

    public static back(index? : number) : boolean {
        if (!index) index = 1;
        if (Transition.lock) return false;
        if (this.isBack) return false;        
        this.isBack = true;
        Hook.dispatch(HookNames.TransitionBack);
        
        if (Data.getLength(DataService.backHandle)) {
            const backHandle = Data.pop(DataService.backHandle);
            backHandle();
            this.isBack = false;
            return true;
        }

        let hdata : PageHistory;
        for (let n = 0 ; n < index ; n++) {
            if (this.routeType == AppRouteType.application) {
                if (Data.getLength(DataService.history) == 1) return false;
                Data.pop(DataService.history);
                hdata= Data.now(DataService.history);
            }
            else if(this.routeType == AppRouteType.web) {
                history.back();
            }    
        }

        if(this.routeType == AppRouteType.web) return true;
       
        const route : DecisionRoute = {
            mode: DecisionRouteMode.Success,
            view: hdata.view,
            args: hdata.args,
            url: hdata.url.toString(),
        };
        Transition.rendering(route, hdata.data).then(()=>{
            this.isBack = false;
        });

        return true;
    }

    /**
     * ***move*** : Transitions to the specified RouteMap object.
     * @param {RouteMap} map RouteMap Class Object
     * @returns {void}
     */
    public static move(map : RouteMap) : void;

    /**
     * ***move*** : Transitions to the specified View class.
     * @param {typeof View} view View Class
     * @returns {void}
     */
    public static move(view : typeof View) : void;

    /**
     * ***move*** : Transitions to the specified RouteMap object.
     * @param {RouteMap} map RouteMap Class Object
     * @param {Array<string | number>} args request URL argrements
     * @returns {void}
     */
    public static move(map : RouteMap, args: Array<string | number>) : void;

    /**
     * ***move*** : Transitions to the specified View class.
     * @param {typeof View} view View Class
     * @param {Array<string | number>} args request URL argrements
     * @returns {void}
     */
    public static move(view : typeof View, args: Array<string | number>) : void;

    /**
     * ***move*** : Transitions to the specified RouteMap object.
     * @param {RouteMap} map RouteMap Class Object
     * @param {Array<string | number>} args request URL argrements
     * @param {any} data send data (Name is not entered. Available only when routeType is app.)
     * @returns {void}
     */
    public static move(map : RouteMap, args: Array<string | number>, data: any) : void;

    /**
     * ***move*** : Transitions to the specified View class.
     * @param {typeof View} view View Class
     * @param {Array<string | number>} args request URL argrements
     * @param {any} data send data (Name is not entered. Available only when routeType is app.)
     * @returns {void}
     */
    public static move(view : typeof View, args: Array<string | number>, data: any) : void;
    
    public static move(mapOrView : RouteMap | typeof View, args?: Array<string | number>, data?: any)  : void {
        if (Transition.lock) return;
        Hook.dispatch(HookNames.TransitionMove, mapOrView);
        let url : string;
        if (mapOrView instanceof RouteMap) {
            url = mapOrView.url;
            const indentifier = "{!!!}";
            if (args) {
                url = url.replace(/\/{([^}]+)}/g, indentifier);
    
                for (let n = 0 ; n < args.length ; n++) {
                    url = url.replace(indentifier, "/" + args[n].toString());
                }
            }
            url = url.split(indentifier).join("");
            Transition.next(url, data);        
        }
        else {
            const view = mapOrView as typeof View;
            Transition.next(view, data);  
        }
    }

    /**
     * ***next*** : Transition to the specified URL (route path)  
     * It cannot be used if screen transitions are disabled by lock, etc.  
     * @param {string} url route path
     * @returns {void}
     */
    public static next(url : string | number) : void;

    /**
     * ***next*** : Transition to the specified RouteMap class routing.  
     * It cannot be used if screen transitions are disabled by lock, etc.  
     * @param {RouteMap} map RouteMap Class Object
     * @returns {void}
     */
    public static next(map: RouteMap) : void;

    /**
     * ***next*** : Transitions to the specified View class.
     * It cannot be used if screen transitions are disabled by lock, etc.  
     * @param {typeof View} view View Class
     * @returns {void}
     */
    public static next(view: typeof View) : void;

    /**
     * ***next*** : Transition to the specified URL (route path)  
     * It cannot be used if screen transitions are disabled by lock, etc.  
     * @param {string} url route path
     * @param {any?} data Transmission data contents
     * @returns {void}
     */
    public static next(url : string | number, data : any) : void;

    /**
     * ***next*** : Transition to the specified RouteMap class routing.  
     * It cannot be used if screen transitions are disabled by lock, etc.  
     * @param {RouteMap} map RouteMap Class Object
     * @param {Array<string | number>} args request URL argrements
     * @returns {void}
     */
    public static next(map : RouteMap, args: Array<string | number>) : void;

    /**
     * ***next*** : Transition to the specified View Class. 
     * It cannot be used if screen transitions are disabled by lock, etc.  
     * @param {typeof View} view View Class
     * @param {any?} data Transmission data contents
     * @returns {void}
     */
    public static next(view: typeof View, data : any) : void;

    /**
     * ***next*** : Transition to the specified RouteMap class routing.  
     * It cannot be used if screen transitions are disabled by lock, etc.  
     * @param {RouteMap} map RouteMap Class Object
     * @param {Array<string | number>} args request URL argrements
     * @param {any} data send data (Name is not entered. Available only when routeType is app.)
    * @returns {void}
     */
    public static next(map : RouteMap, args: Array<string | number>, data : any) : void;

    /**
     * ***next*** : Transition to the specified View Class.  
     * It cannot be used if screen transitions are disabled by lock, etc.  
     * @param {typeof View} view View Class
     * @param {Array<string | number>} args request URL argrements
     * @param {any} data send data (Name is not entered. Available only when routeType is app.)
    * @returns {void}
     */
    public static next(view: typeof View, args: Array<string | number>, data : any) : void;

    public static next(target : string | number | RouteMap | typeof View, data? : any, data2? : any) : void {
        if (Transition.lock) return;
        this.isBack = false;
        Hook.dispatch(HookNames.TransitionNext, target);
        if (target instanceof RouteMap) return this.move(target, data, data2);
        let url : string;
        let route: DecisionRoute;
        if (typeof target === "function") {
            const view = target as typeof View;
            // @ts-ignore
            const viewName0 = view.___PATH___.substring("app/view/".length);
            const viewName1 = viewName0.substring(0, viewName0.length - "View".length);
            const viewName2 = viewName1.split("/");
            viewName2[viewName2.length - 1] = viewName2[viewName2.length - 1].substring(0,1).toLowerCase() + viewName2[viewName2.length - 1].substring(1);
            const viewName = viewName2.join("/");
            url = "/";
            route = {
                mode: DecisionRouteMode.Success,
                url: url,
                view: viewName,
            };
        }
                if (typeof target === "function") {
            const view = target as typeof View;
            // @ts-ignore
            const viewName0 = view.___PATH___.substring("app/view/".length);
            const viewName1 = viewName0.substring(0, viewName0.length - "View".length);
            const viewName2 = viewName1.split("/");
            viewName2[viewName2.length - 1] = viewName2[viewName2.length - 1].substring(0,1).toLowerCase() + viewName2[viewName2.length - 1].substring(1);
            const viewName = viewName2.join("/");
            url = "/";
            route = {
                mode: DecisionRouteMode.Success,
                url: url,
                view: viewName,
            };
        }
        else {
            url = target as string;
            route = Routes.searchRoute(url.toString());
        }

        const hdata : PageHistory= {
            url: url,
            view: route.view,
            args: route.args,
            data: data,
        };
        Data.push(DataService.history, hdata);

        if (this.routeType == AppRouteType.web) {
            if (url == "/") {
                location.hash = "";
            }
            else {
                location.hash = "#" + url;
            }
        }
        else {
            Transition.rendering(route, data);
        }
    }

    /**
     * ***stack*** : Temporarily bring the specified RouteMap View to the foreground.  
     * If it is displayed using this method, it will not be saved in the history.  
     * If the destination View has a **handleLeaveStackClose** method, you can use async/await to capture the return value.
     * @param {RouteMap} map RouteMap Class Object
     * @returns {Promise<any>} 
     */
    public static async stack(map: RouteMap) : Promise<any> ;

    /**
     * ***stack*** : Temporarily brings the specified View to the foreground.  
     * If it is displayed using this method, it will not be saved in the history.  
     * If the destination View has a **handleLeaveStackClose** method, you can use async/await to capture the return value.
     * @param {typeof View} view View Class
     * @returns {Promise<any>} 
     */
    public static async stack(view: typeof View) : Promise<any> ;

    /**
     * ***stack*** : Temporarily bring the specified RouteMap View to the foreground.  
     * If it is displayed using this method, it will not be saved in the history.  
     * If the destination View has a **handleLeaveStackClose** method, you can use async/await to capture the return value.
     * @param {RouteMap} map RouteMap Class Object
     * @param {any} data send data
     * @returns {Promise<any>} 
     */
    public static async stack(map: RouteMap, data: any) : Promise<any> ;

    /**
     * ***stack*** : Temporarily brings the specified View to the foreground.   
     * If it is displayed using this method, it will not be saved in the history.  
     * If the destination View has a **handleLeaveStackClose** method, you can use async/await to capture the return value.
     * @param {typeof View} view View Class
     * @param {any} data send data
     * @returns {Promise<any>} 
     */
    public static async stack(view: typeof View, data: any) : Promise<any> ;

    public static async stack(mapOrView: RouteMap | typeof View, data?: any) : Promise<any> {
        Hook.dispatch(HookNames.TransitionStack, mapOrView);
        if (!(mapOrView instanceof RouteMap)) {
            const view = mapOrView as typeof View;
            return await view.stackOpen(data);
        }
        
        let map = mapOrView as RouteMap;            

        const viewName = Lib.getModuleName(map.view) + "View";
        const viewPath = "app/view/" + Lib.getModulePath(map.view) + "View";
        // @ts-ignore
        if (!useExists(viewPath)) {
            console.error("View not found \"" + viewPath + "\".");
            return;
        }
        // @ts-ignore
        const view_ = use(viewPath);
        if(!view_[viewName]) {
            console.error("View Class not exist \"" + viewPath + "\".");
            return;
        }

        const view = view_[viewName] as typeof View;
        return await view.stackOpen(data);
    }

    /**
     * ***stackClose*** : Can be used when displaying a screen using stack.  
     * Returns to the previous screen and returns the specified arguments to the previous screen.
     * @param {any} result Value to pass to previous screen.
     * @returns 
     */
    public static stackClose(result : any) : void {
        if (Transition.lock) return;
        if (this.isBack) return;
        Hook.dispatch(HookNames.TransitionStackClose);
        this.isBack = true;

        if (Data.getLength(DataService.backHandle)) {
            const backHandle = Data.pop(DataService.backHandle);
            backHandle(result);
            this.isBack = false;
        }
    }

    /**
     * ***historyAdd*** : Add root path to screen transition history.  
     * It will only be added to the history and will not change the screen.
     * @param {string | number} url route path
     * @returns {typeof Transition}
     */
    public static historyAdd(url : string | number) : typeof Transition;

    /**
     * ***historyAdd*** : Added RouteMap class object to screen transition history.  
     * It will only be added to the history and will not change the screen.
     * @param {string} map RouteMap Class Object
     * @returns {typeof Transition}
     */
    public static historyAdd(map : RouteMap) : typeof Transition;

    /**
     * ***historyAdd*** : Added View class to screen transition history.  
     * It will only be added to the history and will not change the screen.
     * @param {typeof View} view View Class
     * @returns {typeof Transition}
     */
    public static historyAdd(view : typeof View) : typeof Transition;

    /**
     * ***historyAdd*** : Add root path to screen transition history.  
     * It will only be added to the history and will not change the screen.
     * @param {string} map RouteMap Class Object
     * @param {any} data send data
     * @returns {typeof Transition}
     */
    public static historyAdd(url : string | number, data: any) : typeof Transition;

    /**
     * ***historyAdd*** : Add root path to screen transition history.  
     * It will only be added to the history and will not change the screen.
     * @param {typeof View} view View Class
     * @param {any} data send data
     * @returns {typeof Transition}
     */
    public static historyAdd(view : typeof View, data: any) : typeof Transition;

    /**
     * ***historyAdd*** : Added RouteMap class object to screen transition history.  
     * It will only be added to the history and will not change the screen.
     * @param {RouteMap} map RouteMap Class Object
     * @param {Array<string | number>} args request URL argrements
     * @returns {typeof Transition}
     */
    public static historyAdd(map : RouteMap, args: Array<string | number>) : typeof Transition;

    /**
     * ***historyAdd*** : Added RouteMap class object to screen transition history.  
     * It will only be added to the history and will not change the screen.
     * @param {RouteMap} map RouteMap Class Object
     * @param {Array<string | number>} args request URL argrements
     * @param {any} data send data
     * @returns {typeof Transition}
     */
    public static historyAdd(map : RouteMap, args: Array<string | number>, data: any) : typeof Transition ;

    public static historyAdd(target : string | number | RouteMap | typeof View, data?: any, data2? : any) : typeof Transition {
        if (Transition.lock) return;
        this.isBack = false;
        Hook.dispatch(HookNames.TransitionHistoryAdd, target);
        let url : string;
        let sendData : any;
        let route : DecisionRoute;
        if (target instanceof RouteMap) {
            const map = target as RouteMap;
            url = map.url;
            const args = data;
            const indentifier = "{!!!}";
            if (args) {
                url = url.replace(/\/{([^}]+)}/g, indentifier);
    
                for (let n = 0 ; n < args.length ; n++) {
                    url = url.replace(indentifier, "/" + args[n].toString());
                }
            }
            url = url.split(indentifier).join("");
            route = Routes.searchRoute(url.toString());
            sendData = data2;
        }
        else if (typeof target === "function") {
            const view = target as typeof View;
            // @ts-ignore
            const viewName0 = view.___PATH___.substring("app/view/".length);
            const viewName1 = viewName0.substring(0, viewName0.length - "View".length);
            const viewName2 = viewName1.split("/");
            viewName2[viewName2.length - 1] = viewName2[viewName2.length - 1].substring(0,1).toLowerCase() + viewName2[viewName2.length - 1].substring(1);
            const viewName = viewName2.join("/");
            url = "/";
            route = {
                mode: DecisionRouteMode.Success,
                url: url,
                view: viewName,
            };
            sendData = data;
        }
        else {
            url = target as string;
            route = Routes.searchRoute(url.toString());
            sendData = data;
        }
        
        const hdata : PageHistory= {
            url: url,
            view: route.view,
            args: route.args,
            data: sendData,
        };
        Data.push(DataService.history, hdata);
        return this;
    }
    
    /**
     * ***addHistory*** : Add root path to screen transition history.  
     * It will only be added to the history and will not change the screen.
     * @param {string | number | RouteMap | typeof View} url add history url or RouteMap, View Class
     * @returns {void}
     */
    public static addHistory(target : string | number | RouteMap | typeof View, data?: any) : typeof Transition {
        // @ts-ignore
        return this.historyAdd(target, data);
    }

    /**
     * ***historyClear*** : Clear screen transition history
     * @returns {typeof Transition}
     */
    public static historyClear() : typeof Transition {
        Hook.dispatch(HookNames.TransitionHistoryClear);
        Data.set(DataService.history, []);
        return this;
    }

    /**
     * ***historyPop*** : Go back to the previous screen transition.
     * @returns {typeof Transition}
     */
    public static historyPop() : typeof Transition {
        Hook.dispatch(HookNames.TransitionHistoryPop);
        Data.pop(DataService.history);
        return this;
    }

    /**
     * ***replace*** : Overwrite the screen transition history and move to the specified root path.  
     * @param {string | number} url route path
     * @returns {void}
     */
    public static replace(url : string | number) : void;

    /**
     * ***replace*** : Overwrite the screen transition history and move to the specified root path.  
     * @param {RouteMap} map replace RouteMap class Object
     * @returns {void}
     */
    public static replace(map : RouteMap) : void ;

    /**
     * ***replace*** : Overwrite the screen transition history and move to the specified root path.  
     * @param {typeof View} view View Class
     * @returns {void}
     */
    public static replace(view : typeof View) : void ;

    /**
     * ***replace*** : Overwrite the screen transition history and move to the specified root path.  
     * @param {string | number} url route path
     * @param {any} data Transmission data contents
     * @returns {void}
     */
    public static replace(url : string | number, data: any) : void;

    /**
     * ***replace*** : Overwrite the screen transition history and move to the specified root path.  
     * @param {typeof View} view View Class
     * @param {any} data Transmission data contents
     * @returns {void}
     */
    public static replace(view : typeof View, data: any) : void;

    /**
     * ***replace*** : Overwrites the screen transition history and navigates to the route path of the specified RouteMap class object. 
     * @param {RouteMap} map replace RouteMap class Object
     * @param {Array<string | number>} args request URL argrements
     * @returns {void}
     */
    public static replace(map : RouteMap, args: Array<string | number>) : void ;

    /**
     * ***replace*** : Overwrites the screen transition history and navigates to the route path of the specified RouteMap class object. 
     * @param {RouteMap} map replace RouteMap class Object
     * @param {Array<string | number>} args request URL argrements
     * @param {any} data send data (Name is not entered. Available only when routeType is app.)
     * @returns {void}
     */
    public static replace(map : RouteMap, args: Array<string | number>, data?: any) : void ;

    public static replace(url : string | number | RouteMap | typeof View, send?: any, send2? : any) : void {
        Hook.dispatch(HookNames.TransitionReplace, url);
        this.historyPop();
        if (url instanceof RouteMap) {
            const routeMap = url as RouteMap;
            this.next(routeMap, send, send2);
        }
        else {
            // @ts-ignore
            this.next(url, send);
        }
    }

    /**
     * ***now*** : Get current route path.
     * @returns {string}
     */
    public static now() : string {
        return Routes.getRoute().url;
    }

    /**
     * ***isNext*** : A flag that determines if you have proceeded from the next screen.
     */
    public static get isNext() : boolean {
        return !this.isBack;
    }

    /**
     * ***nowView*** : Get the current View class object if there is one.
     */
    public static get nowView() : View {
        if (Data.get(DataService.beforeView)) return Data.get(DataService.beforeView);
    }

    // rendering....
    public static async rendering (route: DecisionRoute, data? : any) {
        // @ts-ignore
        const MyApp : typeof App = use("app/config/App").MyApp;

        const befView = Data.get(DataService.beforeView);
        if(befView) {
            const res = await befView.handleLeave();
            if (typeof res == "boolean" && res === false) return;

            if (this.isBack) {
                const resBack = await befView.handleLeaveBack();
                if (typeof resBack == "boolean" && resBack === false) return;
            }

            if (this.isNext) {
                const resNext = await befView.handleLeaveNext();
                if (typeof resNext == "boolean" && resNext === false) return;
            }
        }

        this.animationClose(MyApp, befView);

        if (MyApp.delay) await Lib.sleep(MyApp.delay);

        if(route.mode == DecisionRouteMode.Notfound) {
            if (MyApp.notFoundView) {
                if (MyApp.notFoundView instanceof RouteMap) {
                    route.view = MyApp.notFoundView.view;
                }
                else {
                    route.view = MyApp.notFoundView;
                }
                await Transition.renderingOnView(route, data);
            }
            console.error("Page Not found. \"" + route.url + "\"");
            return;
        }

        await Transition.renderingOnView(route, data);
    }

    /**
     * ***bindUI*** : Bind the UI content to the specified virtual DOM class.
     * * Wrapper functions from UI classes.
     * @param {VirtualDom} vdo Bind Virtual Dom
     * @param {string} UIName  UI Name
     * @return {UI}
     */
    public static bindUI(vdo: VirtualDom, UIName : string) : UI;

    /**
     * ***bindUI*** : Bind the UI content to the specified virtual DOM class.
     * * Wrapper functions from UI classes.
     * @param {VirtualDom} vdo Bind Virtual Dom
     * @param {string} UIName  UI Name
     * @param {any} sendData Transmission data contents
     * @return {UI}
     */
    public static bindUI(vdo: VirtualDom, UIName : string, sendData : any) : UI;

    public static bindUI(vdo: VirtualDom, UIName : string, sendData? : any) : UI {
        return UI.bind(vdo, UIName, sendData);
    }

    /**
     * ***appendUI*** : Appends the UI content to the specified virtual DOM class.
     * * Wrapper functions from UI classes.
     * @param {VirtualDom} vdo Append Virtual Dom
     * @param {string} UIName UI name
     * @returns {UI}
     */
    public static appendUI(vdo: VirtualDom, UIName: string) : UI;

    /**
     * ***appendUI*** : Appends the UI content to the specified virtual DOM class.
    * * Wrapper functions from UI classes.
     * @param {VirtualDom} vdo Append Virtual Dom
     * @param {string} UIName UI name
     * @param {any} sendData Transmission data contents
     * @returns {UI}
     */
    public static appendUI(vdo: VirtualDom, UIName: string, sendData : any) : UI;

    public static appendUI(vdo: VirtualDom, UIName: string, sendData? : any) : UI {
        return UI.append(vdo, UIName, sendData);
    }

    /**
     * ***afterBeginUI*** : Appends (=afterbegin) the UI content to the specified virtual DOM class.
     * * Wrapper functions from UI classes.
     * @param {VirtualDom} vdo Append Virtual Dom
     * @param {string} UIName UI name
     * @returns {UI}
     */
    public static afterBeginUI(vdo: VirtualDom, UIName: string) : UI;

    /**
     * ***afterBeginUI*** : Appends (=afterbegin) the UI content to the specified virtual DOM class.
    * * Wrapper functions from UI classes.
     * @param {VirtualDom} vdo Append Virtual Dom
     * @param {string} UIName UI name
     * @param {any} sendData Transmission data contents
     * @returns {UI}
     */
    public static afterBeginUI(vdo: VirtualDom, UIName: string, sendData : any) : UI;

    public static afterBeginUI(vdo: VirtualDom, UIName: string, sendData? : any) : UI {
        return UI.afterBegin(vdo, UIName, sendData);
    }

    private static async renderingOnView(route : DecisionRoute, data?: any) {
        const viewName : string = Lib.getModuleName(route.view + "View");
        const viewPath : string = "app/view/" + Lib.getModulePath(route.view + "View");
        // @ts-ignore
        if(!useExists(viewPath)) throw Error("\"" + viewName + "\" Class file is not found.");
        // @ts-ignore
        const View_ = use(viewPath);
        if (!View_[viewName]) throw Error("\"" + viewName + "\" Class is not exist.");
        const vm : View = new View_[viewName]();
        vm.sendData = data;

        Data.set(DataService.beforeView, vm);

        if(route.args){   
            await vm.handleBefore(...route.args);
        }
        else {
            await vm.handleBefore();
        }

        Hook.dispatch(HookNames.RenderingBefore, route);

        await Transition.__rendering(route, vm);

        Hook.dispatch(HookNames.RenderingAfter, route);
    
        // @ts-ignore
        const MyApp : typeof App = use("app/config/App").MyApp;

        this.animationOpen(MyApp, vm);

        vm.vdo = dom("main article");
        
        if(route.args){   
            await vm.handleRenderBefore(...route.args);
        }
        else {
            await vm.handleRenderBefore();
        }

        // is next page..
        if (Transition.isNext) {
            if(route.args){                    
                await vm.handleNext(...route.args);
            }
            else {
                await vm.handleNext();
            }
        }

        // is back page...
        if (Transition.isBack) {
            if(route.args){                    
                await vm.handleBack(...route.args);
            }
            else {
                await vm.handleBack();
            }
        }

        if(route.args){
            await vm.handle(...route.args);
            await vm.handleRenderAfter(...route.args);
        }
        else{
            await vm.handle();
            await vm.handleRenderAfter();
        }
    }

    public static async __rendering(route : DecisionRoute, context : View){

        if(!context.view) context.view = route.view;

        if(context.template){
            const beforeTemplate : string = Data.get(DataService.beforeTemplate);

            if(beforeTemplate != context.template){
                // Template Rendering...
                Data.set(DataService.beforeTemplate, context.template);
                const template = Template.bind(dom("body"), context.template);
                if (context.handleTemplateChanged) await context.handleTemplateChanged(template);
            }
        }
        else{
            Data.set(DataService.beforeTemplate, null);
        }

        // View Rendering...
        const viewPath = "view/" + context.view;
        let viewHtml : string = "";
        if (View.getHtmlExists(viewPath)) {
            viewHtml = View.getHtml("view/" + context.view);
        }
        else {
            const view = context as View;
            if (view.html) {
                viewHtml = view.html;
            }
        }
        if (!dom("main").length) dom("body").append("<main></main>");
        const main = dom("main");
        const htmlBuffer = Hook.dispatch(HookNames.SetRenderContent, viewHtml);
        if (htmlBuffer) viewHtml = htmlBuffer;
        main.html = "<article>" + viewHtml + "</article>";
        context.vdos = main.childs;

        const beforeHead = Data.get(DataService.beforeHead);
        if (beforeHead != context.head) {
            Data.set(DataService.beforeHead, context.head);
            if (context.head){
                const head = UI.bind(dom("head"), context.head);
                if (context.handleHeadChanged) await context.handleHeadChanged(head);
            }
            else {
                dom("head").html = "";
            }
            this.setDefaultCss();
        }

        const beforeHeader = Data.get(DataService.beforeHeader);
        if (beforeHeader != context.header) {
            Data.set(DataService.beforeHeader, context.header);
            if (context.header){
                const header = UI.bind(dom("header"), context.header);
                if (context.handleHeaderChanged) await context.handleHeaderChanged(header);
            }
            else {
                dom("header").html = "";
            }
        }

        const beforeFooter = Data.get(DataService.beforeFooter);
        if (beforeFooter != context.footer) {
            Data.set(DataService.beforeFooter, context.footer);
            if (context.footer){
                const footer = UI.bind(dom("footer"), context.footer);
                if (context.handleFooterChanged) await context.handleFooterChanged(footer);
            }
            else {
                dom("footer").html = "";
            }
        }
    }

    private static setDefaultCss(){
        if (dom("head").querySelector("link[m=def]").length > 0)  return;
        // @ts-ignore
        let style = use("CORERES/style.css");
        if (!globalThis.webpack) style = "data:text/css;base64," + style;        
        dom("head").afterBegin("<link rel=\"stylesheet\" m=\"def\" href=\"" + style + "\">");
    }

    private static animationOpen(myApp: typeof App, view: View) {
        this.animation(true, myApp, view);
    }

    private static animationClose(myApp: typeof App, view: View) {
        this.animation(false, myApp, view);
    }

    private static animation(mode : boolean, myApp: typeof App, view: View) {

        // @ts-ignore
        if (!view) view = {};

        let close : string;
        if (myApp.animationClassSelector) {
            if (this.isNext) {
                if (myApp.animationClassSelector.next){
                    if (myApp.animationClassSelector.next.close) close = myApp.animationClassSelector.next.close;
                }
            }
            else {
                if (myApp.animationClassSelector.back){
                    if (myApp.animationClassSelector.back.close) close = myApp.animationClassSelector.back.close;
                }
            }
        }
        if (view.animationClassSelector) {
            if (this.isNext) {
                if (view.animationClassSelector.next){
                    if (view.animationClassSelector.next.close) close = view.animationClassSelector.next.close;
                }
            }
            else {
                if (view.animationClassSelector.back){
                    if (view.animationClassSelector.back.close) close = view.animationClassSelector.back.close;
                }
            }
        }
        
        let open : string;
        if (myApp.animationClassSelector) {
            if (this.isNext) {
                if (myApp.animationClassSelector.next){
                    if (myApp.animationClassSelector.next.open) open = myApp.animationClassSelector.next.open;
                }
            }
            else {
                if (myApp.animationClassSelector.back){
                    if (myApp.animationClassSelector.back.open) open = myApp.animationClassSelector.back.open;
                }
            }
        }
        if (view.animationClassSelector) {
            if (this.isNext) {
                if (view.animationClassSelector.next){
                    if (view.animationClassSelector.next.open) open = view.animationClassSelector.next.open;
                }
            }
            else {
                if (view.animationClassSelector.back){
                    if (view.animationClassSelector.back.open) open = view.animationClassSelector.back.open;
                }
            }
        }

        if (mode) {
            // open
            if (close) dom("main article:first-child").removeClass(close);
            if (open) dom("main article:first-child").addClass(open);    
        }
        else {
            // close
            if (close) dom("main article:first-child").addClass(close);
            if (open) dom("main article:first-child").removeClass(open);    
        }
    }
}
