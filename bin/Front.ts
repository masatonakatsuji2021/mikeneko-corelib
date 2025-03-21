const platform : string = "{{platform}}";
class FrontControl {
    private __already = [];
    private static __root : string;
    private  __fn = {};
    private  __fn_static = {};
    public setFn(name : string, callback : Function) {
        this.__fn[name] = callback;
    }
    public getFn(name : string) {
        if (FrontControl.__root && name.indexOf(".") === 0) {
            const names = name.split("/");
            let namePaths = FrontControl.__root.split("/");
            namePaths.pop();
            for(let n = 0 ; n < names.length ; n++) {
                const n_ = names[n];
                if (n_ == ".") {
                    continue;
                }
                else if (n_ == "..") {
                    namePaths.pop();
                }
                else {
                    namePaths.push(n_);
                }
            }
            name = namePaths.join("/");
        }
        if (this.__fn_static[name]) return this.__fn_static[name];
        if (!this.__fn[name]) {
            console.error("No data available. Check if the file exists in the source file \"" + name + "\".");
            return;
        }
        if (this.__already.indexOf(name) > -1) return;
        this.__already.push(name);
        const beforeName = FrontControl.__root;
        FrontControl.__root = name;
        let buffer = this.__fn[name]();
        FrontControl.__root = beforeName;
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
        let newAlready = [];
        for(let n = 0 ; n < this.__already.length ; n++) {
            const n_ = this.__already[n];
            if (n_ !== name) newAlready.push(n_);
        }
        this.__already = newAlready;
        return buffer;
    }
    public exists(name : string) : boolean {
        if (this.__fn_static[name]) return true;
        if(this.__fn[name]) return true;
        return false;
    }
    public search(name : string) {
        const c = Object.keys(this.__fn);
        let list = [];
        for(let n = 0 ; n < c.length ; n++) {
            const n_ = c[n];
            if (n_.indexOf(name) !== 0) continue;
            list.push(n_);
        }
        return list;
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
const use = (name : string) => {
    return sfa.getFn(name);
};
const useExists = (name: string) => {
    return sfa.exists(name);
};
const useSearch = (name: string) => {
    return sfa.search(name);
};
// @ts-ignore
require = use;
let sfa = new FrontControl();