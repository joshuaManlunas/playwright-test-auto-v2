import {logger} from "../../../Framework.Initialise";
import {Observer} from "../../../store/iPublisherObserver";
import {Page} from "@playwright/test";
import {PageObject} from "./iPageObject";
import {envTestData} from "../../../store/data/data-types";

export class PageObjectTest implements Observer, PageObject {
    testData: envTestData

    constructor(readonly page: Page) { }

    getDataUpdate(data: envTestData): void {
        logger.info( `[${this.constructor.name}] Receiving test data...[${Object.keys(data)}]`)
        this.testData = data
    }

    // Show current test data in sample page object for testing
    showCurrentTestDataObject(): object {
        const data = this.testData
        logger.info('CURRENT TEST DATA: ' + JSON.stringify(data))
        return data
    }
}
