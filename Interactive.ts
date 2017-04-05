import * as readline from "readline";
import {Logger} from "./log";

export class Interactive {
  constructor(private logger: Logger) {
  }

  start() {
    const rl = readline.createInterface({input: process.stdin, output: process.stdout});
    rl.setPrompt('udb> ');
    rl.prompt();

    rl.on('line', (line) => {
      switch (line.trim()) {
        case 'exit':
          rl.close();
          process.stdin.destroy();
          return;
        default:
          console.log(`Say what? I might have heard \`${line.trim()}\``);
          break;
      }
      rl.prompt();
    }).on('close', () => {
      this.logger.logVerbose('Exiting');
      rl.close();
    });
  }
}