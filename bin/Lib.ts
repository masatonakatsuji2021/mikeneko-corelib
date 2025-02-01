import { Shortcode } from "Shortcode";

export class Lib {

    /**
     * ***existResource** :Determine whether resource data exists in the specified path.
     * @param {string} path 
     * @returns 
     */
    public static existResource(path : string) : boolean {
        return useExists("resource/" + path);
    }

    /**
     * ***getResource*** : Get prepared static content data  
     * Content is retrieved in dataURL format
     * @param {string} path static content data path
     * @returns {string} 
     */
    public static getResource(path : string) : string {
        const data = use("resource/" + path);
        if (globalThis.webpack) return data;
        const datas = data.split("|");
        const mimeType = datas[0];
        let content = datas[1];
        content = this.base64Decode(content);
        if (
            mimeType == "text/css" ||
            mimeType == "text/plain" ||
            mimeType == "text/html" ||
            mimeType == "application/json" || 
            mimeType == "text/javascript"
        ) {
            content = Shortcode.analysis(content);
        }
        return content;
    }

    /**
     * ***getResourceDataUrl*** : 
     * @param path 
     * @returns 
     */
    public static getResourceDataUrl(path : string) : string {
        const data = use("resource/" + path);
        if (globalThis.webpack) return data;
        const datas = data.split("|");
        const mimeType = datas[0];
        let content = datas[1];
        if (
            mimeType == "text/css" ||
            mimeType == "text/plain" ||
            mimeType == "text/html" ||
            mimeType == "application/json" || 
            mimeType == "text/javascript"
        ) {
            content = this.base64Decode(content);
            content = Shortcode.analysis(content);
            content = this.base64Encode(content);
        }
        return "data:" + mimeType + ";base64," + content;
    }

    /**
     * ***getResourceMimeType*** : 
     * @param path 
     * @returns 
     */
    public static getResourceMimeType(path : string) : string {
        const data = use("resource/" + path);
        return data.split("|")[0];
    }

    public static getModulePath(path : string) : string {
        const paths = path.split("/");
        paths.forEach((p_, index) => {
            if (index == paths.length - 1) {
                p_ = p_.substring(0,1).toUpperCase() + p_.substring(1);
                paths[index] = p_;
            }
        });
        return paths.join("/");
    }

    public static getRenderingPath(path : string, type: string) : string {
        const paths = path.split("/");
        paths.forEach((p_, index) => {
            if (index == paths.length - 1) {
                p_ = p_.substring(0,1).toLowerCase() + p_.substring(1);
                p_ = p_.substring(0, p_.length - type.length);
                paths[index] = p_;
            }
        });
        return paths.join("/");
    }

    public static getModuleName(string : string) : string{
        const strings = string.split("/");
        const string2 = strings[strings.length - 1];
        return string2.substring(0,1).toUpperCase() + string2.substring(1);
    }

    /**
     * ***base64Decode*** : Decode base64 text to plaintext.
     * @param {string} b64text base64 text
     * @returns {string} plain text content
     */
    public static base64Decode(b64text: string) : string{
        return decodeURIComponent(escape(atob(b64text)));
    }

    /**
     * ***base64Encode*** :  Encode the text to base64 format.
     * @param {string} text text content
     * @returns {string} base64 encode content
     */
    public static base64Encode(text : string) : string {
        return btoa(unescape(encodeURIComponent(text)));
    }

    /**
     * *** uniqId*** : Generates an arbitrary string of 32 characters
     * @returns {string} uniq id string
     */
     public static uniqId() : string;

    /**
     * *** uniqId*** : generates an arbitrary string of specified length characters.
     * @param {number} length text length
     * @returns {string} uniq id string
     */
    public static uniqId(length : number) : string;
    
    public static uniqId(length? : number) : string{
        if(!length) length = 64;
        const lbn : string = "0123456789ABCDEFGHIJKNLMOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
        let str : string = "";
        for(var n = 0 ; n < length ; n++){
            let index : number = parseInt((Math.random() * 10000).toString());
            let s : string = lbn[index % lbn.length];   
            str += s;
        }
        return str;
     }

    /**
     * *** datetime*** :  prints the current date and time  
     * Output as fgDateTime class object  
     * @returns {SbnDateTime} FgDateTime class Object  
     */
    public static datetime() : SbnDateTime;

    /**
     * #### datetime
     * Get date and time from given datetime
     * Output as fgDateTime class object
     * @param {string} datetime Specified date and time
     * @returns {SbnDateTime} FgDateTime class Object
     */
    public static datetime(datetime : string) : SbnDateTime;

    public static datetime(datetime? : string) : SbnDateTime{
        return new SbnDateTime(datetime);
    }

    /**
     * passByValue
     * @param {any} values 
     * @returns 
     */
    public static passByValue(values: any) {
        return this._passByValue(values);
    }

    private static _passByValue(values: any) {
        let buffers = {};

        const c = Object.keys(values);
        for(let n = 0 ; n < c.length ; n++) {
            const name = c[n];
            const value = values[name];
            if (typeof value == "object") {
                const value_ = this._passByValue(value);
                buffers[name] = value_;
            }
            else {
                buffers[name] = value;
            }
        }
        return buffers;
    }



    /**
     * ***sleep*** :  Stop processing for a certain period of time.(Synchronous processing)   
     * This method is synchronized by executing it with await inside the asynced function.   
     * 
     * Example) 
     * ```typescript
     * await sleep(1000);        // <= Stop processing for 1000ms
     * ```
     * @param {number} time Stop time
     * @returns {promise<unknown>} Promise Object 
     */
    public static sleep(time : number) : Promise<unknown>{
        return new Promise(function(resolve: Function){
            setTimeout(function(){
                resolve();
            },time);
        });
    }

    /**
     * ***importResourceScript*** :  
     * Loads external JavaScript libraries located in the resource directory. 
     * @param {string} scriptName JavaScript file path
     * @returns 
     */
    public static importResourceScript(scriptName : string) {
        let script = this.getResource(scriptName);
        return eval(script);
    }
}

export class SbnDateTime{
    
    private d : Date;

    public constructor(datetime? : string){
        if(datetime){
            this.d = new Date(datetime);
        }
        else{
            this.d = new Date();
        }
    }

    public format(format : string) : string{
        if(format == undefined) format = "YYYY/MM/DD HH:II:SS";
        format = format.split("YYYY").join(this.getYear());
        format = format.split("MM").join(this.getMonth());
        format = format.split("DD").join(this.getDate());
        format = format.split("W").join(this.getDay());
        format = format.split("HH").join(this.getHours());
        format = format.split("II").join(this.getMinutes());
        format = format.split("SS").join(this.getSeconds());
        format = format.split("U").join(this.getTime());  
        return format;
    }

    public getYear() : string{
        return this.d.getFullYear().toString();
    };

    public getMonth() : string{
        return ("00" + (this.d.getMonth() + 1)).slice(-2);
    }

    public getDate() : string{
        return ("00" + this.d.getDate()).slice(-2);
    }

    public getDay() : string{
        return this.d.getDay().toString();
    }

    public getHours() : string{
        return ("00" + this.d.getHours()).slice(-2);
    }

    public getMinutes() : string{
        return ("00" + this.d.getMinutes()).slice(-2);
    }

    public getSeconds() : string{
        return ("00" + this.d.getSeconds()).slice(-2);
    }

    public getTime() : string{
        return this.d.getTime().toString();
    }
}
