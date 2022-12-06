// https even logger
import {Page} from "@playwright/test";
import {logger} from "../../../Framework.Initialise";

export const httpLogEvents = (page: Page) => {
    //  value will default to false when empty
    const logEvents = process.env.LOG_ALL

    if (logEvents === 'true') { // if LOG_ALL is set to true
        page.on('request', request => {
            logger.info(`>>> ${request.method()}: ${request.url()}`);
        });
        page.on('response', response => {
            logger.info(`<<< ${response.status()}: ${response.url()}`);
        });
    }
}
