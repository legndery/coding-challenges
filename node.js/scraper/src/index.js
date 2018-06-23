import cluster from 'cluster';
import {config} from './config/config';
import { WorkerProcess } from './modules/workerProcess';

class MasterProcess {
    constructor(cluster, config){
        this._url = config.url || config.DEFAULT_URL;
        this._level = config.level || config.DEFAULT_LEVEL;
        this.remaining_links = [];
        this.crawled_links = [];
        /** @type {cluster} */
        this._cluster = cluster;
        this._workers = [];
        this._currentWorker = [];
    }
    start(){
        /** @type {cluster} */
        const cluster = this._cluster;
        if(cluster.isMaster){
            //inititate scrape
            for(let i=0;i<config.DEFAULT_CONNECTION;i++){
                const worker = cluster.fork();
                this._workers.push(worker);
                worker.on('message', (message)=>{

                });
            }
            this._workers.forEach((worker) =>{
                console.log(`Master ${process.pid} sends message to worker ${worker.process.pid}...`);
                worker.send({ msg: `Message from master ${process.pid}` });    
            }, this);
        }else if(cluster.isWorker){
            //create connection
            new WorkerProcess().work();
        }
    }
}
const master = new MasterProcess(cluster,config);
master.start();