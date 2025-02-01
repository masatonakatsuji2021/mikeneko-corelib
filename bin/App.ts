import { RouteMap, RouteMaps } from "RouteMap";

export interface Routes {
    [url : string] : string | Routes | Function,
}

export enum AppRouteType {
    /** 
     * ***web*** : This mode corresponds to screen transitions on the browser.  
     * You can use the back or forward buttons on your browser. 
     */
    web = "web",

    /**
     * ***application*** : Modes for mobile and desktop apps.
     */
    application = "application",
}

/**
 * ***App*** : Class for initial settings of the application.
 */
export class App {

    /**
     * ***appName** : Name of the application
     */
    public static appName : string;

    /**
     * ***routeType*** : Method for page transition.  
     * - **application** : A mode for building apps. Screen transition history is managed and operated by the app.
     * - **web** : Change the browser URL and move to the page. You can go back by pressing the back button on the browser.  
     */
    public static routeType : AppRouteType = AppRouteType.web;

    /**
     * ***notFoundView*** :  
     * The view to display when accessing a URL that is not set in the routing.
     */
    public static notFoundView : string;

    /**
     * ***begin*** : 
     * Specify the URL or RouteMap class object of the screen to open immediately after launching the app. 
     */
    public static begin : string | RouteMap;

    /**
     * ***routes*** : Routing Settings.  
     * Enter the View or Controller name to be applied to the route path (URL) as shown below.  
     * (If there is no ``c:`` or ``a:`` description, it is the View class name.)
     * ```typescript
     * public static routes : Routes = {
     *    "/" : "home",
     *    "/page1": "page1",
     *    "/page2": "page2",
     *    "/page3": {
     *       "/" : "c: page3, a: index",            // <= The index method of Page3Controller
     *       "/edit" : "c: page3, a: edit",         // <= The edit method of Page3Controller
     *    },
     *    ....
     * };
     * ```
     */
    public static routes: Routes;

    /**
     * ***maps*** : Specify the route map list for each screen and the view used here.
     * (It is intended as a successor to the ``routes`` member variable for routing.)
     */
    public static maps: RouteMaps;

    /**
     * ***backgrounds*** : Background class list to run.  
     * Each background class is listed in the order in which it will run.
     * ```typescript
     * public static backgrounds : Array<string> = [
     *    "Sample1",
     *    "Sample2",
     *    ...
     * ];     * 
     */
    public static backgrounds: Array<string>;

    /**
     * ***sessionStorage*** : SessionStorage Identifier
     */
    public static sessionStorage : string;

    /**
     * ***localStorage*** : LocalStorage Identifiers
     */
    public static localStorage : string;

    /**
     * ***delay*** : Specify the delay time for screen transitions.  
     * Default is 100 (ms).  
     * If you specify 0, the button will transition immediately without executing the animation when pressed.
     */
    public static delay : number = 100;

    /**
     * ***animationOpenClassName*** : Class attribute name when opening a page with animation.
     * ```typescript
     * public static animationOpenClassName : string = "open";
     * ```
     */
    public static animationOpenClassName : string;

    /**
     * ***animationCloseClassName*** : Class attribute name when closing a page with animation.
     * ```typescript
     * public static animationCloseClassName : string = "close";
     * ```
     */
    public static animationCloseClassName : string;
}