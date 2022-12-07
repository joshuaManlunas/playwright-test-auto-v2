import {test, expect} from "../Framework.Bootstrap";
import {logger} from "../../Framework.Initialise";
import {decrypt, encrypt} from "../../src/core/helpers/crypter";

test('@SMOKE @JOMANS That base framework features work as expected ', async ({
                                                                          testDataPublisher,
                                                                          samplePageObject,
                                                                          apiMux
                                                                      }) => {
    const {page, testData} = samplePageObject
    logger.info('Env variable at test file is: ' + process.env.ENV)
    let loadedTestData = samplePageObject.showCurrentTestDataObject()

    // Check that an object is returned for test data
    await expect(typeof loadedTestData).toBe('object')

    // check that keys targetUrl key is present
    await expect(Object.keys(loadedTestData)).toContain('targetUrl')

    // check that globalTestUser key is present
    await expect(Object.keys(loadedTestData)).toContain('globalTestUser')

    // check that value of globalTestUser is not null
    await expect(loadedTestData['globalTestUser']).not.toBeNull()

    // check that api calls can be made using the apiMux object
    let response = await apiMux.sendRequest('GET', 'https://jsonplaceholder.typicode.com/todos/1')
    await expect(response.status()).toBe(200)
    response = await response.json()

    // assert object key value
    await expect(response.userId).toBe(1)

    // assert that response object have 4 keys
    await expect(Object.keys(response)).toHaveLength(4)

    // check that strings can be encrypted and decrypted
    const encrypted = encrypt('Hello World', 'changeMe')
    const decrypted = decrypt(encrypted, 'changeMe')
    await expect(decrypted).toBe('Hello World')
});