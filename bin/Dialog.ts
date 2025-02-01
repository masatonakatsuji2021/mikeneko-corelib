import { Render } from "Render";
import { Lib } from "Lib";
import { VirtualDom, dom } from "VirtualDom";

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
}

/**
 * ***Dialog*** : A class for displaying or manipulating a dialog screen.
 */
export class Dialog extends Render {

    protected static type : string = "Dialog";

    public static __openDialogs: {[id: string] : Dialog} = {};

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
        }, 300);
    }

    private static addDialog(dialog: Dialog){
        const id = Lib.uniqId();
        this.__openDialogs[id] = dialog;
    }

    /**
     * ***forceClose*** : Forces all open dialogs to close.
     */
    public static forceClose() {
        const c = Object.keys(this.__openDialogs);
        for(let n = 0 ; n < c.length ; n++) {
            const id = c[n];
            const dialog = this.__openDialogs[id];
            dialog.close();
            delete this.__openDialogs[id];
        }
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
                    dialogName = _[1] as string;
                    option = _[0] as DialogOption;
                }
                else {
                    dialogName = _[0] as string;
                }
            }    
        }

        if (dialogName) dialogName = "dialog/" + dialogName;
        if (!option) option = {};
        this.setDialogCss();
        const dialogStr = "<dwindow>" + this.getHtml(dialogName) + "</dwindow>";
        const dialogVdo = VirtualDom.create(dialogStr, "dialog");
        
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
        const dialog : Dialog = this.loadClass(dialogVdo, dialogName, option.sendData, this);
        Dialog.addDialog(dialog);
        if (option.handle) option.handle(dialog);
        return dialog;
    }

    private static setDialogCss(){
        if (dom("head").querySelector("link[m=dl]").length > 0)  return;
        let style = use("CORERES/dialog/style.css");
        if (!globalThis.webpack) style = "data:text/css;base64," + style;        
        dom("head").afterBegin("<link rel=\"stylesheet\" m=\"dl\" href=\"" + style + "\">");
    }
}