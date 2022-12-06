import {test as base} from '@playwright/test'
import {TestDataStorePublisher} from "../store/TestDataStorePublisher";
import {PageObjectTest} from "../src/core/page-objects/PageObjectTest";
import {ApiMux} from "../src/core/api-objects/ApiMux";


type TestDataPublisher = {
    testDataPublisher: TestDataStorePublisher
}

type PageObjects = {
    samplePageObject: PageObjectTest
}

type ApiObjects = {
    apiMux: ApiMux
}
// instantiate all objects that would like to subscribe to test data


export const test = base.extend<TestDataPublisher & PageObjects & ApiObjects>({
    testDataPublisher: async ({samplePageObject, apiMux}, use) => {
        const dataStore = await new TestDataStorePublisher()
        await dataStore.addSubscriber(samplePageObject)
        await dataStore.addSubscriber(apiMux)
        await dataStore.getTestData(process.env.ENV)
        await use(dataStore)
    },
    samplePageObject: async ({page}, use) => {
        const samplePageObject = await new PageObjectTest(page)
        await use(samplePageObject)
    },
    apiMux: async ({page}, use) => { await use(new ApiMux(page)) }
})

export { expect } from '@playwright/test'