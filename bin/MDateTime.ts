export class MDateTime extends Date {

    /**
     * ***format*** : Get date and time from format  
     * @returns {string}
     * * It will be replaced with the following:  
     * 
     * |||
     * |:--|:--|
     * |**YYYY**|year(Display the year in four digits)|
     * |**MM**|month(Displayed with 2 digits padded with zeros)|
     * |**M**|month|
     * |**DD**|day(Displayed with 2 digits padded with zeros)|
     * |**D**|day|
     * |**W**|day of week|
     * |**HH**|hour(Displayed with 2 digits padded with zeros)|
     * |**H**|hour|
     * |**II**|minuts(Displayed with 2 digits padded with zeros)|
     * |**I**|minuts|
     * |**SS**|second(Displayed with 2 digits padded with zeros)|
     * |**S**|second|
     * |**U**|Elapsed time(Show in milliseconds)|
     * |**LDD**|Last day of the month|
     * ||(Displayed with 2 digits padded with zeros)|
     * |**LD**|Last day of the month|
     * |**LW**|Last day of the month|
     */
    public format() : string;

    /**
     * ***format*** : Get date and time from format
     * @param {string} format Specified format
     * @returns {string}
     * * It will be replaced with the following:  
     * 
     * |||
     * |:--|:--|
     * |**YYYY**|year(Display the year in four digits)|
     * |**MM**|month(Displayed with 2 digits padded with zeros)|
     * |**M**|month|
     * |**DD**|day(Displayed with 2 digits padded with zeros)|
     * |**D**|day|
     * |**W**|day of week|
     * |**HH**|hour(Displayed with 2 digits padded with zeros)|
     * |**H**|hour|
     * |**II**|minuts(Displayed with 2 digits padded with zeros)|
     * |**I**|minuts|
     * |**SS**|second(Displayed with 2 digits padded with zeros)|
     * |**S**|second|
     * |**U**|Elapsed time(Show in milliseconds)|
     * |**LDD**|Last day of the month|
     * ||(Displayed with 2 digits padded with zeros)|
     * |**LD**|Last day of the month|
     * |**LW**|Last day of the month|
     */
    public format(format? : string) : string;

    public format(format? : string) : string{
        if(format == undefined) format = "YYYY/MM/DD HH:II:SS";
        format = format.split("YYYY").join(this.getFullYear().toString());
        format = format.split("MM").join(("00" + (this.getMonth() + 1).toString()).slice(-2));
        format = format.split("M").join((this.getMonth() + 1).toString());
        format = format.split("LDD").join(("00" + this.getLastDate().toString()).slice(-2));
        format = format.split("LD").join(this.getLastDate().toString());
        format = format.split("DD").join(("00" + this.getDate().toString()).slice(-2));
        format = format.split("D").join(this.getDate().toString());
        format = format.split("LW").join(this.getLastDay().toString());
        format = format.split("W").join(this.getDay().toString());
        format = format.split("HH").join(("00" + this.getHours().toString()).slice(-2));
        format = format.split("H").join(this.getHours().toString());
        format = format.split("II").join(("00" + this.getMinutes().toString()).slice(-2));
        format = format.split("I").join(this.getMinutes().toString());
        format = format.split("SS").join(("00" + this.getSeconds().toString()).slice(-2));
        format = format.split("S").join(this.getSeconds().toString());
        format = format.split("U").join(this.getTime().toString());  
        return format;
    }

    /**
     * ***getLastDate** : Get the last day of the month.
     * @returns {number}
     */
    public getLastDate() : number {
        const d_ = new Date(this);
        d_.setMonth(d_.getMonth() + 1);
        d_.setDate(0);
        return d_.getDate();
    }

    /**
     * ***getLastDay** : Get the last day of the month.
     * @returns {number}
     */
    public getLastDay() : number {
        const d_ = new Date(this);
        d_.setMonth(d_.getMonth() + 1);
        d_.setDate(0);
        return d_.getDay();
    }

    public nextDate() : MDateTime {
        const d_ = new Date(this);
        d_.setDate(this.getDate() + 1);
        return new MDateTime(d_);
    }

    public prevDate() : MDateTime {
        const d_ = new Date(this);
        d_.setDate(this.getDate() - 1);
        return new MDateTime(d_);
    }

    public nextMonth() : MDateTime {
        const d_ = new Date(this);
        d_.setMonth(this.getMonth() + 1);
        return new MDateTime(d_);
    }

    public prevMonth() : MDateTime {
        const d_ = new Date(this);
        d_.setMonth(this.getMonth() - 1);
        return new MDateTime(d_);
    }

}    