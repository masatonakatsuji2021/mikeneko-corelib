const platform : string = "{{platform}}";
class FrontControl {
    private  __fn = {};
    private  __fn_static = {};
    public setFn(name : string, callback : Function) {
        this.__fn[name] = callback;
    }
    public getFn(name : string) {
        if (this.__fn_static[name]) return this.__fn_static[name];
        if (!this.__fn[name]) {
            console.error("No data available. Check if the file exists in the source file \"" + name + "\".");
            return;
        }
        let buffer = this.__fn[name]();
        if (typeof buffer == "object") {
            const c = Object.keys(buffer);
            for(let n = 0 ; n < c.length; n++) {
                const cn = c[n];
                try {
                    buffer[cn].___PATH___ = name;
                } catch(error){}
            }
        }
        if (this.__fn_static[name] == undefined) this.__fn_static[name] = buffer;
        return buffer;
    }
    public exists(name : string) : boolean {
        if (this.__fn_static[name]) return true;
        if(this.__fn[name]) return true;
        return false;
    }
    public start(callback : Function) {
        window.onload = ()=>{
            if (callback) {
                callback.bind(this)();
            }
            else{
                use("app/index");
            }    
        };
    }
}
const use= (name : string) => {
    return sfa.getFn(name);
};
const useExists = (name: string) => {
    return sfa.exists(name);
};
// @ts-ignore
require = use;
let sfa = new FrontControl();