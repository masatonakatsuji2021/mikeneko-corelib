import { Template } from "Template";
import { UI } from "UI";
import { VirtualDom, VirtualDomList } from "VirtualDom";

/**
 * ***Controller*** : Main class for each screen.  
 * handlers for multiple screens can be managed collectively using public methods.
 * @deprecated This class is deprecated. Please use the View class.
 */
export class Controller {

    /**
     * ***myMjs*** : Virtual Dom for content.
     * @deprecated This functionality is migrated to the member variable ``vdo``.
     */
    public get myMjs() : VirtualDom {
        return this.vdo;
    }

    /**
     * ***mjs**** : Virtual DOM List of VirtualDom Classes.
     * @deprecated This functionality is migrated to the member variable ``vdo``.
     */
    public get mjs() : VirtualDomList {
        return this.vdos;
    } 

    /**
     * ***vdo*** : Virtual Dom for content.
     */
    public vdo : VirtualDom;
    /**
     * ***vdos*** : Virtual DOM List of VirtualDom Classes.
     */
    public vdos : VirtualDomList;

    /**
     * ***sendData*** : 
     */
    public sendData: any;

    /**
     * ***beginStatus*** : 
     */
    public beginStatus : boolean = false;

    /**
     * ***view*** : Change the view name to be displayed.  
     * If not specified, the "rendering/View/{ControllerName}/{ActionName}.html" file will be displayed as the HTML source by default.
     */
    public view : string = null;

    /**
     * ***template*** : If you have a template HTML file, specify it here.
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
     * ***handleBefore*** : A handler executed just before transitioning to the page.
     */
    public handleBefore() : void | Promise<void> { }

    /**
     * ***handleAfter*** : A handler executed immediately after transitioning to the page
     */
    public handleAfter() : void | Promise<void> {}

    /**
     * ***handleRenderBefore*** : A handler executed immediately after page transition and rendering process to the screen is completed
     */
    public handleRenderBefore() : void | Promise<void> {}

    /**
     * ***handleRenderAfter*** : A handler that is executed after page transition, after rendering process to the screen is completed, 
     * and after the event for each action is completed.
     */
    public handleRenderAfter() : void | Promise<void> {}

    /**
     * ***handleLeave*** : A handler executed when leaving the page
     * @param {string} action before access controller action name
     */
    public handleLeave(action? : string) : void | boolean | Promise<void> | Promise<boolean> {}

    /**
     * ***handleLeaveBack*** : Handler that is executed when returning to the previous screen.
     * @param {string} action before access controller action name
     */
    public handleLeaveBack(action? : string) : void | boolean | Promise<void> | Promise<boolean> {}

    /**
     * ***handleLeaveNext*** : Handler that runs when proceeding to the next screen
     * @param {string} action before access controller action name
     */
    public handleLeaveNext(action? : string) : void | boolean | Promise<void> | Promise<boolean> {}

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
}