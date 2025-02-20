import { App, AppRouteType } from "App";
import { Routes, DecisionRoute, DecisionRouteMode } from "Routes";
import { Lib } from "Lib";
import { Data } from "Data";
import { Controller } from "Controller";
import { View } from "View";
import { Template } from "Template";
import { UI } from "UI";
import { dom, VirtualDom} from "VirtualDom";
import { RouteMap } from "RouteMap";

export interface PageHistory {

    url: string | number,

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
        
        if (Data.getLength("backHandle")) {
            const backHandle = Data.pop("backHandle");
            backHandle();
            this.isBack = false;
            return true;
        }

        let hdata : PageHistory;
        for (let n = 0 ; n < index ; n++) {
            if (this.routeType == AppRouteType.application) {
                if (Data.getLength("history") == 1) return false;
                Data.pop("history");
                hdata= Data.now("history");
            }
            else if(this.routeType == AppRouteType.web) {
                history.back();
            }    
        }

        if(this.routeType == AppRouteType.web) return true;
       
        const route : DecisionRoute = Routes.searchRoute(hdata.url.toString());
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
     * ***move*** : Transitions to the specified RouteMap object.
     * @param {RouteMap} map RouteMap Class Object
     * @param {Array<string | number>} args request URL argrements
     * @returns {void}
     */
    public static move(map : RouteMap, args: Array<string | number>) : void;

    /**
     * ***move*** : Transitions to the specified RouteMap object.
     * @param {RouteMap} map RouteMap Class Object
     * @param {Array<string | number>} args request URL argrements
     * @param {any} data send data (Name is not entered. Available only when routeType is app.)
     * @returns {void}
     */
    public static move(map : RouteMap, args: Array<string | number>, data: any) : void;

    public static move(map : RouteMap, args?: Array<string | number>, data?: any)  : void {
        if (Transition.lock) return;
        let url = map.url;
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
     * ***next*** : Transition to the specified RouteMap class routing.  
     * It cannot be used if screen transitions are disabled by lock, etc.  
     * @param {RouteMap} map RouteMap Class Object
     * @param {Array<string | number>} args request URL argrements
     * @param {any} data send data (Name is not entered. Available only when routeType is app.)
    * @returns {void}
     */
    public static next(map : RouteMap, args: Array<string | number>, data : any) : void;

    public static next(url : string | number | RouteMap, data? : any, data2? : any) : void {
        if (Transition.lock) return;
        this.isBack = false;
        if (url instanceof RouteMap) return this.move(url, data, data2);
        const hdata : PageHistory= {
            url: url,
            data: data,
        };
        Data.push("history", hdata);
        const route : DecisionRoute = Routes.searchRoute(url.toString());

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
     * ***stack*** : Temporarily bring the specified RouteMap View to the foreground.  
     * If it is displayed using this method, it will not be saved in the history.  
     * If the destination View has a **handleLeaveStackClose** method, you can use async/await to capture the return value.
     * @param {RouteMap} map RouteMap Class Object
     * @param {any} data send data
     * @returns {Promise<any>} 
     */
    public static async stack(map: RouteMap, data: any) : Promise<any> ;

    public static async stack(map: RouteMap, data?: any) : Promise<any> {

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

        this.isBack = true;

        if (Data.getLength("backHandle")) {
            const backHandle = Data.pop("backHandle");
            backHandle(result);
            this.isBack = false;
        }
    }

    /**
     * ***historyAdd*** : Add root path to screen transition history.  
     * It will only be added to the history and will not change the screen.
     * @param {string | number} url route path
     * @returns {Transition}
     */
    public static historyAdd(url : string | number) : Transition;

    /**
     * ***historyAdd*** : Added RouteMap class object to screen transition history.  
     * It will only be added to the history and will not change the screen.
     * @param {string} map RouteMap Class Object
     * @returns {Transition}
     */
    public static historyAdd(map : RouteMap) : Transition;

    /**
     * ***historyAdd*** : Add root path to screen transition history.  
     * It will only be added to the history and will not change the screen.
     * @param {string} map RouteMap Class Object
     * @param {any} data send data
     * @returns {Transition}
     */
    public static historyAdd(url : string | number, data: any) : Transition;

    /**
     * ***historyAdd*** : Added RouteMap class object to screen transition history.  
     * It will only be added to the history and will not change the screen.
     * @param {RouteMap} map RouteMap Class Object
     * @param {Array<string | number>} args request URL argrements
     * @returns {Transition}
     */
    public static historyAdd(map : RouteMap, args: Array<string | number>) : Transition;

    /**
     * ***historyAdd*** : Added RouteMap class object to screen transition history.  
     * It will only be added to the history and will not change the screen.
     * @param {RouteMap} map RouteMap Class Object
     * @param {Array<string | number>} args request URL argrements
     * @param {any} data send data
     * @returns {Transition}
     */
    public static historyAdd(map : RouteMap, args: Array<string | number>, data: any) : Transition ;

    public static historyAdd(urlOrMap : string | number | RouteMap, data?: any, data2? : any) : Transition {
        if (Transition.lock) return;
        this.isBack = false;
        let url : string;
        let sendData : any;
        if (urlOrMap instanceof RouteMap) {
            const map = urlOrMap as RouteMap;
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
            sendData = data2;
        }
        else {
            url = urlOrMap as string;
            sendData = data;
        }
        
        const hdata : PageHistory= {
            url: url,
            data: sendData,
        };
        Data.push("history", hdata);
        return this;
    }
    
    /**
     * ***addHistory*** : Add root path to screen transition history.  
     * It will only be added to the history and will not change the screen.
     * @param {string} url route path
     * @returns {void}
     */
    public static addHistory(url : string, data?: any) {
        return this.historyAdd(url, data);
    }

    /**
     * ***historyClear*** : Clear screen transition history
     * @returns {void}
     */
    public static historyClear() : void {
        Data.set("history", []);
    }

    /**
     * ***historyPop*** : Go back to the previous screen transition.
     * @returns {void}
     */
    public static historyPop() : void {
        Data.pop("history");
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
     * @param {string | number} url route path
     * @param {any} data Transmission data contents
     * @returns {void}
     */
    public static replace(url : string | number, data: any) : void;

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

    public static replace(url : string | number | RouteMap, send?: any, send2? : any) : void {
        this.historyPop();
        if (url instanceof RouteMap) {
            this.next(url, send, send2);
        }
        else {
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
        if (Data.get("beforeView")) return Data.get("beforeView");
    }
    
    /**
     * ***nowController*** : Get the current Controller class object if there is one.
     * @deprecated The Controller class has been deprecated.
     */
    public static get nowController() : Controller {
        if (Data.get("beforeController")) return Data.get("beforeController");
    }

    // rendering....
    public static async rendering (route: DecisionRoute, data? : any) {
        // @ts-ignore
        const MyApp : typeof App = use("app/config/App").MyApp;

        // Controller & View Leave 
        const befCont : Controller = Data.get("beforeController");
        if(befCont){
            const befContAction = Data.get("beforeControllerAction");
            const res = await befCont.handleLeave(befContAction);
            if (typeof res == "boolean" && res === false) return;

            if (this.isBack) {
                const resBack = await befCont.handleLeaveBack(befContAction);
                if (typeof resBack == "boolean" && resBack === false) return;
            }

            if (this.isNext) {
                const resNext = await befCont.handleLeaveNext(befContAction);
                if (typeof resNext == "boolean" && resNext === false) return;
            }
        }

        const befView = Data.get("beforeView");
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

        if(route.controller){
            await Transition.renderingOnController(route, data);
        }
        else if(route.view){
            await Transition.renderingOnView(route, data);
        }
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

    private static async renderingOnController(route : DecisionRoute, data?: any) {
        const controllerName : string = Lib.getModuleName(route.controller + "Controller");
        const controllerPath : string = "app/controller/" + Lib.getModulePath(route.controller + "Controller");
        // @ts-ignore
        if(!useExists(controllerPath)){
            throw("\"" + controllerPath + "\" Class is not found.");
        }
        // @ts-ignore
        const controllerClass = use(controllerPath);
        const cont : Controller = new controllerClass[controllerName]();
        cont.sendData = data;

        const viewName = route.action + "View";
        const viewPath : string = "app/view/" + route.controller + "/" + Lib.getModulePath(viewName);

        let vw : View; 
        // @ts-ignore
        if(useExists(viewPath)){
            // @ts-ignore
            const View_ = use(viewPath);
            if (!View_[Lib.getModuleName(viewName)]) {
                console.error("[WARM] \"" + Lib.getModuleName(viewName) + "\"View Class not exists.");
            }
            else {
                vw = new View_[Lib.getModuleName(viewName)]();
                vw.sendData = data;
            }
        }

        if(Data.get("beforeControllerPath")  != controllerPath){
            Data.set("beforeControllerPath", controllerPath);
            cont.beginStatus = true;
        }

        Data.set("beforeController", cont);
        Data.set("beforeControllerAction", route.action);
        Data.set("beforeView", null);
        Data.set("childClasss", {});
        
        if(cont["before_" + route.action]){
            const method : string = "before_" + route.action;
            if(route.args){
                await cont[method](...route.args);
            }
            else{
                await cont[method]();
            }
        }

        await Transition.__rendering(route, cont);

        if(cont[route.action]){
            const method : string = route.action;
            if(route.args){
                await cont[method](...route.args);
            }
            else{
                await cont[method]();
            }
        }

        if(vw){
            if(route.args){
                await vw.handle(...route.args);
            }
            else{
                await vw.handle();
            }
        }
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

        Data.set("beforeView", vm);
        Data.set("beforeController", null);
        Data.set("beforeControllerPath", null);
        Data.set("beforeControllerAction", null);
        Data.set("childClasss",  {});

        if(route.args){   
            await vm.handleBefore(...route.args);
        }
        else {
            await vm.handleBefore();
        }

        await Transition.__rendering(route, vm);
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

    public static async __rendering(route : DecisionRoute, context : Controller | View){

        if(!context.view){
            if(route.controller){
                context.view = route.controller + "/" + route.action;
            }
            else if(route.view){
                context.view = route.view;
            }
        }

        if(context.template){
            const beforeTemplate : string = Data.get("beforeTemplate");

            if(beforeTemplate != context.template){
                // Template Rendering...
                Data.set("beforeTemplate", context.template);
                const template = Template.bind(dom("body"), context.template);
                if (context.handleTemplateChanged) await context.handleTemplateChanged(template);
            }
        }
        else{
            Data.set("beforeTemplate", null);
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
        main.html = "<article>" + viewHtml + "</article>";
        context.vdos = main.childs;

        const beforeHead = Data.get("beforeHead");
        if (beforeHead != context.head) {
            Data.set("beforeHead", context.head);
            if (context.head){
                const head = UI.bind(dom("head"), context.head);
                if (context.handleHeadChanged) await context.handleHeadChanged(head);
            }
            else {
                dom("head").html = "";
            }
            this.setDefaultCss();
        }

        const beforeHeader = Data.get("beforeHeader");
        if (beforeHeader != context.header) {
            Data.set("beforeHeader", context.header);
            if (context.header){
                const header = UI.bind(dom("header"), context.header);
                if (context.handleHeaderChanged) await context.handleHeaderChanged(header);
            }
            else {
                dom("header").html = "";
            }
        }

        const beforeFooter = Data.get("beforeFooter");
        if (beforeFooter != context.footer) {
            Data.set("beforeFooter", context.footer);
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