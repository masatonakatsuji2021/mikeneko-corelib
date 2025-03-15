import { Lib } from "Lib";
import { RouteMap } from "RouteMap";
import { DecisionRoute } from "Routes";
import { View } from "View";
import { VirtualDom } from "VirtualDom";

export enum HookNames {

    /** Immediately after launching the app */
    StartorBegin = "StartorBegin",

    /** When transitioning to the next screen */
    TransitionNext = "TransitionNext",

    /** When moving to the next screen */
    TransitionMove = "TransitionMove",

    /** When transitioning to the next screen using stack */
    TransitionStack = "TransitionStack",

    /** After a screen is closed from the stack */
    TransitionStackClose = "TransitionStackClose",

    /** When returning to the previous screen */
    TransitionBack = "TransitionBack",

    /** When switching to the next screen */
    TransitionReplace = "TransitionReplace",

    /** When adding screen history */
    TransitionHistoryAdd = "TransitionHistoryAdd",

    /** When clearing screen history */
    TransitionHistoryClear = "TransitionHistoryClear",

    /** When you remove the screen history */
    TransitionHistoryPop = "TransitionHistoryPop",

    /** Before screen change */
    RenderingBefore = "RenderingBefore",

    /** After screen change */
    RenderingAfter = "RenderinAfter",

    /** When binding the UI */
    UIBind = "UIBind",

    /** When adding UI */
    UIAppend = "UIAppend",

    /** When installing the render content */
    SetRenderContent = "SetRenderContent",
}

export class Hook {

    private static __buffers : Array<Hook> = [];

    public static load() {
        // @ts-ignore
        const localLIst = useSearch("app/hook");

        for(let n = 0 ; n < localLIst.length ; n++) {
            const local = localLIst[n];
            const localHookName = Lib.getModuleName(local);
            try {
                // @ts-ignore
                const localHook_ = use(local)[localHookName];
                const localHook = new localHook_();
                this.__buffers.push(localHook);
            } catch (error) {
                console.warn(error);
            }
        }
    }

    /**
     * ***dispatch*** : Executes the hook with the specified hook name.
     * @param {string} name hook name
     * @returns {Promise<any>}
     */
    public static dispatch(name: string) : any;

    /**
     * ***dispatch*** : Executes the hook with the specified hook name.
     * @param {HookNames} hookName Preset hook name enumeration squad
     * @returns {Promise<any>}
     */
    public static dispatch(hookName: HookNames) : any;

    /**
     * ***dispatch*** : Executes the hook with the specified hook name.
     * @param {string} name hook name
     * @param {any} result Option Value
     * @returns {Promise<any>}
     */
    public static dispatch(name: string, result : any) : any;

    /**
     * ***dispatch*** : Executes the hook with the specified hook name.
     * @param {HookNames} hookName Preset hook name enumeration squad
     * @param {any} result Option Value
     * @returns {Promise<any>}
     */
    public static dispatch(hookName: HookNames, result : any) : any;

    public static dispatch(name: string | HookNames, result? : any) : any {
        for(let n = 0 ; n < this.__buffers.length ; n++) {
            const buffer = this.__buffers[n];
            if (buffer[name]) {
                result = buffer[name](result);
            }
            else if(buffer["on" + name]) {
                result = buffer["on" + name](result);
            }
        }
        return result;
    }
    
    /** Immediately after launching the app */
    public onStartorBegin() : void {}

    /** When transitioning to the next screen */
    public onTransitionNext(target : string | number | RouteMap | typeof View) : void {}

    /** When moving to the next screen */
    public onTransitionMove(target : RouteMap | typeof View) : void {}

    /** When transitioning to the next screen using stack */
    public onTransitionStack(target: RouteMap | typeof View) : void {}

    /** After a screen is closed from the stack */
    public onTransitionStackClose() : void {}

    /** When returning to the previous screen */
    public onTransitionBack() : void {}

    /** When switching to the next screen */
    public onTransitionReplace(target : string | number | RouteMap | typeof View) : void {}

    /** When adding screen history */
    public onTransitionHistoryAdd(target : string | number | RouteMap | typeof View) : void {}

    /** When clearing screen history */
    public onTransitionHistoryClear() : void {}

    /** When you remove the screen history */
    public onTransitionHistoryPop() : void {}

    /** Before screen change */
    public onRenderingBefore(route: DecisionRoute) : void {}

    /** After screen change */
    public onRenderinAfter(route: DecisionRoute) : void {}

    /** When binding the UI */
    public onUIBind(option: {vdo: VirtualDom, UIName : string, sendData : any}) : void {}

    /** When adding UI */
    public onUIAppend(option: {vdo: VirtualDom, UIName : string, sendData : any}) : void {}

    /** When installing the render content */
    public onSetRenderContent(content: string) : string | void {}
}