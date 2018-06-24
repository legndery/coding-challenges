import MasterProcess from './modules/master.module'
import { config } from './config/config'
import cluster from 'cluster';
import { WorkerProcess } from "./modules/worker.module";
/**
 * 
 * Usage
 * npm start -- [-u <url>] [-l <level>] [-c <connection>] [-o <output_filename>]
 * If any of the value is not provided default value will be used
 * 
 */
if(cluster.isMaster){
    function processArguments(config, args){
        if(args.length %2){
            for(let i=0;i<args.length;i+=2){
                switch(args[i]){
                    case '-u': 
                    config.url = args[i+1];
                    break;
                    case '-o':
                    config.filename = args[i+1];
                    break;
                    case '-l':
                    if(!isNaN(Number(args[i+1]))){
                        config.level = parseInt(args[i+1]);
                    }
                    break;
                    case '-c':
                    if(!isNaN(Number(args[i+1]))){
                        config.CONNECTIONS = parseInt(args[i+1]);
                    }
                    break;
                }
            }
        }
    }
    const args = process.argv.slice(2);
    processArguments(config, args);
    new MasterProcess(cluster,config).start();
}else{
    new WorkerProcess().work();
}
