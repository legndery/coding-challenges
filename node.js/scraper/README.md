## Coding challenge for node.js scraper
Write a scraper in node.js that will fetch all internal urls from all pages of medium.com (recursively) and save them into a file. The number of concurrent connection should be maintained to 5 at any given point in time. 

### Instructions
* You are not supposed to use any external scraping library.
* You are not supposed to use any external connection management library.
* Maintain your code on github along with proper readme files containing all instructions to setup and run the code
* Follow standard coding practices of the language.

## Solution in NodeJS
* Used `request` to fetch the link  
* Used internal `cluster` to make cluster of workers for parallel scraping  
* Used `cheerio` for parsing the link
* Standard ES6/ES7 `classes`, `async/await` and modular pattern has been used
* `Webpack` to Bundle the files.

### Parts
* There are Two Modules `Worker` and `Master`. They Both contain respective management functions
* There are 4 modules:
    * `CommandLine`: Which shows the status in console.
    * `Fetcher`: Fetches the link and returns html
    * `Parser`: Parses any HTML, has very basic functions which were needed
    * `Scraper`: Takes a link and returned crawlable hrefs using `Fetcher` and `Parser`
* One utility script to save the link to file.

### Setup and Usage
The repository can be setup and run using standard steps, which are cloning the repo, installing the dependencies and running `npm start`  

```bash
#Running with Default Configuration

git clone git@github.com:legndery/coding-challenges.git #clone
cd coding-challenges/node.js/scraper #goto dir
npm i #install dependencies
npm start # start executing
```

#### Options

```bash
npm start -- [-u <url>] [-l <level>] [-c <connection>] [-o <output_filename>]
```
`-u <url>` The entry point. Default: `https://medium.com/javascript-studio/visualizing-call-trees-c3a68865853a` 
`-l <level>` Maximum Depth. Default: `2`
`-c <connection>` Parallel connections. Default: `5`
`-o <output>` Filename to write. Default: `log.txt`
