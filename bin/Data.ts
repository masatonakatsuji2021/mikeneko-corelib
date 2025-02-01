export class Data {
    
    public static __data : {[name : string] : any} = {};

    /**
     * get
     * Get the value from the specified name
     * @param {string} name 
     * @returns 
     */
    public static get(name : string) : any {
        return this.__data[name];
    }

    /**
     * set
     * Hold the value statically for the specified name
     * @param {string} name 
     * @param {any} value 
     * @returns 
     */
    public static set(name : string, value: any) : Data {
        this.__data[name] = value;
        return this;
    }

    /**
     * remove
     * Delete the value with the specified name
     * @param {string} name 
     */
    public static remove(name: string) {
        delete this.__data[name];
    }

    /**
     * push
     * Add and save a value in the specified name area
     * @param {string} name 
     * @param {any} value 
     * @returns 
     */
    public static push(name : string , value: any) : Data {
        if (!this.__data[name])  this.__data[name] = [];
        this.__data[name].push(value);
        return this;
    }

    public static getLength(name : string) : number {
        if (!this.__data[name])  return;
        return this.__data[name].length;
    }

    public static pop(name : string) : Data {
        if (!this.__data[name]) return this;
        this.__data[name].pop();
        return this;
    }

    public static now(name : string) : any {
        if (!this.__data[name]) return;
        const length = this.__data[name].length;
        return this.__data[name][length - 1];
    }

}