import {test, expect} from "../Framework.Bootstrap";
import {logger} from "../../Framework.Initialise";

test('@SMOKE That base framework features work as expected ', async ({testDataPublisher, samplePageObject}) => {
    const {page, testData} = samplePageObject
    logger.info('Env variable at test file is: ' + process.env.ENV)
    let loadedTestData = samplePageObject.showCurrentTestDataObject()

    // Check that an object is returned
    await expect(typeof loadedTestData).toBe('object')

    // check that keys targetUrl key is present
    await expect(Object.keys(loadedTestData)).toContain('targetUrl')

    // check that globalTestUser key is present
    await expect(Object.keys(loadedTestData)).toContain('globalTestUser')

    // check that value of globalTestUser is not null
    await expect(loadedTestData['globalTestUser']).not.toBeNull()


});