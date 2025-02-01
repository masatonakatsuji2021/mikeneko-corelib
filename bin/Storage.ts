import { App } from "App";

export class SessionStorage {

    public __name : string = "sbn_";

    public constructor(){

        const MyApp : typeof App = use("app/config/App").MyApp;

        if(MyApp.sessionStorage){
            this.__name = MyApp.sessionStorage;
        }
    }

    private _get(){
        var buff = sessionStorage.getItem(this.__name);
        return JSON.parse(buff);
    }

    public read(name : string) : any {
        var buff = this._get();

        if(buff[name]){
            return buff[name];
        }
        else{
            return buff;
        }
    }

    public write(name : string, value : any) : SessionStorage {
        var buff = this._get();
        buff[name] = value;
        sessionStorage.setItem(this.__name, JSON.stringify(buff));
        return this;
    }

    public delete(name : string) : SessionStorage {
        var buff = this._get();
        delete buff[name];
        sessionStorage.setItem(this.__name, JSON.stringify(buff));
        return this;
    }
}

export class LocalStorage {

    private __name : string = "sbn";

    public constructor(){

        const MyApp : typeof App = use("app/config/App").MyApp;
        
        if(MyApp.localStorage){
            this.__name = MyApp.localStorage;
        }
    }

    private _get(){
        var buff = localStorage.getItem(this.__name);
        return JSON.parse(buff);
    }

    public read(name : string) : any{
        var buff = this._get();

        if(buff[name]){
            return buff[name];
        }
        else{
            return buff;
        }
    }

    public write(name : string, value : any ) : LocalStorage {
        var buff = this._get();
        buff[name] = value;
        localStorage.setItem(this.__name, JSON.stringify(buff));
        return this;
    }

    public delete(name : string) : LocalStorage {
        var buff = this._get();
        delete buff[name];
        localStorage.setItem(this.__name, JSON.stringify(buff));
        return this;
    }
}