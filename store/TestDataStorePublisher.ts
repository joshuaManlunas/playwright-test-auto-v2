import {logger} from "../Framework.Initialise";
import * as path from "path";
import {Observer, Publisher} from "./iPublisherObserver";
import {envTestData} from "./data-types";

export class TestDataStorePublisher implements Publisher {
    private dataSubscribers: Array<Observer> = []

    constructor() {
        logger.info('Initialising Test Data Publisher...')
    }

    addSubscriber(observer: Observer): void {
        this.dataSubscribers.push(observer)
        logger.info(`[${observer.constructor.name}] has been added to dataSubscribers...`)
    }

    publishData(data: envTestData): void {
        logger.info('Publishing test data to observers')
        for (const dataSubscriber of this.dataSubscribers) {
            dataSubscriber.getDataUpdate(data)
        }
    }

    async getTestData(testEnv: string) {
        const fsExtra = require('fs-extra')
        const fullPath = path.resolve(__dirname, 'test-data-store.json')

        logger.info(`Retrieving test data for: [${testEnv}]`)

        try {
            const data: object = await fsExtra.readJsonSync(fullPath)
            this.publishData(data[`${testEnv}`] as envTestData)
        } catch (error) {
            logger.error(error)
        }
    }
}
