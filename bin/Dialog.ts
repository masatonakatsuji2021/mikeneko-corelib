import { Render } from "Render";
import { Lib } from "Lib";
import { VirtualDom, dom } from "VirtualDom";
import { Data } from "Data";

/**
 * ***DialogOption*** : Option settings when the dialog is displayed
 */
export interface DialogOption {

    name? : string,

    /**
     * ***handle*** : Dialog opening event handler
     * @param {Dialog} dialog Dialog Class
     * @returns {void}
     */
    handle? : (dialog : Dialog) => void,

    /**
     * ***class*** : The class attribute name to add to the dialog tag.
     */
    class? : Array<string> | string,

    /**
     * ***sendData*** : Transmission data contents.
     */
    sendData?: any,


    html? : string,
}

/**
 * ***Dialog*** : A class for displaying or manipulating a dialog screen.
 */
export class Dialog extends Render {

    protected static type : string = "Dialog";

    private static __cssDom : VirtualDom;
    
    public static __dialogBuffers : Array<Dialog> = [];

    /**
     * ***handle*** : An event handler that runs when the dialog is opened.
     * @param {any} _sendData 
     * @returns {void}
     */
    public handle(_sendData?: any) : void {}

    /**
     * ***handleClose*** : Handler executed when the dialog is closed.
     * @returns {void}
     */
    public handleClose() : void {}

    /**
     * ***close*** : Method for closing the dialog.
     */
    public close() {
        this.vdo.removeClass("open");
        this.handleClose();
        setTimeout(() => {
            this.vdo.remove();
            for(let n = 0 ; n < Dialog.__dialogBuffers.length ; n++) {
                if (Dialog.__dialogBuffers[n] == this) Dialog.__dialogBuffers.splice(n, 1);
            }
            if (!Dialog.__dialogBuffers.length) {
                Dialog.__cssDom.remove();
                Dialog.__cssDom = null;
            }
        }, 300);
    }

    /**
     * ***forceClose*** : Forces all open dialogs to close.
     */
    public static forceClose() {
        for(let n = 0 ; n < Dialog.__dialogBuffers.length ; n++) {
            const dialog = Dialog.__dialogBuffers[n];
            dialog.close();
        }
        Dialog.__dialogBuffers = [];
    }
    
    /**
     * ***bind*** : Bind the Dialog content to the specified virtual DOM class.
     * @param {VirtualDom} vdo Bind Virtual Dom
     * @returns {View}
     */
    public static bind(vdo: VirtualDom) : Dialog;

    /**
     * ***bind*** : Bind the Dialog content to the specified virtual DOM class.
     * @param {VirtualDom} vdo Bind Virtual Dom
     * @param {string} dialogName Dialog Name
     * @returns {Dialog}
     */
    public static bind(vdo: VirtualDom, dialogName : string) : Dialog;

    /**
     * ***bind*** : Bind the Dialog content to the specified virtual DOM class.
     * @param {VirtualDom} vdo Bind Virtual Dom
     * @param {string} dialogName Dialog Name
     * @param {any} sendData Transmission data contents
     * @returns {Dialog}
     */
    public static bind(vdo: VirtualDom, dialogName : string, sendData : any) : Dialog;

    public static bind(vdo: VirtualDom, dialogName? : string, sendData? : any) : Dialog {
        if(dialogName) dialogName = "dialog/" + dialogName;
        return super.bind(vdo, dialogName, sendData, this) as Dialog;
    }

    /**
     * ***append*** : Appends the Dialog content to the specified virtual DOM class.
     * @param {VirtualDom} vdo Append Virtual Dom
     * @returns {Dialog}
     */
    public static append(vdo: VirtualDom) : Dialog;

    /**
     * ***append*** : Appends the Dialog content to the specified virtual DOM class.
     * @param {VirtualDom} vdo Append Virtual Dom
     * @param {string} dialogName Dialog name
     * @returns {Dialog}
     */
    public static append(vdo: VirtualDom, dialogName : string) : Dialog;
    
    /**
     * ***append*** : Appends the Dialog content to the specified virtual DOM class.
     * @param {VirtualDom} vdo Append Virtual Dom
     * @param {string} dialogName Dialog name
     * @param {any} sendData Transmission data contents
     * @returns {Dialog}
     */
    public static append(vdo: VirtualDom, dialogName : string, sendData : any) : Dialog;
    
    public static append(vdo: VirtualDom, dialogName? : string, sendData? : any) : Dialog {
        if(dialogName) dialogName = "dialog/" + dialogName;
        return super.append(vdo, dialogName, sendData, this) as Dialog;
    }

    /**
     * ***show*** : Displays the specified dialog.
     * @returns {Dialog}
     */
    public static show() : Dialog;

    /**
     * ***show*** : Displays the specified dialog.
     * @param {DialogOption} option dialog options
     * @returns {Dialog}
     */
    public static show(option : DialogOption) : Dialog;

    /**
     * ***show*** : Displays the specified dialog.
     * @param {string} dialogName Dialog Name
     * @returns {Dialog}
     */
    public static show(dialogName: string) : Dialog;

    /**
     * ***show*** : Displays the specified dialog.
     * @param {string} dialogName Dialog Name
     * @param {DialogOption} option dialog options
     * @returns {Dialog}
     */
    public static show(dialogName: string, option : DialogOption) : Dialog;

    public static show(..._ : any) : Dialog {
        let option : DialogOption = {};
        let dialogName: string;
        if (_ != undefined) {
            if (_[0]) {
                if (_[1]) {
                    dialogName = _[0] as string;
                    option = _[1] as DialogOption;
                }
                else {
                    if (typeof _[0] == "string") {
                        dialogName = _[0] as string;
                    }
                    else {
                        option = _[0];
                    }
                }
            }    
        }

        if (dialogName) dialogName = "dialog/" + dialogName;
        if (!option) option = {};

        Dialog.openDialogStyleSheet();

        const dialogVdo = VirtualDom.create("", "dialog");
        const dialog : Dialog = this.loadClass(dialogVdo, dialogName, this);
        if (option.html) dialog.html = option.html;
        if (dialog.html) {
            dialogVdo.html = "<dwindow>" + dialog.html + "</dwindow>";
        }
        else {
            dialogVdo.html = "<dwindow>" + this.getHtml(dialogName) + "</dwindow>";
        }
        
        if (option.class) {
            if (typeof option.class == "string") option.class = [ option.class ];
            option.class.forEach((c) => {
                dialogVdo.addClass(c);
            });
        }

        dom("body").append(dialogVdo, true);
        dialogVdo.reload();
        setTimeout(()=>{
            dialogVdo.addClass("open");
        }, 100);
        if (dialog.handle) dialog.handle(option.sendData);
        Dialog.__dialogBuffers.push(dialog);
        Data.push("backHandle", ()=>{
            if (Dialog.__dialogBuffers.length) {
                const dialog = Dialog.__dialogBuffers.pop();
                dialog.close();
            }
        });
        if (option.handle) option.handle(dialog);
        return dialog;
    }

    /**
     * ***show*** : Displays the specified dialog.
     * @returns 
     */
    public show() : Dialog;

    /**
     * ***show*** : Displays the specified dialog.
     * @param {any} sendData send data 
     * @returns 
     */
    public show(sendData? : any) : Dialog {
        const dialogVdo = VirtualDom.create("", "dialog");
        if (this.html) dialogVdo.html = "<dwindow>" + this.html + "</dwindow>";
        dom("body").append(dialogVdo, true);
        dialogVdo.reload();

        Dialog.openDialogStyleSheet();

        this.vdo = dialogVdo;
        this.vdos = dialogVdo.childs;
        setTimeout(()=>{
            dialogVdo.addClass("open");
        }, 100);
        if (this.handle) this.handle(sendData);
        Dialog.__dialogBuffers.push(this);
        Data.push("backHandle", ()=>{
            if (Dialog.__dialogBuffers.length) {
                const dialog = Dialog.__dialogBuffers.pop();
                dialog.close();
            }
        });
        return this;
    }

    public static openDialogStyleSheet(){
        if (Dialog.__cssDom) return;
        const link = VirtualDom.create("", "link");
        link.attr("rel", "stylesheet");
        link.href = "data:text/css;base64," + use("CORERES/dialog/style.css");
        dom("head").afterBegin(link);
        Dialog.__cssDom = link;
    }
}