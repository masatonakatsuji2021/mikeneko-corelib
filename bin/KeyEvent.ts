export class KeyEvent{

    private _callback_down = {};
    private _callback_up = {};

    public constructor(){
        const cont = this;
        document.addEventListener("keydown", function(e){
            let keyCode = e.code;
            if(cont._callback_down[keyCode]){
                cont._callback_down[keyCode](e);
            }
        });
        document.addEventListener("keyup", function(e){
            let keyCode = e.code;
            if(cont._callback_up[keyCode]){
                cont._callback_up[keyCode](e);
            }
        });
    }

    /**
     * on : 
     * Methods for implementing event handlers when a key is pressed.
     * @param {string} fullKeyName Event target key code
     * @param {Function} keyDownCallback Callback function for key presses
     * @returns {KeyEvent} KeyEvent Class Object
     */
    public on(fullKeyName : string, keyDownCallback : Function) : KeyEvent;

    /**
     * on : 
     * Methods for implementing event handlers when a key is pressed or spoken
     * @param {string} fullKeyName Event target key code
     * @param {Function} keyDownCallback Callback function for key presses
     * @param {Function} keyUpCallback Callback function for key spoken
     * @returns {KeyEvent} KeyEvent Class Object
     */
    public on(fullKeyName : string, keyDownCallback : Function, keyUpCallback : Function) : KeyEvent;

    public on(fullKeyName : string, keyDownCallback : Function, keyUpCallback? : Function){
        this._callback_down[fullKeyName] = keyDownCallback;
        if(keyUpCallback){
            this._callback_up[fullKeyName] = keyUpCallback;
        }
        return this;
    }

    /**
     * onArrowUp : 
     * Method to implement the event handler when pressing the arrow up key
     * @param {Function} keyDownCallback Callback function for key presses
     * @returns {KeyEvent} KeyEvent Class Object
     */
    public onArrowUp(keyDownCallback : Function) : KeyEvent;

    /**
     * onArrowUp : 
     * Method to implement the event handler when pressing the arrow up key
     * @param {Function} keyDownCallback Callback function for key presses
     * @param {Function} keyUpCallback Callback function for key spoken
     * @returns {KeyEvent} KeyEvent Class Object
     */
    public onArrowUp(keyDownCallback : Function , keyUpCallback : Function) : KeyEvent;

    public onArrowUp(keyDownCallback : Function , keyUpCallback? : Function){
        return this.on("ArrowUp", keyDownCallback, keyUpCallback);
    }

    /**
     * onArrowDown : 
     * Method to implement the event handler when pressing the arrow down key
     * @param {Function} keyDownCallback Callback function for key presses
     * @returns {KeyEvent} KeyEvent Class Object
     */
    public onArrowDown(keyDownCallback : Function) : KeyEvent;

    /**
     * onArrowDown : 
     * Method to implement the event handler when pressing the arrow down key
     * @param {Function} keyDownCallback Callback function for key presses
     * @param {Function} keyUpCallback Callback function for key spoken
     * @returns {KeyEvent} KeyEvent Class Object
     */
    public onArrowDown(keyDownCallback : Function , keyUpCallback : Function) : KeyEvent;

    public onArrowDown(keyDownCallback : Function , keyUpCallback? : Function){
        return this.on("ArrowDown", keyDownCallback, keyUpCallback);
    }

    /**
     * onArrowLeft : 
     * Method to implement the event handler when pressing the arrow left key
     * @param {Function} keyDownCallback Callback function for key presses
     * @returns {KeyEvent} KeyEvent Class Object
     */
    public  onArrowLeft(keyDownCallback : Function) : KeyEvent;

    /**
     * onArrowLeft : 
     * Method to implement the event handler when pressing the arrow left key
     * @param {Function} keyDownCallback Callback function for key presses
     * @param {Function} keyUpCallback Callback function for key spoken
     * @returns {KeyEvent} KeyEvent Class Object
     */
    public onArrowLeft(keyDownCallback : Function , keyUpCallback : Function) : KeyEvent;
    
    public onArrowLeft(keyDownCallback : Function , keyUpCallback? : Function){
        return this.on("ArrowLeft", keyDownCallback, keyUpCallback);
    }

    /**
     * onArrowRight : 
     * Method to implement the event handler when pressing the arrow right key
     * @param {Function} keyDownCallback Callback function for key presses
     * @returns {KeyEvent} KeyEvent Class Object
     */
    public onArrowRight(keyDownCallback : Function) : KeyEvent;

    /**
     * onArrowRight : 
     * Method to implement the event handler when pressing the arrow right key
     * @param {Function} keyDownCallback Callback function for key presses
     * @param {Function} keyUpCallback Callback function for key spoken
     * @returns {KeyEvent} KeyEvent Class Object
     */
    public onArrowRight(keyDownCallback : Function , keyUpCallback : Function) : KeyEvent;

    public onArrowRight(keyDownCallback : Function , keyUpCallback? : Function){
        return this.on("ArrowRight", keyDownCallback, keyUpCallback);
    }

    /**
     * onEnter : 
     * A method to implement an event handler when the Enter key is pressed
     * @param {Function} keyDownCallback Callback function for key presses
     * @returns {KeyEvent} KeyEvent Class Object
     */
    public onEnter(keyDownCallback : Function) : KeyEvent;

    /**
     * onEnter : 
     * A method to implement an event handler when the Enter key is pressed
     * @param {Function} keyDownCallback Callback function for key presses
     * @param {Function} keyUpCallback Callback function for key spoken
     * @returns {KeyEvent} KeyEvent Class Object
     */
    public onEnter(keyDownCallback : Function , keyUpCallback : Function) : KeyEvent;

    public onEnter(keyDownCallback : Function , keyUpCallback? : Function){
        return this.on("Enter", keyDownCallback, keyUpCallback);
    }

    /**
     * onSpace : 
     * A method to implement an event handler when the Space key is pressed
     * @param {Function} keyDownCallback Callback function for key presses
     * @returns {KeyEvent} KeyEvent Class Object
     */
    public onSpace(keyDownCallback : Function) : KeyEvent;

    /**
     * onSpace : 
     * A method to implement an event handler when the Space key is pressed
     * @param {Function} keyDownCallback Callback function for key presses
     * @param {Function} keyUpCallback Callback function for key spoken
     * @returns {KeyEvent} KeyEvent Class Object
     */
    public onSpace(keyDownCallback : Function , keyUpCallback : Function) : KeyEvent;

    public onSpace(keyDownCallback : Function , keyUpCallback? : Function){
        return this.on("Space", keyDownCallback, keyUpCallback);
    }

    /**
     * onChar : 
     * Method to implement event handler when character key is pressed
     * @param {string} keyword input key character
     * @param {Function} keyDownCallback Callback function for key presses
     * @returns {KeyEvent} KeyEvent Class Object
     */
    public onChar(keyword: string, keyDownCallback : Function) : KeyEvent;

    /**
     * onChar : 
     * Method to implement event handler when character key is pressed
     * @param {string} keyword input key character
     * @param {Function} keyDownCallback Callback function for key presses
     * @param {Function} keyUpCallback Callback function for key spoken
     * @returns {KeyEvent} KeyEvent Class Object
     */
    public onChar(keyword: string, keyDownCallback : Function , keyUpCallback? : Function) : KeyEvent;

    public onChar(keyword: string, keyDownCallback : Function , keyUpCallback? : Function) : KeyEvent{
        return this.on("Key" + keyword, keyDownCallback, keyUpCallback);
    }

    /**
     * onNumber : 
     * A method to implement an event handler when pressing a numeric key
     * @param {number} number input digits
     * @param {Function} keyDownCallback Callback function for key presses
     * @returns {KeyEvent} KeyEvent Class Object
     */
    public onNumber(number : number, keyDownCallback : Function) : KeyEvent;

    /**
     * onNumber : 
     * A method to implement an event handler when pressing a numeric key
     * @param {number} number input digits
     * @param {Function} keyDownCallback Callback function for key presses
     * @param {Function} keyUpCallback Callback function for key spoken
     * @returns {KeyEvent} KeyEvent Class Object
     */
    public onNumber(number : number, keyDownCallback : Function , keyUpCallback? : Function) : KeyEvent;

    public onNumber(number : number, keyDownCallback : Function , keyUpCallback? : Function) : KeyEvent{
        return this.on("Number" + number, keyDownCallback, keyUpCallback);
    }

}