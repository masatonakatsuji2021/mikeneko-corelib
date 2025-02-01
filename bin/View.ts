import { Template } from "Template";
import { Render } from "Render";
import { dom, VirtualDom } from "VirtualDom";
import { UI } from "UI";
import { Lib } from "Lib";
import { App } from "App";
import { Data } from "Data";

/**
 * ***View*** : Main class for each screen.
 */
export class View extends Render {

    protected static type : string = "View";

    /**
     * ***contentHtml`` : If you place HTML content for screen display here, it will be displayed..
     */
    public contentHtml : string;
    
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
     * @returns {Dialog}
     */
    public static append(vdo: VirtualDom) : View;

    /**
     * ***append*** : Appends the View content to the specified virtual DOM class.
     * @param {VirtualDom} vdo Append Virtual Dom
     * @param {string} ViewName View name
     * @returns {Dialog}
     */
    public static append(vdo: VirtualDom, ViewName : string) : View;
    
    /**
     * ***append*** : Appends the View content to the specified virtual DOM class.
     * @param {VirtualDom} vdo Append Virtual Dom
     * @param {string} ViewName View name
     * @param {any} sendData Transmission data contents
     * @returns {Dialog}
     */
    public static append(vdo: VirtualDom, ViewName : string, sendData : any) : View;
    
    public static append(vdo: VirtualDom, ViewName? : string, sendData? : any) : View {
        if(ViewName) ViewName = "view/" + ViewName;
        return super.append(vdo, ViewName, sendData, this) as View;
    }


    /**
     * ***stackOpen*** : Temporarily bring a view to the foreground  
     * If it is displayed using this method, it will not be saved in the history.  
     * If the destination View has a handleLeaveStackClose method, you can get the return value using async/await.
     * @returns {Promise<any>} 
     */
    public static stackOpen() : Promise<any> ;

    /**
     * ***stackOpen*** : Temporarily bring a view to the foreground  
     * If it is displayed using this method, it will not be saved in the history.  
     * If the destination View has a handleLeaveStackClose method, you can get the return value using async/await.
     * @param {Array<any>} aregments
     * @returns {Promise<any>} 
     */
    public static stackOpen(...aregments : Array<any>) : Promise<any> ;

    public static stackOpen(...aregments : Array<any>) {

        return new Promise(async (resolve) => {

            const view = new this();

            const MyApp : typeof App = use("app/config/App").MyApp;
            
            if (MyApp.animationCloseClassName) dom("main").addClass(MyApp.animationCloseClassName);
            if (MyApp.animationOpenClassName) dom("main").removeClass(MyApp.animationOpenClassName);

            if (MyApp.delay) await Lib.sleep(MyApp.delay);

            const article = VirtualDom.create(this.getHtml(), "article");
            const main = dom("main");
            main.append(article);
            view.vdo = article;
            view.vdos = main.childs;

            Data.set("backHandle", async ()=>{

                if (MyApp.animationCloseClassName) dom("main").addClass(MyApp.animationCloseClassName);
                if (MyApp.animationOpenClassName) dom("main").removeClass(MyApp.animationOpenClassName);
        
                if (MyApp.delay) await Lib.sleep(MyApp.delay);

                dom("main article:last-child").remove();

                if (MyApp.animationCloseClassName) dom("main").removeClass(MyApp.animationCloseClassName);
                if (MyApp.animationOpenClassName) dom("main").addClass(MyApp.animationOpenClassName);

                const output = await view.handleLeaveStackClose();

                resolve(output);
            });

            if (MyApp.animationCloseClassName) dom("main").removeClass(MyApp.animationCloseClassName);
            if (MyApp.animationOpenClassName) dom("main").addClass(MyApp.animationOpenClassName);

            if (aregments) {
                await view.handle(...aregments);
            }
            else {
                await view.handle();
            }
        });
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
     * ***handleBegin*** : A handler executed just before transitioning to the page.
     */
    public handleBegin() : void | Promise<void> {}

    /**
     * ***handleBefore*** : A handler executed just before transitioning to the page.
     */
    public handleBefore(beginStatus? : boolean) : void | Promise<void> {}
    
    /**
     * ***handleAfter*** : A handler executed immediately after transitioning to the page
     */
    public handleAfter(beginStatus? : boolean) : void | Promise<void> {}

    /**
     * ***handleRenderBefore*** : A handler executed immediately after page transition and rendering process to the screen is completed
     */
    public handleRenderBefore(beginStatus? : boolean) : void | Promise<void> {}

    /**
     * ***handleRenderAfter*** : A handler that is executed after page transition, after rendering process to the screen is completed, 
     * and after the event for each action is completed.
     */
    public handleRenderAfter(beginStatus? : boolean) :void | Promise<void> {}

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
    public handleLeaveStackClose() : Promise<void | any> { return; }
}