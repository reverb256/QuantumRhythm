import chalk from 'chalk';
import { config } from './config.js';

class Logger {
  constructor() {
    this.levels = {
      error: 0,
      warn: 1,
      info: 2,
      debug: 3
    };
    this.currentLevel = this.levels[config.logLevel] || 2;
  }

  formatTimestamp() {
    return new Date().toISOString().replace('T', ' ').substr(0, 19);
  }

  log(level, message, data = null) {
    if (this.levels[level] > this.currentLevel) return;

    const timestamp = this.formatTimestamp();
    const prefix = `[${timestamp}] [${level.toUpperCase()}]`;
    
    let coloredMessage;
    switch (level) {
      case 'error':
        coloredMessage = chalk.red(`${prefix} ${message}`);
        break;
      case 'warn':
        coloredMessage = chalk.yellow(`${prefix} ${message}`);
        break;
      case 'info':
        coloredMessage = chalk.blue(`${prefix} ${message}`);
        break;
      case 'debug':
        coloredMessage = chalk.gray(`${prefix} ${message}`);
        break;
      default:
        coloredMessage = `${prefix} ${message}`;
    }

    console.log(coloredMessage);
    
    if (data) {
      console.log(chalk.dim(JSON.stringify(data, null, 2)));
    }
  }

  error(message, data) {
    this.log('error', message, data);
  }

  warn(message, data) {
    this.log('warn', message, data);
  }

  info(message, data) {
    this.log('info', message, data);
  }

  debug(message, data) {
    this.log('debug', message, data);
  }

  // Trading specific logging
  trade(type, token, amount, price, profit = null) {
    const profitStr = profit ? chalk.green(`+${profit.toFixed(4)} SOL`) : '';
    this.info(
      chalk.cyan(`TRADE ${type.toUpperCase()}: ${amount} ${token} @ ${price} SOL ${profitStr}`)
    );
  }

  balance(token, amount, usdValue = null) {
    const usdStr = usdValue ? ` ($${usdValue.toFixed(2)})` : '';
    this.info(chalk.magenta(`BALANCE: ${amount} ${token}${usdStr}`));
  }

  opportunity(message, data) {
    this.info(chalk.green(`OPPORTUNITY: ${message}`), data);
  }

  safety(message, data) {
    this.warn(chalk.red(`SAFETY: ${message}`), data);
  }
}

export const logger = new Logger();
export default logger;