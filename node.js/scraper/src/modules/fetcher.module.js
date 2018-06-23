import request from 'request';
class FetchData {
    constructor(url){
        this._url = url;
    }
    async fetch(){
        return await new Promise((resolve, reject)=> {
            request(this._url, (error, response, html)=> {
                if(!error){
                    resolve(html);
                }else reject(error);
            });
        });
    }
}
export { FetchData };