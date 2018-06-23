import { WorkerStatus, WorkerManager, Worker, WorkerProcess } from '../modules/worker.module';
import  { WriteToFile } from '../utils/io.util'

class MasterProcess {
    constructor(cluster, config){
        this._cluster = cluster;
        this._config = config;
    }
    /**
     * This is mostly the constructor part. But in worker process this will be instantiated to so the
     * below portion is decoupled.
     */
    initiateForMaster(){
        this._url = this._config.url || this._config.DEFAULT_URL;
        this.filename = this._config.filename || this._config.DEFAULT_FILENAME;
        //////////////
        this._level = this._config.level===0?0:(this._config.level || this._config.DEFAULT_LEVEL);
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
            for(let i=0;i<this._config.CONNECTIONS;i++){
                const worker = cluster.fork();
                
                this._workerManager.addWorker(new Worker(worker, i, WorkerStatus.__FREE__));

                worker.on('message', (message)=>{
                    this.postLinkFetch(message);
                    // there is a free worker now
                    this._workerManager.setWorkerStatus(i, WorkerStatus.__FREE__);
                    
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
        let level = 0;
        while(level <= this._level){
            if(this.remaining_links[level].length>0){
                link.link = this.remaining_links[level].splice(0,1)[0];
                link.level = level;
                break;
            }
            level++;
        }
        if(level >= this._level){
            link.error = 2;
        }
        if(link.error === 0){
            this.remaining_links_number -=1;
        }
        // console.log(link);
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
            this.remaining_links[level] = this.remaining_links[level].concat(filteredLinks);
        }else{
            this.remaining_links[level] = filteredLinks;
        }
        // console.log(filteredLinks.length, level);
        // console.log(this.remaining_links[level].length);
        WriteToFile.loglinks('log.txt', filteredLinks);
        this.remaining_links_number += filteredLinks.length;
        this.crawled_links.push(entry);
    }
    allotLinks(){
        const workers = this._workerManager.getFreeWorkers();
        let link, error, level;
        for(let i=0;i<workers.length;i++){
            const worker = workers[i];
            ({ link, error, level} = this.pluckLink());
            if(link){
                this._workerManager.setWorkerStatus(worker.getIndex(), WorkerStatus.__BUSY__);
                worker.getWorker().send({
                    url: link,
                    level: level
                });
            }else{
                break;
            }
        }
        if(error>0 && this._workerManager.getBusyWorkers().length <= 0){

            this._workerManager.getFreeWorkers().forEach((worker)=>{
                console.log('disconnecting');
                worker.getWorker().disconnect();
                this._workerManager.removeWorker(worker.getIndex());
            });
            
        }
    }
}

export default MasterProcess;