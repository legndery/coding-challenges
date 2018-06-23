import fs from 'fs';
class WriteToFile{
    /**
     * 
     * @param {String} filename 
     * @param {[]} array 
     */
    static writeArray(filename, array){
        fs.writeFileSync(filename, array.join('\n')+"\n");
    }
    static loglinks(filename, array){
        fs.appendFileSync(filename, array.join('\n'))
    }
}
export {WriteToFile}