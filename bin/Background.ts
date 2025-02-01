import { Lib } from "Lib";
import { App } from "App";

/**
 * ***Background*** : Classes that execute and manipulate business logic in the background.  
 * This class starts executing immediately after the app is launched, regardless of each screen transition.   
 * To use it in advance, you need to list it in backgrounds in ``app/config/App.ts``
 * 
 * ```typescript
 * public backgrounds : Array<string> = [
 *    "Sample1",
 *    "Sample2",
 *    ...
 * ];
 * ```
 */
export class Background {

    public static async load(){
        
        const MyApp : typeof App = use("app/config/App").MyApp;

        // background class method load.
       if(MyApp.backgrounds){
           for(let n = 0 ; n < MyApp.backgrounds.length ; n++){
                const backgroundName = Lib.getModulePath(MyApp.backgrounds[n]);
                const backgroundPath : string = "app/background/" + backgroundName;
                if(!useExists(backgroundPath)) continue;
                const background : typeof Background = use(backgroundPath);
                const bg : Background = new background[backgroundName]();
                await bg.handle();
           }
       }
   }

    /**
     * ***handle*** : A handler that is executed immediately after the application starts.
     */
    public handle() : void | Promise<void> {}
}