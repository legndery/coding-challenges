import { FetchData } from "./fetcher";
import { HTMLParser } from "./parser";
class Scraper {
    constructor(url){
        this._url = config.url || config.DEFAULT_URL;
        this._fetcher = new FetchData(this._url);
    }
    async scrape(){
        const html = await this._fetcher.fetch();
        const Parser = new HTMLParser(html);
        const links = Parser.querySelectorAll('a[href*=medium.com/]');
        return links;
    }
}
export {Scraper}