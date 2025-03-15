// @ts-ignore
import { WebPackComponent } from "WebPackComponent";
globalThis.webpack = true;

// @ts-ignore
globalThis.use = (wppath) => {
    if (!WebPackComponent[wppath]) throw Error("Module NOt Found \"" + wppath + "\”");
    return WebPackComponent[wppath];
};
// @ts-ignore
globalThis.useExists = (wppath)=>{
    if(WebPackComponent[wppath]) return true;
    return false;
};
// @ts-ignore
globalThis.useSearch = (wppath)=>{
    const c = Object.keys(WebPackComponent);
    let list = [];
    for(let n = 0 ; n < c.length ; n++) {
        const n_ = c[n];
        if (n_.indexOf(wppath) !== 0) continue;
        list.push(n_);
    }
    return list;
}
window.onload = ()=>{
    const st = use("Startor");  
    new st.Startor();
};