import { Template } from "Template";
import { Render } from "Render";
import { dom, VirtualDom } from "VirtualDom";
import { UI } from "UI";
import { Lib } from "Lib";
import { App, AnimationClassSelector } from "App";
import { Data } from "Data";

/**
 * ***View*** : Main class for each screen.
 */
export class View extends Render {

    protected static type : string = "View";
    
    /**
     * ***bind*** : Bind the View content to the specified virtual DOM class.
     * @param {VirtualDom} vdo Bind Virtual Dom
     * @returns {View}
     */
    public static bind(vdo: VirtualDom) : View;

    /**
     * ***bind*** : Bind the View content to the specified virtual DOM class.
     * @param {VirtualDom} vdo Bind Virtual Dom
     * @param {string} ViewName View Name
     * @returns {View}
     */
    public static bind(vdo: VirtualDom, ViewName : string) : View;

    /**
     * ***bind*** : Bind the View content to the specified virtual DOM class.
     * @param {VirtualDom} vdo Bind Virtual Dom
     * @param {string} ViewName View Name
     * @param {any} sendData Transmission data contents
     * @returns {View}
     */
    public static bind(vdo: VirtualDom, ViewName : string, sendData : any) : View;

    public static bind(vdo: VirtualDom, ViewName? : string, sendData? : any) : View {
        if(ViewName) ViewName = "view/" + ViewName;
        return super.bind(vdo, ViewName, sendData, this) as View;
    }

    /**
     * ***append*** : Appends the View content to the specified virtual DOM class.
     * @param {VirtualDom} vdo Append Virtual Dom
     * @returns {View}
     */
    public static append(vdo: VirtualDom) : View;

    /**
     * ***append*** : Appends the View content to the specified virtual DOM class.
     * @param {VirtualDom} vdo Append Virtual Dom
     * @param {string} ViewName View name
     * @returns {View}
     */
    public static append(vdo: VirtualDom, ViewName : string) : View;
    
    /**
     * ***append*** : Appends the View content to the specified virtual DOM class.
     * @param {VirtualDom} vdo Append Virtual Dom
     * @param {string} ViewName View name
     * @param {any} sendData Transmission data contents
     * @returns {View}
     */
    public static append(vdo: VirtualDom, ViewName : string, sendData : any) : View;
    
    public static append(vdo: VirtualDom, ViewName? : string, sendData? : any) : View {
        if(ViewName) ViewName = "view/" + ViewName;
        return super.append(vdo, ViewName, sendData, this) as View;
    }


    /**
     * ***stackOpen*** : Temporarily bring a view to the foreground  
     * If it is displayed using this method, it will not be saved in the history.  
     * If the destination View has a **handleLeaveStackClose** method, you can get the return value using async/await.
     * @returns {Promise<any>} 
     */
    public static stackOpen() : Promise<any> ;

    /**
     * ***stackOpen*** : Temporarily bring a view to the foreground  
     * If it is displayed using this method, it will not be saved in the history.  
     * If the destination View has a handleLeaveStackClose method, you can get the return value using async/await.
     * @param {any} data send data
     * @returns {Promise<any>} 
     */
    public static stackOpen(data : any) : Promise<any> ;

    public static stackOpen(data? : any) {

        return new Promise(async (resolve) => {

            const view = new this();

            const MyApp : typeof App = use("app/config/App").MyApp;

            const article = VirtualDom.create(this.getHtml(), "article");
            const main = dom("main");
            main.append(article);
            view.vdo = article;
            view.vdos = main.childs;

            this.animationStackOpen(MyApp, view);

            Data.push("backHandle", async (value)=>{

                this.animationStackClose(MyApp, view);

                let output = await view.handleLeaveStackClose();
                if (value) output = value;

                resolve(output);
        
                if (MyApp.delay) await Lib.sleep(MyApp.delay);

                dom("main article:last-child").remove();
            });

            if (data) {
                await view.handle(data);
            }
            else {
                await view.handle();
            }
        });
    }
    
    private static animationStackOpen(myApp: typeof App, view : View) {
        this.animationStack(true, myApp, view);
    }
    
    private static animationStackClose(myApp: typeof App, view : View) {
        this.animationStack(false, myApp, view);
    }

    private static animationStack(mode : boolean, myApp: typeof App, view: View) {
        // @ts-ignore
        if (!view) view = {};

        let close : string;
        if (myApp.animationClassSelector) {
            if (myApp.animationClassSelector.stack){
                if (myApp.animationClassSelector.stack.close) close = myApp.animationClassSelector.stack.close;
            }
        }
        if (view.animationClassSelector) {
            if (view.animationClassSelector.stack){
                if (view.animationClassSelector.stack.close) close = view.animationClassSelector.stack.close;
            }
        }
        
        let open : string;
        if (myApp.animationClassSelector) {
            if (myApp.animationClassSelector.stack){
                if (myApp.animationClassSelector.stack.open) open = myApp.animationClassSelector.stack.open;
            }
        }
        if (view.animationClassSelector) {
            if (view.animationClassSelector.stack){
                if (view.animationClassSelector.stack.open) open = view.animationClassSelector.stack.open;
            }
        }

        if (mode) {
            // open
            if (close) dom("main article:last-child").removeClass(close);
            if (open) dom("main article:last-child").addClass(open);    
        }
        else {
            // close
            if (close) dom("main article:last-child").addClass(close);
            if (open) dom("main article:last-child").removeClass(open);    
        }
    }

    /**
     * ***beginStatus*** : 
     */
    public beginStatus : boolean = false;
    
    /**
     * ***view*** : Change the view name to be displayed.  
     * If not specified, the "rendering/View/{viewName}.html" file will be displayed as the HTML source by default.
     */
    public view : string = null;

    /**
     * ***template*** : 
     * If you have a template HTML file, specify it here.
     */
    public template : string = null;

    /**
     * ***head*** : If there is a UI to set in the head tag, you can specify it.  
     */
    public head : string;

    /**
     * ***header*** : If there is a UI to set in the header tag, you can specify it.  
     */
    public header : string;

    /**
     * ***footer*** : If there is a UI to set in the footer tag, you can specify it.  
     */
    public footer : string;

    /**
     * ***handle*** : 
     * A handler that runs automatically when the view is drawn on the screen.  
     * This event is executed only when rendered.
     */
    public handle(...aregment : Array<string | number>) : void{}

    /**
     * handleNext
     * A handler that runs automatically when the screen is painted after advancing from the previous screen.
     */
    public handleNext(...aregment : Array<string | number>) : void{}

    /**
     * handleBack
     * A handler that runs automatically when painting after returning from the previous screen.
     */
    public handleBack(...aregment : Array<string | number>) :void {}

    /**
     * ***handleAlways*** : A handler that runs automatically when the View is displayed on screen.  
     * This event is always executed even if the same View has already been rendered..
     */
    public handleAlways() : void | Promise<void> {}

    /**
     * ***handleBefore*** : A handler executed just before transitioning to the page.
     */
    public handleBefore(...aregment : Array<string | number>) : void | Promise<void> {}

    /**
     * ***handleRenderBefore*** : A handler executed immediately after page transition and rendering process to the screen is completed
     */
    public handleRenderBefore(...aregment : Array<string | number>) : void | Promise<void> {}

    /**
     * ***handleRenderAfter*** : A handler that is executed after page transition, after rendering process to the screen is completed, 
     * and after the event for each action is completed.
     */
    public handleRenderAfter(...aregment : Array<string | number>) :void | Promise<void> {}

    /**
     * ***handleLeave*** : A handler executed when leaving the page.
     */
    public handleLeave() : void | boolean | Promise<void> | Promise<boolean> {}

    /**
     * ***handleLeaveBack*** : Handler that is executed when returning to the previous screen.
     */
    public handleLeaveBack() : void | boolean | Promise<void> | Promise<boolean> {}

    /**
     * ***handleLeaveNext*** : Handler that runs when proceeding to the next screen
     */
    public handleLeaveNext() : void | boolean | Promise<void> | Promise<boolean> {}

    /**
     * ***handleTemplateChanged*** : A handler that runs when the template specified in the member variable template changes.
     */
    public handleTemplateChanged(template? : Template) : void | Promise<void> {}

    /**
     * ***handleHeadChanged*** : A handler that runs when the template specified in the member variable head tag changes.
     */
    public handleHeadChanged(head? : UI) : void | Promise<void> {}

    /**
     * ***handleHeaderChanged*** : A handler that runs when the template specified in the member variable header tag changes.
     */
    public handleHeaderChanged(header? : UI) : void | Promise<void> {}
    
    /**
     * ***handleFooterChanged*** : A handler that runs when the template specified in the member variable footer tag changes.
     */
    public handleFooterChanged(footer? : UI) : void | Promise<void> {}

    /**
     * ***handleLeaveStackClose*** : Handler that is executed when the screen is removed after being temporarily displayed foreground using stackOpen  
     * @returns 
     */
    public handleLeaveStackClose() : Promise<void | any> | void | any { }

    /**
     * ***animationClassSelector*** : Set the operation of class attribute values ​​for CSS animation during screen transitions.  
     * Set the class attribute value to be specified on the screen when moving forward, backward, or stacking.  
     * Specify animation properties for class attributes set on the style sheet.
     */
    public animationClassSelector : AnimationClassSelector;
}