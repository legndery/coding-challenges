import cheerio from 'cheerio';
class HTMLParser {
    /**
     * @constructor 
     */
    constructor(html){
        this.$ = cheerio.load(html);
    }
    querySelectorAll(selector){
        const $ = this.$;
        const doms = $(selector);
        return doms;
    }
}
export {
    HTMLParser
}