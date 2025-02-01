import { View } from "View";

export class Exception extends View{

    public view : string = "exception";

    /**
     * ***handle*** : 
     * Event handler when an error occurs.
     * @param {Exception} exception Error Exception
     * @returns {void}
    */
    handle(exception : any): void{}
}