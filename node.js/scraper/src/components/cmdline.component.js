import chalk from 'chalk';
class CmdStyler {

    setTitle(str){
        process.stdout.cursorTo(0,0);
        process.stdout.clearLine();
        process.stdout.write(chalk.green.bold("Status: "+str+'\n'));
        
    }
    setStringAt(line, text){
        process.stdout.cursorTo(0,line);
        process.stdout.clearLine();
        process.stdout.write(text+'\n');
    }
    clearScreen(){
        process.stdout.write('\x1Bc ');
    }
}
export { CmdStyler };