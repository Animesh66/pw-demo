import * as fs from 'fs';
import * as path from 'path';

/**
 * Logger - Utility class for logging test execution information
 * Provides static methods for logging at different levels with color support
 */
export class Logger {
    // ANSI color codes for console output
    private static readonly Colors = {
        reset: '\x1b[0m',
        bright: '\x1b[1m',
        red: '\x1b[31m',
        green: '\x1b[32m',
        yellow: '\x1b[33m',
        blue: '\x1b[34m',
        magenta: '\x1b[35m',
        cyan: '\x1b[36m',
        brightGreen: '\x1b[1m\x1b[32m',
        brightRed: '\x1b[1m\x1b[31m',
        brightYellow: '\x1b[1m\x1b[33m',
    };
    
    private static logDirectory: string = path.join(process.cwd(), 'logs');
    private static logFileName: string = `test-execution-${this.getTimestamp()}.log`;
    private static logFilePath: string = path.join(this.logDirectory, this.logFileName);
    
    /**
     * Initialize logger - creates log directory if it doesn't exist
     */
    static initialize(): void {
        if (!fs.existsSync(this.logDirectory)) {
            fs.mkdirSync(this.logDirectory, { recursive: true });
        }
        
        // Write log header
        this.writeToFile(`\n${'='.repeat(80)}\n`);
        this.writeToFile(`Test Execution Started: ${new Date().toLocaleString()}\n`);
        this.writeToFile(`${'='.repeat(80)}\n\n`);
    }
    
    /**
     * Log info level message
     */
    static info(message: string, data?: any): void {
        const logMessage = this.formatMessage('INFO', message, data);
        console.log(`${this.Colors.green}${message}${this.Colors.reset}`, data || '');
        this.writeToFile(logMessage);
    }
    
    /**
     * Log debug level message
     */
    static debug(message: string, data?: any): void {
        const logMessage = this.formatMessage('DEBUG', message, data);
        console.log(`${this.Colors.blue}${message}${this.Colors.reset}`, data || '');
        this.writeToFile(logMessage);
    }
    
    /**
     * Log warning level message
     */
    static warn(message: string, data?: any): void {
        const logMessage = this.formatMessage('WARN', message, data);
        console.warn(`${this.Colors.yellow}${message}${this.Colors.reset}`, data || '');
        this.writeToFile(logMessage);
    }
    
    /**
     * Log error level message
     */
    static error(message: string, error?: any): void {
        const logMessage = this.formatMessage('ERROR', message, error);
        console.error(`${this.Colors.red}${message}${this.Colors.reset}`, error || '');
        this.writeToFile(logMessage);
        
        // Log stack trace if error object is provided
        if (error && error.stack) {
            this.writeToFile(`Stack Trace: ${error.stack}\n`);
        }
    }
    
    /**
     * Log success level message
     */
    static success(message: string, data?: any): void {
        const logMessage = this.formatMessage('SUCCESS', message, data);
        console.log(`${this.Colors.brightGreen}${message}${this.Colors.reset}`, data || '');
        this.writeToFile(logMessage);
    }
    
    /**
     * Log test step
     */
    static step(stepNumber: number, stepName: string): void {
        const message = `Step ${stepNumber}: ${stepName}`;
        const separator = '-'.repeat(60);
        console.log(`\n${this.Colors.cyan}${separator}${this.Colors.reset}`);
        console.log(`${this.Colors.cyan}${message}${this.Colors.reset}`);
        console.log(`${this.Colors.cyan}${separator}${this.Colors.reset}`);
        
        this.writeToFile(`\n${separator}\n`);
        this.writeToFile(`STEP: ${message}\n`);
        this.writeToFile(`${separator}\n`);
    }
    
    /**
     * Log test start
     */
    static testStart(testName: string): void {
        const separator = '='.repeat(80);
        const message = `TEST STARTED: ${testName}`;
        
        console.log(`\n${this.Colors.magenta}${separator}${this.Colors.reset}`);
        console.log(`${this.Colors.magenta}${message}${this.Colors.reset}`);
        console.log(`${this.Colors.magenta}${separator}${this.Colors.reset}\n`);
        
        this.writeToFile(`\n${separator}\n`);
        this.writeToFile(`${message}\n`);
        this.writeToFile(`Time: ${new Date().toLocaleString()}\n`);
        this.writeToFile(`${separator}\n\n`);
    }
    
    /**
     * Log test end
     */
    static testEnd(testName: string, status: 'PASSED' | 'FAILED' | 'SKIPPED'): void {
        const separator = '='.repeat(80);
        const message = `TEST ${status}: ${testName}`;
        const color = status === 'PASSED' ? this.Colors.brightGreen : 
                      status === 'FAILED' ? this.Colors.brightRed : 
                      this.Colors.brightYellow;
        
        console.log(`\n${color}${separator}${this.Colors.reset}`);
        console.log(`${color}${message}${this.Colors.reset}`);
        console.log(`${color}${separator}${this.Colors.reset}\n`);
        
        this.writeToFile(`\n${separator}\n`);
        this.writeToFile(`${message}\n`);
        this.writeToFile(`Time: ${new Date().toLocaleString()}\n`);
        this.writeToFile(`${separator}\n\n`);
    }
    
    /**
     * Log API request
     */
    static apiRequest(method: string, url: string, payload?: any): void {
        this.info(`API Request: ${method} ${url}`);
        if (payload) {
            this.debug('Request Payload:', JSON.stringify(payload, null, 2));
        }
    }
    
    /**
     * Log API response
     */
    static apiResponse(statusCode: number, response?: any): void {
        this.info(`API Response: Status ${statusCode}`);
        if (response) {
            this.debug('Response Data:', JSON.stringify(response, null, 2));
        }
    }
    
    /**
     * Format log message with timestamp and level
     */
    private static formatMessage(level: string, message: string, data?: any): string {
        const timestamp = new Date().toISOString();
        let formattedMessage = `[${timestamp}] [${level.padEnd(7)}] ${message}`;
        
        if (data !== undefined) {
            if (typeof data === 'object') {
                formattedMessage += `\n${JSON.stringify(data, null, 2)}`;
            } else {
                formattedMessage += ` ${data}`;
            }
        }
        
        return formattedMessage + '\n';
    }
    
    /**
     * Write message to log file
     */
    private static writeToFile(message: string): void {
        try {
            // Ensure log directory exists before writing
            if (!fs.existsSync(this.logDirectory)) {
                fs.mkdirSync(this.logDirectory, { recursive: true });
            }
            fs.appendFileSync(this.logFilePath, message);
        } catch (error) {
            console.error('Failed to write to log file:', error);
        }
    }
    
    /**
     * Get current timestamp in format YYYY-MM-DD_HH-MM-SS
     */
    private static getTimestamp(): string {
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const seconds = String(now.getSeconds()).padStart(2, '0');
        
        return `${year}-${month}-${day}_${hours}-${minutes}-${seconds}`;
    }
    
    /**
     * Get log file path
     */
    static getLogFilePath(): string {
        return this.logFilePath;
    }
    
    /**
     * Clear old log files (keeps last N log files)
     */
    static clearOldLogs(keepCount: number = 10): void {
        try {
            if (!fs.existsSync(this.logDirectory)) {
                return;
            }
            
            const files = fs.readdirSync(this.logDirectory)
                .filter(file => file.endsWith('.log'))
                .map(file => ({
                    name: file,
                    path: path.join(this.logDirectory, file),
                    time: fs.statSync(path.join(this.logDirectory, file)).mtime.getTime()
                }))
                .sort((a, b) => b.time - a.time);
            
            // Delete old files beyond keepCount
            files.slice(keepCount).forEach(file => {
                fs.unlinkSync(file.path);
                this.info(`Deleted old log file: ${file.name}`);
            });
        } catch (error) {
            this.error('Failed to clear old logs', error);
        }
    }
}
