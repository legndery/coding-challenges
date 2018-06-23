import { Scraper } from './scraper'
class WorkerProcess{

    work(){
        process.on('message', function(message) {
            console.log(`Worker ${process.pid} recevies message '${JSON.stringify(message)}'`);
        });
    }
}
export { WorkerProcess} ;