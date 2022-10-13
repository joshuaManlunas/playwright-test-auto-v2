import {IApiObject} from "./iApiObject";
import {APIRequestContext, Page, Request} from "@playwright/test";
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

    async get() {
        // await this.page.request.get()


    }

    async post() {

    }



}