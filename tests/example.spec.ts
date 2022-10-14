import { test, expect} from "./Framework.Bootstrap";
import {logger} from "../Framework.Initialise";

test('@jomans homepage has Playwright in title and get started link linking to the intro page',
    async ({ testDataPublisher, samplePageObject}) => {
  const { page, testData } = samplePageObject
  logger.info('Env variable at test file is: ' + process.env.ENV)
  samplePageObject.showCurrentTestDataObject()

  await page.goto(testData.targetUrl);

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/Playwright/);

  // create a locator
  const getStarted = page.locator('text=Get Started');

  // Expect an attribute "to be strictly equal" to the value.
  await expect(getStarted).toHaveAttribute('href', '/docs/intro');

  // Click the get started link.
  await getStarted.click();

  // Expects the URL to contain intro.
  await expect(page).toHaveURL(/.*intro/);
});