import { FetchData } from "../components/fetcher.component";
import { HTMLParser } from "../components/parser.component";
class Scraper {
    constructor(url){
        this._url = url
        this._fetcher = new FetchData(this._url);
    }
    async scrape(){
        let hrefs = [];
        try{
            const html = await this._fetcher.fetch();
            const Parser = new HTMLParser(html);
            const links = Parser.querySelectorAll('a[href*="medium.com"]');
            Parser.forEach(links, function(i, element){    
                var href = element.attr('href');
                hrefs.push(href);
            });
        }catch(err){
            console.log(err);
        }
        return hrefs;

    }
}
export {Scraper}