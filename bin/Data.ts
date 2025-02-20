export enum DataService {

    backHandle,

    pageDisable,

    beforeUrl,

    history,

    beforeView,

    beforeTemplate,

    beforeHead,

    beforeHeader,
    
    beforeFooter,
}

export class Data {
    
    public static __data : {[name : string] : any} = {};

    /**
     * get
     * Get the value from the specified name
     * @param {DataService} name 
     * @returns 
     */
    public static get(name : DataService) : any {
        return this.__data[name];
    }

    /**
     * set
     * Hold the value statically for the specified name
     * @param {DataService} name 
     * @param {any} value 
     * @returns 
     */
    public static set(name : DataService, value: any) : Data {
        this.__data[name] = value;
        return this;
    }

    /**
     * remove
     * Delete the value with the specified name
     * @param {DataService} name 
     */
    public static remove(name: DataService) {
        delete this.__data[name];
    }

    /**
     * push
     * Add and save a value in the specified name area
     * @param {DataService} name 
     * @param {any} value 
     * @returns 
     */
    public static push(name : DataService , value: any) : Data {
        if (!this.__data[name])  this.__data[name] = [];
        this.__data[name].push(value);
        return this;
    }

    public static getLength(name : DataService) : number {
        if (!this.__data[name])  return;
        return this.__data[name].length;
    }

    public static pop(name : DataService) : any {
        if (!this.__data[name]) return this;
        return this.__data[name].pop();
    }

    public static now(name : DataService) : any {
        if (!this.__data[name]) return;
        const length = this.__data[name].length;
        return this.__data[name][length - 1];
    }

}