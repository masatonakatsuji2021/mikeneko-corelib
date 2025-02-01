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
window.onload = ()=>{
    const st = use("Startor");  
    new st.Startor();
};