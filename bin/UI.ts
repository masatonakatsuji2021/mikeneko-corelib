import { VirtualDom } from "VirtualDom";
import { Render } from "Render";
import { Hook, HookNames } from "Hook";

/**
 * **UI** : Used when sharing individual display areas in HTML rendering.  
 * Used to standardize buttons, list displays, and input fields.
 */
export class UI extends Render {

    protected static type : string = "UI";

    /**
     * ***handle*** : Event handler for when the UI is displayed.
     * @param {any} sendData? Transmission data contents
     * @returns {void}
     */
    public handle(sendData? : any) : void { }

    /**
     * ***bind*** : Bind the UI content to the specified virtual DOM class.
     * @param {VirtualDom} vdo Bind Virtual Dom
     * @returns {UI}
     */
    public static bind(vdo: VirtualDom) : UI;

    /**
     * ***bind*** : Bind the UI content to the specified virtual DOM class.
     * @param {VirtualDom} vdo Bind Virtual Dom
     * @param {string} UIName UI Name
     * @returns {UI}
     */
    public static bind(vdo: VirtualDom, UIName : string) : UI;

    /**
     * ***bind*** : Bind the UI content to the specified virtual DOM class.
     * @param {VirtualDom} vdo Bind Virtual Dom
     * @param {string} UIName UI Name
     * @param {any} sendData Transmission data contents
     * @returns {UI}
     */
    public static bind(vdo: VirtualDom, UIName : string, sendData : any) : UI;

    public static bind(vdo: VirtualDom, UIName? : string, sendData? : any) : UI {
        if(UIName) UIName = "ui/" + UIName;
        Hook.dispatch(HookNames.UIBind, { vdo, UIName, sendData });
        return super.bind(vdo, UIName, sendData, this) as UI;
    }

    /**
     * ***append*** : Appends the UI content to the specified virtual DOM class.
     * @param {VirtualDom} vdo Append Virtual Dom
     * @returns {UI}
     */
    public static append(vdo: VirtualDom) : UI;

    /**
     * ***append*** : Appends the UI content to the specified virtual DOM class.
     * @param {VirtualDom} vdo Append Virtual Dom
     * @param {string} UIName UI name
     * @param {any} sendData Transmission data contents
     * @returns {UI}
     */
    public static append(vdo: VirtualDom, UIName : string) : UI;

    /**
     * ***append*** : Appends the UI content to the specified virtual DOM class.
     * @param {VirtualDom} vdo Append Virtual Dom
     * @param {string} UIName UI name
     * @param {any} sendData Transmission data contents
     * @returns {UI}
     */
    public static append(vdo: VirtualDom, UIName : string, sendData : any) : UI;

    public static append(vdo: VirtualDom, UIName? : string, sendData? : any) : UI {
        if(UIName) UIName = "ui/" + UIName;
        Hook.dispatch(HookNames.UIAppend, { vdo, UIName, sendData });
        return super.append(vdo, UIName, sendData, this) as UI;
    }

    /**
     * ***afterBegin*** : Appends (=afterbegin) the UI content to the specified virtual DOM class.
     * @param {VirtualDom} vdo Append Virtual Dom
     * @returns {UI}
     */
    public static afterBegin(vdo: VirtualDom) : UI;

    /**
     * ***afterBegin*** : Appends (=afterbegin) the UI content to the specified virtual DOM class.
     * @param {VirtualDom} vdo Append Virtual Dom
     * @param {string} UIName UI name
     * @param {any} sendData Transmission data contents
     * @returns {UI}
     */
    public static afterBegin(vdo: VirtualDom, UIName : string) : UI;

    /**
     * ***afterBegin*** : Appends (=afterbegin) the UI content to the specified virtual DOM class.
     * @param {VirtualDom} vdo Append Virtual Dom
     * @param {string} UIName UI name
     * @param {any} sendData Transmission data contents
     * @returns {UI}
     */
    public static afterBegin(vdo: VirtualDom, UIName : string, sendData : any) : UI;

    public static afterBegin(vdo: VirtualDom, UIName? : string, sendData? : any) : UI {
        if(UIName) UIName = "ui/" + UIName;
        return super.afterBegin(vdo, UIName, sendData, this) as UI;
    }
}