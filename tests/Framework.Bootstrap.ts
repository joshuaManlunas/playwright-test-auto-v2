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
const pom = PageObjectTest.prototype.newPomInstance()

export const test = base.extend<TestDataPublisher & PageObjects>({
    testDataPublisher: async ({}, use) => {
        const dataStore = await new TestDataStorePublisher()
        await dataStore.addSubscriber(pom)
        await dataStore.getTestData(process.env.ENV)
        await use(dataStore)
    },
    samplePageObject: async ({page}, use) => {
        pom.page = page
        await use(pom)
    }
})

export { expect } from '@playwright/test'