import cluster from 'cluster';
import {config} from './config/config';
import { WorkerStatus, WorkerManager, Worker, WorkerProcess } from './modules/worker.module';
import  { WriteToFile } from './utils/io.util'
class MasterProcess {
    constructor(cluster, config){
        this._cluster = cluster;
        this._config = config;
    }
    initiateForMaster(){
        this._url = this._config.url || this._config.DEFAULT_URL;
        this.filename = this._config.filename || this._config.DEFAULT_FILENAME;
        //////////////
        this._level = this._config.level || this._config.DEFAULT_LEVEL;
        this._currentLevel = 0;
        /////////////
        this.remaining_links_number = 1;
        this.remaining_links = [
            [this._url]
        ];
        this.crawled_links = [];
        this.linkMap = {};
        ///////////////////////
        this._workerManager = new WorkerManager();
        //start logging
        WriteToFile.writeArray(this.filename, [this._url]);
    }
    start(){
        /** @type {cluster} */
        const cluster = this._cluster;
        if(cluster.isMaster){
            this.initiateForMaster();
            for(let i=0;i<config.DEFAULT_CONNECTION;i++){
                const worker = cluster.fork();
                
                this._workerManager.addWorker(new Worker(worker, i, WorkerStatus.__FREE__));

                worker.on('message', (message)=>{
                    this.postLinkFetch(message);
                    // there is a free worker now
                    this._workerManager.getWorkerAt(i).setStatus(WorkerStatus.__FREE__);
                    this.allotLinks();
                });
            }
            this.allotLinks();

        }else if(cluster.isWorker){
            //create connection
            new WorkerProcess().work();
        }
    }
    pluckLink(){
        // console.log(this.remaining_links);
        // console.log(this._currentLevel, this._level);
        // 1 no links are there
        // 2 level reached
        // 3 no links in level
        const link = {
            error: 0,
        }
        if(this.remaining_links_number <= 0) {
            link.error = 1;
            return link;
        }

        if(this.remaining_links[this._currentLevel].length>0){
            console.log('here i am')
            link.link = this.remaining_links[this._currentLevel].splice(0,1)[0];
        }else if(this._currentLevel < this._level){
            //one level completed
            console.log('one level completed');
            this._currentLevel++;
            // console.log(this._currentLevel, this._level);
            if(this.remaining_links[this._currentLevel].length>0){
                link.link = this.remaining_links[this._currentLevel].splice(0,1)[0];
            }else{
                link.error = 3;
            }
        }else if(this._currentLevel === this._level){
            link.error = 2;
        }
        if(link.error === 0){
            this.remaining_links_number -=1;
        }
        
        return link;
    }
    postLinkFetch(message){
        const {entry, links, level} = message;
        const filteredLinks = links.filter((link)=>{
            if(this.linkMap[link]){
                return false
            }else{
                this.linkMap[link] = true;
                return true;
            }
        });
        if(this.remaining_links.length > level){
            this.remaining_links[level].concat(filteredLinks);
        }else{
            this.remaining_links[level] = filteredLinks;
        }

        WriteToFile.loglinks('log.txt', filteredLinks);

        console.log(filteredLinks.length);
        this.remaining_links_number += filteredLinks.length;
        this.crawled_links.push(entry);
    }
    allotLinks(){
        const workers = this._workerManager.getFreeWorkers();
        let link, error;
        for(let i=0;i<workers.length;i++){
            const worker = workers[i];
            ({ link, error} = this.pluckLink());
            if(link){
                worker.setStatus(WorkerStatus.__BUSY__);
                worker.getWorker().send({
                    url: link,
                    level: this._currentLevel
                });
            }
            break;
        }
        switch(error){
            case 1:
            if(this._workerManager.getBusyWorkers().length > 0){
                break;
            }
            case 2:
            this._workerManager.getFreeWorkers().forEach((workers, index)=>{
                workers.getWorker().disconnect();
                this._workerManager.removeWorker(index);
            });
        }
    }
}
config.level = 1;
config.url='https://medium.com/javascript-studio/visualizing-call-trees-c3a68865853a'
const master = new MasterProcess(cluster,config);
master.start();