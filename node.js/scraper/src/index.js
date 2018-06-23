import cluster from 'cluster';
import {config} from './config/config';
import { WorkerStatus, WorkerManager, Worker, WorkerProcess } from './modules/worker.module';

class MasterProcess {
    constructor(cluster, config){
        this._url = config.url || config.DEFAULT_URL;
        //////////////
        this._level = config.level || config.DEFAULT_LEVEL;
        this._currentLevel = 0;
        /////////////
        this.remaining_links = [
            [this._url]
        ];
        this.crawled_links = [];
        ///////////////////////
        /** @type {cluster} */
        this._cluster = cluster;
        this._workerManager = new WorkerManager();
    }
    start(){
        /** @type {cluster} */
        const cluster = this._cluster;
        if(cluster.isMaster){
            for(let i=0;i<config.DEFAULT_CONNECTION;i++){
                const worker = cluster.fork();
                
                this._workerManager.addWorker(new Worker(worker, i, 'free'));

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
        if(this.remaining_links[this._currentLevel].length>1){
            return this.remaining_links[this._currentLevel].splice(0,1);
        }else if(this._currentLevel < this._level){
            this._currentLevel++;
            if(this.remaining_links[this._currentLevel].length>1){
                return this.remaining_links[this._currentLevel].splice(0,1);
            }
        }
        return;
    }
    postLinkFetch(message){
        const {entry, links, level} = message;
        if(this.remaining_links.length > level){
            this.remaining_links[level].concat(links);
        }else{
            this.remaining_links[level] = links;
        }
        this.crawled_links[level-1].push(entry);
    }
    allotLinks(worker){
        let link;
        while(link = this.pluckLink()){

        }
        if(!link){

        }
        if(worker){

        }else{
            //initial alottment

        }
    }
}
const master = new MasterProcess(cluster,config);
master.start();