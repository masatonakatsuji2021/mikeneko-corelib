import { Lib } from "Lib";
import { Shortcode } from "Shortcode";
import { VirtualDom, VirtualDomList } from "VirtualDom";

export class Render {

    protected static type : string;

    protected static ___PATH___ : string;

    /**
     * ***myMjs*** : Virtual Dom for content.
     * @deprecated The role of this variable has been changed to **vdo**.  
     * [VirtualDom is described here](VirtualDom.ts)
     */
    public get myMjs() : VirtualDom {
        return this.vdo;
    }
    
    /**
     * ***mjs**** : Virtual DOM List of VirtualDom Classes.
     * @deprecated The role of this variable has been changed to **vdo**.  
     * [How to use VirtualDOM is described in VirtualDom classes.](./VirtualDom.ts)
     */
    public get mjs() : VirtualDomList {
        return this.vdos;
    }
        
    /**
     * ***vdo*** : Virtual Dom for content.  
     * [VirtualDom is described here](VirtualDom.ts)
     */
    public vdo : VirtualDom;
    
    /**
     * ***vdos*** : Virtual DOM List of VirtualDom Classes.  
     * (``mjs`` is also available as a proxy.)
     * 
     * [VirtualDom is described here](VirtualDom.ts)
     * 
     * Example: First, place a v attribute tag in the HTML file.
     * ```html
     * <h1 v="mainTitle"></h1>
     * ```
     * Insert text in the View class etc. as follows:
     * ```typescript
     * this.vdos.mainTitle.text = "MainTitle Text...";
     * ```
     * [How to use VirtualDOM is described in VirtualDom classes.](./VirtualDom.ts)
     */
    public vdos : VirtualDomList;

    /**
     * ***sendData*** : 
     */
    public sendData: any;

    private static getHtmlRenderPath(path? : string) : string {
        if (!path) path = Lib.getRenderingPath(this.___PATH___.substring("app/".length), this.type);
        const renderPath : string = "rendering/" + path + ".html";
        return renderPath;
    }

    /**
     * ***getHtmlExists*** : Determines if HTML content information can be rendered.
     * @param {string} path rendering html Name
     * @returns {boolean}
     */
    public static getHtmlExists(path : string) : boolean {
        const renderPath = this.getHtmlRenderPath(path);
        if(!useExists(renderPath)) return false;
        return true;
    }

    /**
     * ***getHtml** : Get Rendering HTML content information.
     * @param {string} path rendering html Name
     * @returns {string}
     */
    public static getHtml(path? : string) : string {
        const renderPath = this.getHtmlRenderPath(path);
        if (!this.getHtmlExists(path)) {
            console.error("[Rendering ERROR] Rendering data does not exist. Check if source file \"" + renderPath + "\" exists.") 
            return;
        }

        let content : string = use(renderPath);
        if (globalThis.webpack) content = content.split("data:text/html;base64,").join("");
        content = Lib.base64Decode(content);
        content = this.renderConvert(content);;
    
        return content;
    }

    private static renderConvert(content : string) {
        let tagName = "div";
        if (content.indexOf("<tr") === 0 || content.indexOf("<td") === 0) tagName = "tbody";
        let el0 = document.createElement(tagName);
        el0.innerHTML = content;

        // link tag check...
        const links =el0.querySelectorAll("link");
        links.forEach((el) => {
            const href = el.attributes["href"].value;
            if (!Lib.existResource(href)) return;
            const resource = Lib.getResourceDataUrl(href);
            el.setAttribute("href", resource);
        });

        // image tag check...
        const imgs =el0.querySelectorAll("img");
        imgs.forEach((el) => {
            const src = el.attributes["src"].value;
            if (!Lib.existResource(src)) return;
            const resource = Lib.getResourceDataUrl(src);
            el.setAttribute("src", resource);
        });

        // shortcode analysis
        el0.innerHTML = Shortcode.analysis(el0.innerHTML);

        return el0.innerHTML;
    }

    /**
     * ***bindUI*** : Bind the Render content to the specified virtual DOM class.
     * @param {VirtualDom} vdo Bind Virtual Dom
     * @param {string} path render Path
     * @param {any} sendData Transmission data contents
     * @param {any} defaultClass Default Response Class Object
     * @returns {Render | UI | View | Template | Dialog}
     */
    public static bind(vdo: VirtualDom, path : string, sendData : any, defaultClass: any) {
        vdo.html = this.getHtml(path);
        return this.loadClass(vdo, path, sendData, defaultClass);
    }

    /**
     * ***bindUI*** : Appends the Render content to the specified virtual DOM class.
     * @param {VirtualDom} vdo Append Virtual Dom
     * @param {string} path render Path
     * @param {any} sendData Transmission data contents
     * @param {any} defaultClass Default Response Class Object
     * @returns {Render | UI | View | Template | Dialog}
     */
    public static append(vdo: VirtualDom, path : string, sendData : any, defaultClass: any) {
        const myVdo = new VirtualDom();
        vdo.append(this.getHtml(path), true);
        vdo.reload(myVdo);
        return this.loadClass(myVdo, path, sendData, defaultClass);
    }

    protected static loadClass(vdo : VirtualDom, path?: string, sendData? : any, defaultClass? : any) {
        if (path) {
            path = path + this.type;
        }
        else {
            path = this.___PATH___;
        }
        const className = Lib.getModuleName(path);
        const classPath = Lib.getModulePath("app/" + path);
        let classObj;
        try {
            if (!useExists(classPath)) throw Error();
            const classObj_ = use(classPath);
            classObj = new classObj_[className]();
            classObj.vdo = vdo;
            classObj.vdos = vdo.childs;
        }catch(error) {
            if (defaultClass) {
                classObj = new defaultClass();
            }
            else {
                classObj = new Render();
            }
            classObj.vdo = vdo;
            classObj.vdos = vdo.childs;
        }
        if (classObj.handle) classObj.handle(sendData);
        return classObj;
    }
}