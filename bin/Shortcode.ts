type ShortcodeHandle = (args : {[name : string] : any} ) => string;

/**
 * ***Shortcode*** : Classes for creating shortcodes
 */
export class Shortcode {

    public static shortCodes : {[name : string] : ShortcodeHandle} = {};

    public static add(name : string, handle : ShortcodeHandle) {
        this.shortCodes[name] = handle;
    }

    public static getHandle(name : string) : ShortcodeHandle {
        return this.shortCodes[name];
    }

    public static analysis(codeString : string) : string {
        const regex = /\[short_(.*?)\]/g;
        const matchs = codeString.match(regex);
        if (!matchs) return codeString;
        matchs.forEach((match) => {
            const match_ = match.substring("[short_".length, match.length -1);
            const ms = match_.split(",");
            let name;
            let args = {};
            for (let n = 0 ; n < ms.length ; n++) {
                const ms_ = ms[n];
                if (n == 0) {
                    name = ms_;
                    continue;
                }
        
                const ms__ = ms_.split("=");
                const field = ms__[0].trim();
                const value = ms__[1].trim();
                args[field] = value;
            }
        
            if (!this.shortCodes[name]) return;
            let result = this.shortCodes[name](args);
            if (!result) result = "";
            codeString = codeString.split(match).join(result);
        });
        return codeString;
    }
}