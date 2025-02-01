export enum AjaxMethod {
    GET = "GET",
    POST = "POST",
    PUT = "PUT",
    DELETE = "DELETE",
}

export interface AjaxOption {
    
    url : string,

    method? : AjaxMethod,

    data? : {[name : string] : string | number},

    responseType? : XMLHttpRequestResponseType,

    headers?: {[name : string] : string | number},

    async? : boolean,
}

export class Ajax {

    /**
     * ***send*** 
     * @param {AjaxOption} params Ajax Request Option
     * @returns 
     */
    public static async send(params : AjaxOption) : Promise<any> {
        let req = new XMLHttpRequest();
        if (params.headers) {
            const c = Object.keys(params.headers);
            for (let n = 0 ; n < c.length ; n++) {
                const name = c[n];
                const value = params.headers[name];
                req.setRequestHeader(name, value.toString());
            }
        }

        if (params.responseType) req.responseType = params.responseType;

        if (!params.async) params.async = false; 

        return new Promise((resolve, reject) => {

            req.onload = () => {
                const state = req.readyState;
                if (state == 200) {
                    resolve(req.responseText);
                }
                else {
                    reject(JSON.parse(req.response));
                }
            };

            req.open(params.method, params.url, params.async);
            req.send(null);
        });
    }

}