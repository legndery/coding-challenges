import MasterProcess from './modules/master.module'
import { config } from './config/config'
import cluster from 'cluster';
/**
 * 
 * Usage
 * npm start -- [-u <url>] [-l <level>] [-c <connection>] [-o <output_filename>]
 * If any of the value is not provided default value will be used
 * 
 */
if(cluster.isMaster){
    const args = process.argv.slice(2);
    if(args.length %2){
        
    }
    config.level = 1;
    config.url='https://medium.com/javascript-studio/visualizing-call-trees-c3a68865853a'
    const master = new MasterProcess(cluster,config);
    master.start();
}
