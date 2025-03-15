import { App, AppRouteType } from "App";
import { Routes, DecisionRoute  } from "Routes";
import { Render } from "Render";
import { Lib } from "Lib";
import { Data, DataService } from "Data";
import { View } from "View";
import { UI } from "UI";
import { Template } from "Template";
import { Background } from "Background";
import { Response } from "Response";
import { Hook, HookNames } from "Hook";

export class Startor {

    private MyApp : typeof App;

    public constructor() {

        Hook.load();

        Hook.dispatch(HookNames.StartorBegin);

        const MyApp = use("app/config/App");
        if (!MyApp){
            throw Error("App Class is not found.");
        }
        if (!MyApp.MyApp) {
            throw Error("App Class is not found.")
        }

        this.MyApp = MyApp.MyApp;

        (async ()=>{
            window.addEventListener("click", (e: MouseEvent) => {
                return this.clickHandleDelegate(e);
            });
            window.addEventListener("popstate", async (e : PopStateEvent) => {
                await this.popStateHandleDelegate(e);
            });
        
            await Background.load();
            let begin = this.MyApp.begin;
            if (!begin) begin = "/";
            let url = "/";
            if (typeof begin == "string") {
                url = begin;
            }
            else {
                url = begin.url;
            }

            if (this.MyApp.routeType == AppRouteType.web) {
                if (location.hash) url = location.hash.substring(1);       
                const route : DecisionRoute = Routes.searchRoute(url);
                Response.rendering(route).then(()=>{
                    Response.isBack = false;
                });
            }
            else {
                Response.next(url);
            }
        })();
    }

    private clickHandleDelegate(e : MouseEvent){
        if (Response.lock) return false;
        // @ts-ignore
        let target : HTMLElement = e.target;
        for (let n = 0 ; n < 10; n++) {
            try {
                if(!target.tagName) return;
            }catch(error) { return; }
            if (target.tagName == "A") break;
            // @ts-ignore
            target = target.parentNode;
        }
        try {
            if (!target.attributes) return;
        }catch(error) { return; }
        if (!target.attributes["url"]) return;

        // @ts-ignore
        let url = target.getAttribute("url");
        if(!url) return;

        Response.next(url);
    }

    private async popStateHandleDelegate(e : PopStateEvent){

        if (Data.get(DataService.pageDisable)) {
            const beforeUrl : string = Data.get(DataService.beforeUrl);
            if (beforeUrl) {
                history.pushState(null,null,beforeUrl);
            }
            else {
                history.pushState(null,null);
            }
            return false;
        }

        Data.set(DataService.beforeUrl, location.hash);
        let url : string = location.hash.substring(1);

        if (!url) url = "/";

        const route : DecisionRoute = Routes.searchRoute(url);
        Response.rendering(route).then(()=>{
            Response.isBack = false;
        });
    }
}
export const string =  Startor.toString();