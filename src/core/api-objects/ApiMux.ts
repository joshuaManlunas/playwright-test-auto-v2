import {IApiObject} from "./iApiObject";
import {Page} from "@playwright/test";
import {Observer} from "../../../store/iPublisherObserver";
import {envTestData} from "../../../store/data-types";
import {logger} from "../../../Framework.Initialise";

export class ApiMux implements IApiObject, Observer {
    page: Page
    testData: envTestData

    getDataUpdate(data: envTestData): void {
        logger.info( `[${this.constructor.name}] Receiving test data...[${Object.keys(data)}]`)
        this.testData = data
    }
    // Send request to API; Playwright requires method, url, header and body
    async sendRequest(method: string, url: string, header: object, body: object): Promise<any> {
        logger.info( `[${this.constructor.name}] Sending request to API...[${url}]`)
        await this.page.request[method](url, header, body)
    }
}