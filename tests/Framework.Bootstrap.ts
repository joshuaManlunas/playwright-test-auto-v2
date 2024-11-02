import { test as base } from '@playwright/test'
import { TestDataStorePublisher } from "../store/TestDataStorePublisher";
import { PageObjectTest } from "../src/core/page-objects/PageObjectTest";
import { ApiMux } from "../src/core/api-objects/ApiMux";
import { MockApiImpl } from "../src/core/api-objects/MockApiImpl";


type TestDataPublisher = {
    testDataPublisher: TestDataStorePublisher
}

type PageObjects = {
    samplePageObject: PageObjectTest
}

type ApiObjects = {
    apiMux: ApiMux
}

type MockObjects = {
    mockApi: MockApiImpl
}

// instantiate all objects that would like to subscribe to test data


export const test = base.extend<TestDataPublisher & PageObjects & ApiObjects & MockObjects>({
    testDataPublisher: async ({ samplePageObject, apiMux }, use) => {
        const dataStore = await new TestDataStorePublisher()
        await dataStore.addSubscriber(samplePageObject)
        await dataStore.addSubscriber(apiMux)
        const validEnvs = ['LOCAL', 'INTEGRATION', 'REHEARSAL', 'ACCEPTANCE'] as const;
        type ValidEnv = typeof validEnvs[number];

        const env = process.env.ENV as string;
        if (!validEnvs.includes(env as ValidEnv)) {
            throw new Error(`Invalid environment. Must be one of: ${validEnvs.join(', ')}`);
        }

        await dataStore.getTestData(env)
        await use(dataStore)
    },
    samplePageObject: async ({ page }, use) => {
        const samplePageObject = await new PageObjectTest(page)
        await use(samplePageObject)
    },
    apiMux: async ({ page }, use) => { await use(new ApiMux(page)) },
    mockApi: async ({ page }, use) => {
        const mockApi = new MockApiImpl(page);
        await use(mockApi);
    }
})

export { expect } from '@playwright/test'