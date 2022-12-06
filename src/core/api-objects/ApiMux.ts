import {IApiObject} from "./iApiObject";
import {Page} from "@playwright/test";
import {Observer} from "../../../store/iPublisherObserver";
import {envTestData} from "../../../store/data/data-types";
import {logger} from "../../../Framework.Initialise";

export class ApiMux implements IApiObject, Observer {
    page: Page
    testData: envTestData

    getDataUpdate(data: envTestData): void {
        logger.info( `[${this.constructor.name}] Receiving test data...[${Object.keys(data)}]`)
        this.testData = data
    }
    // Send request to API; Playwright requires method, url, header and body
    /**
     *
     * @param method: string -- GET, POST, PUT, DELETE
     * @param url: string -- URL of API
     * @param header: object -- Call header in JSON format
     * @param body: object -- Call body in JSON format
     */
    async sendRequest(method: string, url: string, header: object, body: object): Promise<any> {
        logger.info( `[${this.constructor.name}] Sending request to API...[${url}]`)
        await this.page.request[method](url, header, body)
    }
}