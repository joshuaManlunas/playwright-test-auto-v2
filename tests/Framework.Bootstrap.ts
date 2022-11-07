import {test as base} from '@playwright/test'
import {TestDataStorePublisher} from "../store/TestDataStorePublisher";
import {PageObjectTest} from "../src/core/page-objects/PageObjectTest";


type TestDataPublisher = {
    testDataPublisher: TestDataStorePublisher
}

type PageObjects = {
    samplePageObject: PageObjectTest
}
// instantiate all objects that would like to subscribe to test data


export const test = base.extend<TestDataPublisher & PageObjects>({
    testDataPublisher: async ({samplePageObject}, use) => {
        const dataStore = await new TestDataStorePublisher()
        await dataStore.addSubscriber(samplePageObject)
        await dataStore.getTestData(process.env.ENV)
        await use(dataStore)
    },
    samplePageObject: async ({page}, use) => {
        const samplePageObject = await new PageObjectTest(page)
        await use(samplePageObject)
    }
})

export { expect } from '@playwright/test'