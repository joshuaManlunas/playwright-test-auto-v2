import {logger} from "../Framework.Initialise";
import * as path from "path";
import {Observer, Publisher} from "./iPublisherObserver";
import {envTestData} from "./data/data-types";

export class TestDataStorePublisher implements Publisher {
    private dataSubscribers: Array<Observer> = []

    constructor() {
        logger.info('Initialising Test Data Publisher...')
    }

    addSubscriber(observer: Observer): void {
        this.dataSubscribers.push(observer)
        logger.info(`[${observer.constructor.name}] has been added to dataSubscribers...`)
    }

    publishData(data: object): void {
        logger.info('Publishing test data to observers')
        for (const dataSubscriber of this.dataSubscribers) {
            dataSubscriber.getDataUpdate(data)
        }
    }

    async getTestData(testEnv: string) {
        const fsExtra = require('fs-extra')
        const testEnvironments = await fsExtra.readJsonSync(path.resolve(__dirname, 'data','test-environments.json'))
        const testUsers = await fsExtra.readJsonSync(path.resolve(__dirname, 'data','test-users.json'))

        logger.info(`Retrieving test data for: [${testEnv}]`)

        try {

            let completeTestData = {
                ...testEnvironments[`${testEnv}`],
                ...testUsers[`${testEnv}`]
            }

            this.publishData( completeTestData as object)
        } catch (error) {
            logger.error(error)
        }
    }
}
