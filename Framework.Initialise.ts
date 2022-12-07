import { createLogger, transports, format } from "winston";
import {emptydir, emptydirSync, truncateSync} from "fs-extra";
import * as path from "path";

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 * if no TARGET is set via command line the framework defaults to the local environment
 */

async function setEnvironmentVariables() {
    const defaultEnvironment = 'local'
    logger.info('Setting environment variables...')
    require('dotenv').config({ path: `environment/.env.${ process.env.TARGET || defaultEnvironment }`});
    logger.info('Environment variables set...')
}

/**
 * Configure framework logger
 */
const { combine, timestamp, label, printf } = format;
const frameworkLogFormat = printf(({ level, message, label, timestamp }) => {
    return `${timestamp} [${label}] [${level.toUpperCase()}]: ${message}`;
})
export const logger = createLogger({
    format: combine(
        label({ label: 'FRAMEWORK' }),
        timestamp({format: 'DD-MM-YYYY HH:mm:ss'}),
        frameworkLogFormat
    ),
    transports: [
        new transports.Console(),
        new transports.File({
            dirname: 'logs',
            filename: 'combined.log'
        })
    ]
})

/**
 * Cleanup logs before each run
 */
const emptyLogs = async ()=> {
    try {
        // truncate the log file
        await truncateSync(path.join(__dirname, '/logs/combined.log'), 0)
        logger.info('Log files reset...')
    } catch (error) {
        logger.error(error)
    }
}

async function FrameworkInitialise(FullConfig) {
    logger.info('Initializing Test Automation Framework...')
    await setEnvironmentVariables()
    logger.info('Emptying logs directory...')
    await emptyLogs()
}

export default FrameworkInitialise
