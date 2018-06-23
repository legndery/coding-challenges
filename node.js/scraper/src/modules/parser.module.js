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
    forEach(doms, callback){
        const $ = this.$;
        $(doms).each(function(i,element){
            return callback(i,$(element));
        });
    }
}
export {
    HTMLParser
}