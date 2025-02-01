import { App, AppRouteType } from "App";
import { Routes, DecisionRoute  } from "Routes";
import { Render } from "Render";
import { Lib } from "Lib";
import { Data } from "Data";
import { View } from "View";
import { UI } from "UI";
import { Template } from "Template";
import { Background } from "Background";
import { Response } from "Response";
import { Shortcode } from "Shortcode";
import { RMapConvert } from "RouteMap";

export class Startor {

    private MyApp : typeof App;

    public constructor() {

        const MyApp = use("app/config/App");
        if (!MyApp){
            throw Error("App Class is not found.");
        }
        if (!MyApp.MyApp) {
            throw Error("App Class is not found.")
        }

        this.MyApp = MyApp.MyApp;

        this.setShortcode();

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

        if (Data.get("pageDisable")) {
            const beforeUrl : string = Data.get("beforeUrl");
            if (beforeUrl) {
                history.pushState(null,null,beforeUrl);
            }
            else {
                history.pushState(null,null);
            }
            return false;
        }

        Data.set("beforeUrl", location.hash);
        let url : string = location.hash.substring(1);

        if (!url) url = "/";

        const route : DecisionRoute = Routes.searchRoute(url);
        Response.rendering(route).then(()=>{
            Response.isBack = false;
        });
    }

    private setShortcode(){

        Shortcode.add("rendering", (args : {[name : string] : string}) : string => {
            if(!args.path) return;
            return Render.getHtml(args.path);
        });

        Shortcode.add("view", (args : {[name : string] : string}) : string => {
            if(!args.path) return;
            return View.getHtml(args.path);
        });

        Shortcode.add("ui", (args : {[name : string] : string}) : string => {
            if(!args.path) return;
            return UI.getHtml(args.path);
        });

        Shortcode.add("template", (args : {[name : string] : string}) : string => {
            if(!args.path) return;
            return Template.getHtml(args.path);
        });

        Shortcode.add("resource", (args : {[name : string] : string}) : string => {
            if(!args.url) return;
            return Lib.getResource(args.url);
        });

        Shortcode.add("resource_dataurl", (args : {[name : string] : string}) : string => {
            if(!args.url) return;
            return Lib.getResourceDataUrl(args.url);
        });

        Shortcode.add("resource_mimtype", (args : {[name : string] : string}) : string => {
            if(!args.url) return;
            return Lib.getResourceMimeType(args.url);
        });

        Shortcode.add("uniqId", (args : {[name : string] : string}) : string => {
            if (!args.length) args.length = "";
            return Lib.uniqId(parseInt(args.length));
        });
    }
}
export const string =  Startor.toString();