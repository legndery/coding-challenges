import { Scraper } from './scraper.module'
class WorkerStatus {
    static get __BUSY__(){
        return 'busy';
    }
    static get __FREE__(){
        return 'free';
    }
}
class Worker {
    constructor(worker, index, status){
        this._worker = worker;
        this._index = index;
        this._status = status;
    }
    isBusy(){
        return this._status === WorkerStatus.__BUSY__;
    }
    isFree(){
        return this._status === WorkerStatus.__FREE__;
    }
    setStatus(str){
        if(str === WorkerStatus.__BUSY__ || str === WorkerStatus.__FREE__)
            this._status = str;
    }
    getWorker(){
        return this._worker;
    }
    getIndex(){
        return this._index;
    }
}
class WorkerManager {
    constructor(){
        this._workers = [];
        this._workerStatus = {
            free:[],
            busy:[]
        }
    }
    /**
     * 
     * @param {Worker} worker 
     */
    addWorker(worker){
        this._workers.push(worker);
        if(worker.isFree()){
            this.addFreeWorker(worker);
        }else{
            this.addBusyWorker(worker);
        }
    }
    /**
     * 
     * @param {Worker} worker 
     */
    addFreeWorker(worker){
        this._workerStatus.free.push(worker.getIndex());
    }
    /**
     * 
     * @param {Worker} worker 
     */
    addBusyWorker(worker){
        this._workerStatus.busy.push(worker.getIndex());
    }
    /**
     * @returns {[Worker]}
     */
    getBusyWorkers(){
        return this._workerStatus.busy.map((index)=>{
            return this._workers[index];
        })
    }
    /**
     * @returns {[Worker]}
     */
    getFreeWorkers(){
        return this._workerStatus.free.map((index)=>{
            return this._workers[index];
        })
    }
    /**
     * 
     * @param {Number} index 
     * @returns {Worker}
     */
    getWorkerAt(index){
        return this._workers[index];
    }
}
class WorkerProcess{

    work(){
        process.on('message', async function(message) {
            const {url, level} = message;
            const scraper = new Scraper(url);
            const links = await scraper.scrape();
            process.send(
                {
                    entry: url,
                    links,
                    level: level+1
                }
            );
        });
    }
}
export { WorkerStatus, WorkerManager, WorkerProcess, Worker} ;