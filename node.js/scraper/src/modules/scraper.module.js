import { FetchData } from "./fetcher.module";
import { HTMLParser } from "./parser.module";
class Scraper {
    constructor(url){
        this._url = url
        this._fetcher = new FetchData(this._url);
    }
    async scrape(){
        const html = await this._fetcher.fetch();
        const Parser = new HTMLParser(html);
        const links = Parser.querySelectorAll('a[href*="medium.com"]');
        
        let hrefs = [];
        Parser.forEach(links, function(i, element){    
            var href = element.attr('href');
            hrefs.push(href);
        });
        return hrefs;
    }
}
export {Scraper}