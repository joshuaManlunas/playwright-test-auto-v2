import {logger} from "../../../Framework.Initialise";
import {Observer} from "../../../store/iPublisherObserver";
import {Page} from "@playwright/test";
import {PageObject} from "./iPageObject";
import {envTestData} from "../../../store/data-types";

export class PageObjectTest implements Observer, PageObject {
    page: Page
    testData: envTestData

    private constructor() {
        // Set things when object is instantiated
    }

    newPomInstance() {
        return new PageObjectTest()
    }

    getDataUpdate(data: envTestData): void {
        logger.info( `[${this.constructor.name}] Receiving test data...[${Object.keys(data)}]`)
        this.testData = data
    }

    showCurrentTestDataObject() {
        const data = this.testData
        logger.info('CURRENT URL IS: ' + JSON.stringify(data))
    }
}
