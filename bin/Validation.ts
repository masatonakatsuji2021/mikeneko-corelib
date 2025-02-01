import { VirtualDom, VirtualDomList } from "VirtualDom";

/**
 * ***ValidateRule*** : Validation check rule enumeration.
 */
export enum ValidateRule {
    /**
     * ***required*** : If no value is entered, an error is detected.
     *   
     * ```typescript
     * {
     *   rule: ValidateRule.required,
     * }
     * ```
     */
    required = "required",
    /**
     * ***length*** : If the length of the value (string) is not the specified length, an error is detected.    
     *   
     * Below is an example of an error being detected if the value is not 20 characters.
     * ```typescript
     * {
     *   rule: ValidateRule.length,
     *   args: [ 20 ],
     * }
     * ```
     */
    length = "length",
    /**
     * ***lengthMin*** : If the length of the value (string) is less than the specified length, an error is detected.
     *   
     * Below is an example of an error being detected if the value is 10 characters or less.  
     * ```typescript
     * {
     *   rule: ValidateRule.lengthMin,
     *   args: [ 10 ],
     * }
     * ```
     */
    lengthMin = "lengthMin",
    /**
     * ***lengthMax*** : If the length of the value (string) is greater than or equal to the specified length, an error is detected.
     *   
     * Below is an example of an error being detected if the value is 128 characters or more.  
     * ```typescript
     * {
     *   rule: ValidateRule.lengthMax,
     *   args: [ 128 ],
     * }
     * ```
     */
    lengthMax = "lengthMax",
    /**
     * ***lengthBetween*** : If the length of the value (string) is outside the specified length range, an error is detected.
     *   
     * Below is an example of an error being detected if the value is outside the range of 10 to 128 characters.  
     * ```typescript
     * {
     *   rule: ValidateRule.lengthBetween,
     *   args: [ 10, 128 ],
     * }
     * ```
     */
    lengthBetween = "lengthBetween",
    /**
     * ***byteLength*** : If the length of the value (string) is not the specified byte length, an error is detected.    
     *   
     * Below is an example of an error being detected if the value is not 20 byte.
     * ```typescript
     * {
     *   rule: ValidateRule.byteLength,
     *   args: [ 20 ],
     * }
     * ```
     */
    byteLength = "byteLength",
    /**
     * ***byteLengthMin*** : If the length of the value (string) is less than the specified byte length, an error is detected.
     *   
     * Below is an example of an error being detected if the value is 10 byte or less.  
     * ```typescript
     * {
     *   rule: ValidateRule.byteLengthMin,
     *   args: [ 20 ],
     * }
     * ```
     */
    byteLengthMin = "byteLengthMin",
    /**
     * ***byteLengthMax*** : If the length of the value (string) is greater than or equal to the specified byte length, an error is detected.
     *   
     * Below is an example of an error being detected if the value is 128 byte or more.  
     * ```typescript
     * {
     *   rule: ValidateRule.byteLengthMax,
     *   args: [ 128 ],
     * }
     * ```
     */
    byteLengthMax = "byteLengthMax",
    /**
     * ***byteLengthBetween*** : If the length of the value (string) is outside the specified byte length range, an error is detected.
     *   
     * Below is an example of an error being detected if the value is outside the range of 10 to 128 byte.  
     * ```typescript
     * {
     *   rule: ValidateRule.byteLengthBetween,
     *   args: [ 10, 128 ],
     * }
     * ```
     */
    byteLengthBetween = "byteLengthBetween",
    /**
     * ***value*** : If the value is not equal to the specified value, an error occurs.
     *   
     * Below is an example of an error being detected if the value is other than 20.  
     * ```typescript
     * {
     *   rule: ValidateRule.value,
     *   args: [ 30 ],
     * }
     * ```
     */
    value = "value",
    /**
     * ***valueMin*** : If the value is less than or equal to the specified value, an error occurs.
     *   
     * Below is an example of an error being detected if the value is less than 10.  
     * ```typescript
     * {
     *   rule: ValidateRule.valueMin,
     *   args: [ 10 ],
     * }
     * ```
     */
    valueMin = "valueMin",
    /**
     * ***valueMax*** : If the value is greater than or equal to the specified value, an error occurs.
     *   
     * Below is an example of an error being detected if the value is 255 or more.  
     * ```typescript
     * {
     *   rule: ValidateRule.valueMax,
     *   args: [ 255 ],
     * }
     * ```
     */
    valueMax = "valueMax",
    /**
     * ***valueBetween*** : If the value is outside the specified range, an error is detected.
     *   
     * Below is an example of an error being detected if the value is outside the range of 10 to 255.  
     * ```typescript
     * {
     *   rule: ValidateRule.valueBetween,
     *   args: [ 10, 255 ],
     * }
     * ```
     */
    valueBetween = "valueBetween",
    /**
     * ***selected*** : If the value is not one of the options, an error occurs.  
     * ```typescript
     * {
     *    rule: ValidateRule.selected,
     *    args: [ "apple", "orange", "kiwi", "banana" ],
     * }
     * ```
     */
    selected = "selected",
    /**
     * ***selectedLength*** : If the value (array value) does not select the specified number of items, an error will be detected.
     * ```typescript
     * {
     *    rule: ValidateRule.selectedLength,
     *    args: [ 3 ],
     * }
     * ```
     */
    selectedLength = "selectedLength",
    /**
     * ***selectedLengthMin*** : If the number of values ​​(array values) selected is less than the specified number, an error will be detected.
     * ```typescript
     * {
     *    rule: ValidateRule.selectedLengthMin,
     *    args: [ 4 ],
     * }
     * ```
     */
    selectedLengthMin = "selectedLengthMin",
    /**
     * ***selectedLengthMax*** : If the number of selected values ​​(array values) is greater than the specified number, an error will occur.
     * ```typescript
     * {
     *    rule: ValidateRule.selectedLengthMax,
     *    args: [ 10 ],
     * }
     * ```
    */
    selectedLengthMax = "selectedLengthMax",
    /**
     * ***selectedLengthBetween*** : If you select a number of values ​​(array values) outside the specified range, an error will be detected.
     * ```typescript
     * {
     *    rule: ValidateRule.selectedLengthBetween,
     *    args: [ 5, 10 ],
     * }
     * ```
    */
    selectedLengthBetween = "selectedLengthBetween",
    /**
     * ***confirmed*** : If the value is not the same as the specified value, an error occurs.
     * ```typescript
     * {
     *    rule: ValidateRule.confirmed,
     *    args: [ "password" ],
     * }
     * ```
     */
    confirmed = "confirmed",
    /**
     * ***like*** : If the value does not contain the specified string, an error occurs.
     * ```typescript
     * {
     *    rule: ValidateRule.like,
     *    args: [ "word" ],
     * }
     * ```
     */
    like = "like",

    /**
     * ***characterExists*** : If the value contains characters that do not exist in the specified string, an error occurs..
     * ```typescript
     * {
     *    rule: ValidateRule.characterExists,
     *    args: [ "0123456789" ],
     * }
     * ```
    */
    characterExists = "characterExists",
    /**
     * ***alphaNumeric*** : If the value contains any characters other than half-width alphanumeric characters and specified special characters, an error is detected.
     * ```typescript
     * {
     *    rule: ValidateRule.alphaNumeric,
     * }
     * ```
     * Special characters can be allowed in args
     * ```typescript
     * {
     *    rule: ValidateRule.alphaNumeric,
     *    args: [ "-_=+/.," ],
     * }
     * ```
    */
    alphaNumeric = "alphaNumeric",
    /**
     * ***alphaNumericLower*** : If the value contains any characters other than half-width alphanumeric characters and specified special characters, an error is detected.  
     * Lowercase letters are allowed, but uppercase letters are not allowed.
     * ```typescript
     * {
     *    rule: ValidateRule.alphaNumericLower,
     * }
     * ```
     * Special characters can be allowed in args
     * ```typescript
     * {
     *    rule: ValidateRule.alphaNumericLower,
     *    args: [ "-_=+/.," ],
     * }
     * ```
     */
    alphaNumericLower = "alphaNumericLower",
    /**
     * ***alphaNumericUpper*** : If the value contains any characters other than half-width alphanumeric characters and specified special characters, an error is detected.  
     * Uppercase letters are allowed, but lowercase letters are not allowed.
     * ```typescript
     * {
     *    rule: ValidateRule.alphaNumericUpper,
     * }
     * ```
     * Special characters can be allowed in args
     * ```typescript
     * {
     *    rule: ValidateRule.alphaNumericUpper,
     *    args: [ "-_=+/.," ],
     * }
     * ```
     */
    alphaNumericUpper = "alphaNumericUpper",
    /**
     * ***alpha*** : An error is detected if the value contains any characters other than half-width English characters and the specified special characters.
     * ```typescript
     * {
     *    rule: ValidateRule.alpha,
     * }
     * ```
     * Special characters can be allowed in args
     * ```typescript
     * {
     *    rule: ValidateRule.alpha,
     *    args: [ "-_=+/.," ],
     * }
     * ``` 
     */
    alpha = "alpha",
    /**
     * ***alphaLower*** : An error is detected if the value contains any characters other than half-width English characters and the specified special characters.  
     * Lowercase letters are allowed, but uppercase letters are not allowed.
     * ```typescript
     * {
     *    rule: ValidateRule.alphaLower,
     * }
     * ```
     * Special characters can be allowed in args
     * ```typescript
     * {
     *    rule: ValidateRule.alphaLower,
     *    args: [ "-_=+/.," ],
     * }
     * ``` 
     */
    alphaLower = "alphaLower",
    /**
     * ***alphaUpper*** : An error is detected if the value contains any characters other than half-width English characters and the specified special characters.  
     * Uppercase letters are allowed, but lowercase letters are not allowed.
     * ```typescript
     * {
     *    rule: ValidateRule.alphaUpper,
     * }
     * ```
     * Special characters can be allowed in args
     * ```typescript
     * {
     *    rule: ValidateRule.alphaUpper,
     *    args: [ "-_=+/.," ],
     * }
     * ``` 
     */
    alphaUpper = "alphaUpper",
    /**
     * ***numeric*** : If the value contains any characters other than numeric characters and the specified special characters, an error is detected.
     * ```typescript
     * {
     *    rule: ValidateRule.numeric,
     * }
     * ```
     * Special characters can be allowed in args
     * ```typescript
     * {
     *    rule: ValidateRule.numeric,
     *    args: [ "-_=+/.," ],
     * }
     * ```
     */
    numeric = "numeric",
    /**
     * ***isHiranaga*** : If the value contains hiragana and any other characters than the specified special characters, an error is detected.
     * ```typescript
     * {
     *    rule: ValidateRule.isHiranaga,
     * }
     * ```
     * Special characters can be allowed in args
     * ```typescript
     * {
     *    rule: ValidateRule.isHiranaga,
     *    args: [ "-_=+/.," ],
     * }
     * ```
     */
    isHiranaga = "isHiranaga",
    /**
     * ***isKatakana*** : If the value contains katakana and any characters other than the specified special characters, an error is detected.
     * ```typescript
     * {
     *    rule: ValidateRule.isKatakana,
     * }
     * ```
     * Special characters can be allowed in args
     * ```typescript
     * {
     *    rule: ValidateRule.isKatakana,
     *    args: [ "-_=+/.," ],
     * }
     * ```
     */
    isKatakana = "isKatakana",
    /**
     * ***custom*** : For custom validation    
     * Execute validation using the specified function.
     * 
     * ```typescript
     * {
     *   rule: ValidateRule.custom,
     *   args: [ "customValidate" ],
     * }
     * ```
     * 
     * Then, place the customValidate method in the Validation-derived class as follows:
     * 
     * ```typescript
     * public customValidate (value : string, args :Array<string>, context : ValidateMethod) {
     *    if (value === "custom value") {
     *        return true;  
     *    }
     * }
     * ```
     * 
     */
    custom = "custom",
}

export interface ValidateRuleMaps {
    [name : string]: Array<ValidateRuleMap>,
}

export interface ValidateRuleMap {
    /**
     * ***rule*** : Specify the conditions to be checked for validation (required).
     * The value can be a string or a value from the ValidateRule enumeration.  
     * ```typescript
     * {
     *    rule: ValidateRule.required,
     * }
     * ```
     */
    rule : ValidateRule,

    /**
     * ***index*** : This allows you to perform a validation check on a specific index number when there are multiple identical items.
     */
    index?: number,

    /**
     * ***args*** : Specify the options for the validation check rules here.
     * ```typescript
     * {
     *    rule: ValidateRule.lengthBetween,
     *    args: [ 5, 30 ],      // <= Only strings between 5 and 30 characters are allowed.
     * }
     * ```
     */
    args? : Array<string | number>,

    /**
     * ***message*** : Output message when validation check error is detected.
     * ```typescript
     * {
     *    rule: ValidateRule.required,
     *    message: "No value entered!",
     * }
     * ```
     */
    message? : string,
}

export class ValidateErrorResult {

    /**
     * ***status*** : Verification check result flag.  
     * ``false`` means there is an error,  ``true`` means there is no error
     */
    public status : boolean = true;

    public fields : Array<string> = [];

    public fieldIndexs: {[name: string] : number} = {};

    public errors : ValidateRuleMaps = {};

    /**
     * ***get*** : Gets the results of validation checks for all items.
     * @returns {{[name : string] : Array<string>}}
     */
    public get() : {[name : string] : Array<string>};

    /**
     * ***get*** : Get the verification check results.
     * @param {string} name field Name
     * @returns {Array<string>}
     */
    public get(name : string) : Array<string>;

    /**
     * ***get*** : Get the verification check results.
     * @param {string} name field Name
     * @param {number} index Target index number
     * @returns {Array<string>}
     */
    public get(name : string, index : number) : Array<string>;

    public get(name? : string, index? : number) : Array<string> | {[name : string] : Array<string>} {
        let res;
        if (name) {
            res = [];
            const errors = this.errors[name];
            if (!errors) return;
            errors.forEach((error)=>{
                if (index && index != error.index) return;
                let message = error.message;
                if (!message) {
                    message = "rule = " + error.rule;
                    if (error.args) message += ", args = [" + error.args.join(",") + "]";
                    if (index) message += ", index = " + index;
                }
                res.push(message);
            });
        }
        else {
            res = {};
            this.fields.forEach((field) => {
                const fieldCount = this.fieldIndexs[field];
                if (fieldCount) {
                    for(let n = 0 ; n < fieldCount ; n++) {
                        const buffer = this.get(field, n);
                        if (buffer) {
                            if (!res[field]) res[field] = [];
                            res[field] = buffer;
                        }
                    }
                }
                else {
                    const buffer = this.get(field);
                    if (buffer) {
                        res[field] = buffer;
                    }
                }
            });
        }
        return res;
    }

    /**
     * ***bind*** : Based on the result of the validation check, an error message is bound to the error virtual DOM from the specified virtual DOM list.  
     * The virtual DOM must be created by specifying error.{fieldName} in the v attribute of HTML tags such as View.  
     * ```html
     * <div v="error.name"></div>
     * ```
     * @param {VirtualDomList} vdos Virtual DOM List
     * @returns {void}
     */
    public bind(vdos : VirtualDomList) : void;

    /**
     * ***bind*** : Based on the result of the validation check, an error message is bound to the error virtual DOM from the specified virtual DOM list.  
     * The virtual DOM must be created by specifying error.{fieldName} in the v attribute of HTML tags such as View.  
     * ```html
     * <div v="error.name"></div>
     * ```
     * @param {VirtualDomList} vdos Virtual DOM List
     * @param {string} name field name
     * @returns {void}
     */
    public bind(vdos : VirtualDomList, name : string) : void;

    /**
     * ***bind*** : Based on the result of the validation check, an error message is bound to the error virtual DOM from the specified virtual DOM list.  
     * The virtual DOM must be created by specifying error.{fieldName} in the v attribute of HTML tags such as View.  
     * ```html
     * <div v="error.name"></div>
     * ```
     * @param {VirtualDomList} vdos Virtual DOM List
     * @param {string} name field name
     * @param {number} index Index Number
     * @returns {void}
     */
    public bind(vdos : VirtualDomList, name : string, index : number) : void;

    public bind(vdos : VirtualDomList, name? : string, index? : number) : void {
        if (name) {
            if (!vdos.error) return;
            if (!vdos.error.childs[name]) return;
            let target : VirtualDom = vdos.error.childs[name];
            let result;
            if (index) {
                if (target.index(index)) {
                    target = target.index(index);
                    result = this.get(name, index);
                }
                else {
                    result = this.get(name);
                }
            }
            else {
                result = this.get(name);
            }

            if (!target) return;

            if (result) {
                target.addClass("active").text = result.join("\n");
            }
            else {
                target.removeClass("active").text = "";
            }
        }
        else {
            this.fields.forEach((field) => {
                if (this.fieldIndexs[field]) {
                    const fieldCount = this.fieldIndexs[field];
                    for(let n = 0 ; n < fieldCount ; n++) {
                        this.bind(vdos, field, n);
                    }
                }
                else {
                    this.bind(vdos, field);
                }
            });
        }
    }
}

/**
 * ***ValidateOption***
 * 
 */
export interface ValidateOption {

    /** ***oneMessage*** :  */
    oneMessage? : boolean,

}

/**
 * ***Validation*** : Class used for input data validation checks.  
 * There are two ways to set validation check rules:  
 * Create a Validation derived class in the ``app/validation`` directory and place it there, or  
 * Specify validation check rules directly using the ``verify`` method, etc.  
 */
export class Validation {

    /**
     * ***rules*** : Specify the validation check rules here.  
     * Exsample:
     * ```typescript
     * public rules : ValidateRuleMaps = {
     *    name: [
     *       {
     *          rule: ValidateRule.required,
     *          message: "name is empty.",
     *       },
     *       {
     *          rule: ValidateRule.lengthMax,
     *          args: [ 100 ],
     *          message: "Please enter within 100 characters.!",
     *       },
     *    ],
     * };
     * ```
     */
    public rules : ValidateRuleMaps;

    /**
     * ***verify*** : Runs validation checks on given input data.
     * @param {any} data Input data 
     * @returns {ValidateErrorResult}
     */
    public static verify(data: any) : ValidateErrorResult;

    /**
     * ***verify*** : Runs validation checks on given input data.
     * @param {any} data Input data 
     * @param {ValidateRuleMaps} rules Validation Check Rules
     * @returns {ValidateErrorResult}
     */
    public static verify(data: any, rules : ValidateRuleMaps) : ValidateErrorResult;

    /**
     * ***verify*** : Runs validation checks on given input data.
     * @param {any} data Input data 
     * @param {string} rules Validation Check Rules name
     * @returns {ValidateErrorResult}
     */
    public static verify(data: any, rules : string) : ValidateErrorResult;

    /**
     * ***verify*** : Runs validation checks on given input data.
     * @param {any} data Input data 
     * @param {string} rules Validation Check Rules name
     * @param {ValidateOption} options Validate Options
     * @returns {ValidateErrorResult}
     */
    public static verify(data: any, rules : string, options : ValidateOption) : ValidateErrorResult;

    public static verify(data: any, rules? : ValidateRuleMaps | string, options? : ValidateOption) : ValidateErrorResult {
        const my = new this();
        if (rules) {
            if (typeof rules == "string") {
                if (my[rules]) my.rules = my[rules];
            }
            else {
                my.rules = rules;
            }    
        }
        return my.verify(data);
    }

    /**
     * ***verify*** : Runs validation checks on given input data.
     * @param {any} data Input data 
     * @param {ValidateOption} options Validate Options
     * @returns {ValidateErrorResult}
     */
    public verify(data : any, options? : ValidateOption) : ValidateErrorResult {
        if (!options) options = {};
        const vm = new ValidateMethod(data, this);
        const c = Object.keys(this.rules);

        let result = new ValidateErrorResult();

        for (let n = 0 ; n < c.length ; n++) {
            const name = c[n];
            const rules = this.rules[name];

            result.fields.push(name);

            rules.forEach((rule) => {

                if (!vm[rule.rule]) return;

                const value = data[name];
                if (Array.isArray(value) && rule.rule.indexOf("selectedLength") === -1) {
                    result.fieldIndexs[name] = value.length;

                    value.forEach((v_, index) => {
                        const status = vm[rule.rule](v_, rule.args);
                        if (!status) {
                            if (!result.errors[name]) result.errors[name] = []; 
                            const errors : ValidateRuleMap = {
                                rule: rule.rule,
                                index: index,
                                args: rule.args,
                                message: rule.message,
                            };

                            if (options.oneMessage) {
                                result.errors[name][0] = errors;
                            }
                            else {
                                result.errors[name].push(errors);   
                            }
                        }
                    });
                }
                else {
                    const status = vm[rule.rule](data[name], rule.args);
                    if (!status) {
                        if (!result.errors[name]) result.errors[name] = []; 
                        result.errors[name].push({
                            rule: rule.rule,
                            args: rule.args,
                            message: rule.message,
                        });
                    }
                }
            });
        }

        if (Object.keys(result.errors).length) result.status = false;

        return result;
    }

    /**
     * ***verifyBind*** : After checking the input data for validity, the error content is automatically bound using the virtual DOM.
     * @param {VirtualDomList} vdos Virtual DOM Class List
     * @param {any} data input data
     * @returns {ValidateErrorResult} 
     */
    public static verifyBind(vdos: VirtualDomList, data: any) : ValidateErrorResult;

    /**
     * ***verifyBind*** : After checking the input data for validity, the error content is automatically bound using the virtual DOM.
     * @param {VirtualDomList} vdos Virtual DOM Class List
     * @param {any} data input data
     * @param {ValidateRuleMaps} rules Validation Check Rules
     * @returns {ValidateErrorResult} 
     */
    public static verifyBind(vdos: VirtualDomList, data: any, rules : ValidateRuleMaps) : ValidateErrorResult;
    
    public static verifyBind(vdos: VirtualDomList, data: any, rules? : ValidateRuleMaps) : ValidateErrorResult {
        const my = new this();
        if (rules) my.rules = rules;
        return my.verifyBind(vdos, data);
    }

    /**
     * ***verifyBind*** : After checking the input data for validity, the error content is automatically bound using the virtual DOM.
     * @param {VirtualDomList} vdos Virtual DOM Class List
     * @param {any} data input data
     * @returns {ValidateErrorResult} 
     */
    public verifyBind(vdos: VirtualDomList, data : any) : ValidateErrorResult {
        const result = this.verify(data);
        result.bind(vdos);
        return result;
    }
}

/**
 * ***ValidateMethod*** : Preset functions for validation checks.
 */
export class ValidateMethod {

    private input : any;

    private context : Validation;

    public constructor(input : any, context : Validation) {
        this.input = input;
        this.context = context;
    }

    private getArgValue(args : Array<string>, index : number) {
        if (!args) return;
        if (!args[index]) return;
        if (args[index].toString().indexOf("@") === 0) {
            return this.input[args[index].toString().substring(0)];
        }
        return args[index];
    }

    public required(value : any) : boolean {
        if (
            value === undefined ||
            value === null ||
            value === "" 
        ) {
            return false;
        }
        return true;
    }

    public length(value: any, args : Array<any>) : boolean {
        if (!this.required(value)) return true;
        const target = this.getArgValue(args, 0);
        if (Array.from(value).length !== target) return false;
        return true;
    }

    public lengthMin(value: any, args : Array<any>) : boolean {
        if (!this.required(value)) return true;
        const target = this.getArgValue(args, 0);
        if (Array.from(value).length < target) return false;
        return true;
    }

    public lengthMax(value: any, args : Array<any>) : boolean {
        if (!this.required(value)) return true;
        const target = this.getArgValue(args, 0);
        if (Array.from(value).length > target) return false;
        return true;
    }

    public lengthBetween(value: any, args : Array<any>) : boolean {
        if (!this.required(value)) return true;
        const targetMin = this.getArgValue(args, 0);
        const targetMax = this.getArgValue(args, 1);
        if (Array.from(value).length < targetMin) return false;
        if (Array.from(value).length > targetMax) return false;
        return true;
    }

    public byteLength(value: any, args : Array<any>) : boolean {
        if (!this.required(value)) return true;
        const target = this.getArgValue(args, 0);
        const byteValue = new TextEncoder().encode(value);
        if (byteValue.byteLength !== target) return false;
        return true;
    }

    public byteLengthMin(value: any, args : Array<any>) : boolean {
        if (!this.required(value)) return true;
        const target = this.getArgValue(args, 0);
        const byteValue = new TextEncoder().encode(value);
        if (byteValue.byteLength < target) return false;
        return true;
    }

    public byteLengthMax(value: any, args : Array<any>) : boolean {
        if (!this.required(value)) return true;
        const target = this.getArgValue(args, 0);
        const byteValue = new TextEncoder().encode(value);
        if (byteValue.byteLength > target) return false;
        return true;
    }

    public byteLengthBetween(value: any, args : Array<any>) : boolean {
        if (!this.required(value)) return true;
        const targetMin = this.getArgValue(args, 0);
        const targetMax = this.getArgValue(args, 1);
        const byteValue = new TextEncoder().encode(value);
        if (byteValue.byteLength < targetMin) return false;
        if (byteValue.byteLength > targetMax) return false;
        return true;
    }

    public value(value: any, args : Array<any>) : boolean {
        if (!this.required(value)) return true;
        const target = this.getArgValue(args, 0);
        if (value !== target) return false;
        return true;
    }

    public valueMin(value: any, args : Array<any>) : boolean {
        if (!this.required(value)) return true;
        const target = this.getArgValue(args, 0);
        if (value < target) return false;
        return true;
    }

    public valueMax(value: any, args : Array<any>) : boolean {
        if (!this.required(value)) return true;
        const target = this.getArgValue(args, 0);
        if (value > target) return false;
        return true;
    }

    public valueBetween(value: any, args : Array<any>) : boolean {
        if (!this.required(value)) return true;
        const targetMin = this.getArgValue(args, 0);
        const targetMax = this.getArgValue(args, 1);
        if (value < targetMin) return false;
        if (value > targetMax) return false;
        return true;
    }

    public selected(value : any, args : Array<any>) : boolean {
        if (!this.required(value)) return true;
        if(args.indexOf(value) === -1) return false;
        return true;
    }

    public selectedLength(value : any, args : Array<any>) : boolean {
        if (!this.required(value)) return true;
        const target = this.getArgValue(args, 0);
        if (value.length !== target) return false;
        return true;
    }
    
    public selectedLengthMin(value : any, args : Array<any>) : boolean {
        if (!this.required(value)) return true;
        const target = this.getArgValue(args, 0);
        if (value.length < target) return false;
        return true;
    }

    public selectedLengthMax(value : any, args : Array<any>) : boolean {
        if (!this.required(value)) return true;
        const target = this.getArgValue(args, 0);
        if (value.length > target) return false;
        return true;
    }

    public selectedLengthBetween(value : any, args : Array<any>) : boolean {
        if (!this.required(value)) return true;
        const targetMin = this.getArgValue(args, 0);
        const targetMax = this.getArgValue(args, 1);
        if (value.length < targetMin) return false;
        if (value.length > targetMax) return false;
        return true;
    }

    public confirmed(value : any, args : Array<any>) : boolean {
        if (!this.required(value)) return true;
        const target = this.getArgValue(args, 0);
        if (value != target) return false;
        return true;
    }

    public like(value : any, args : Array<any>) : boolean {
        if (!this.required(value)) return true;
        const target = this.getArgValue(args, 0);
        if (value.indexOf(target) === -1) return false;
        return true;
    }

    public characterExists(value : any, args: Array<any>) : boolean {
        if (!this.required(value)) return true;
        const target = this.getArgValue(args, 0);
        let status : boolean = true;
        for (let n = 0 ; n < value.toString().length ; n++) {
            const v = value.toString()[n];
            if (target.indexOf(v) === -1) {
                status = false;
                break;
            }
        }
        return status;
    }

    public alphaNumeric(value : any, args : Array<any>) : boolean {
        if (!this.required(value)) return true;
        const addChars = this.getArgValue(args, 0);
        let target = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
        if (addChars) target += addChars;
        return this.characterExists(value, [target]);
    }

    public alphaNumericLower(value : any, args : Array<any>) : boolean {
        if (!this.required(value)) return true;
        const addChars = this.getArgValue(args, 0);
        let target = "0123456789abcdefghijklmnopqrstuvwxyz";
        if (addChars) target += addChars;
        return this.characterExists(value, [target]);
    }

    public alphaNumericUpper(value : any, args : Array<any>) : boolean {
        if (!this.required(value)) return true;
        const addChars = this.getArgValue(args, 0);
        let target = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        if (addChars) target += addChars;
        return this.characterExists(value, [target]);
    }

    public alpha(value : any, args : Array<any>) : boolean {
        if (!this.required(value)) return true;
        const addChars = this.getArgValue(args, 0);
        let target = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
        if (addChars) target += addChars;
        return this.characterExists(value, [target]);
    }

    public alphaLower(value : any, args : Array<any>) : boolean {
        if (!this.required(value)) return true;
        const addChars = this.getArgValue(args, 0);
        let target = "abcdefghijklmnopqrstuvwxyz";
        if (addChars) target += addChars;
        return this.characterExists(value, [target]);
    }

    public alphaUpper(value : any, args : Array<any>) : boolean {
        if (!this.required(value)) return true;
        const addChars = this.getArgValue(args, 0);
        let target = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        if (addChars) target += addChars;
        return this.characterExists(value, [target]);
    }

    public numeric(value : any, args : Array<any>) : boolean {
        if (!this.required(value)) return true;
        const addChars = this.getArgValue(args, 0);
        let target = "0123456789";
        if (addChars) target += addChars;
        return this.characterExists(value, [target]);
    }

    public isHiranaga(value : any, args : Array<any>) : boolean {
        if (!this.required(value)) return true;
        const addChars = this.getArgValue(args, 0);
        let target = "あいうえおかきくけこがぎぐげござじずぜそただちつてとだぢづでとなにぬねのはひふへほばびぶべぼぱぴぷぺぽまみむめもやゆよらりるれろわをん";
        if (addChars) target += addChars;
        return this.characterExists(value, [target]);
    }

    public isKatakana(value : any, args : Array<any>) : boolean {
        if (!this.required(value)) return true;
        const addChars = this.getArgValue(args, 0);
        let target = "アイウエオカキクケコガギグゲゴザジズゼソタダチツテトダヂヅデトナニヌネノハヒフヘホバビブベボパピプペポマミムメモヤユヨラリルレロワヲン";
        if (addChars) target += addChars;
        return this.characterExists(value, [target]);
    }

    public custom(value : any, args : Array<any>) : boolean {
        const custom = this.context[args[0]];
        if (!custom) return true;
        return custom(value, args, this);
    }
}