# Playwright-Test-Auto-Framework-v2

A template for creating a test automation framework using Playwright.

## Description

This project can be used as the base for any type of test framework, from the simplest to the most advanced.

## Getting Started

### Dependencies

* [Node.js](https://nodejs.org/en/) -- latest LTE version
* [Typescript] (https://www.typescriptlang.org/) -- latest version
* [Playwright] (https://playwright.dev/) -- latest version

### Installing

* Clone the repository from [GitHub](https://github.com/joshuaManlunas/playwright-test-auto-v2.git)
* Install the dependencies using `npm install`
* Run Playwright installations using `npx playwright install`

### Executing Framework Self Tests

* Run smoke tests to check that everything is working as expected.
```
npm run test:smoke
```

## Authoring Tests
* There are 2 ways to author tests:
  * [Using page object models](https://playwright.dev/docs/pom) -- where you create a layer of abstraction between the page and the underlying test functionality.
  * Using declarative tests -- where you write the test logic directly in the test file. ___This is the default approach.See tests in `framework-self-test` directory.___
* Recommended IDEs:
  * [Visual Studio Code](https://code.visualstudio.com/) - With Playwright extension
  * [WebStorm](https://www.jetbrains.com/webstorm/)
* Recommended Reading
  * https://playwright.dev/docs/writing-tests 
  * https://playwright.dev/docs/intro -- The Playwright documentation is very good and should be your first stop for any questions.


## Framework Features
* The framework is bootstrapped by the `Framework.Bootstrap.ts` file. This file is responsible for supplying the tests with all the fixtures(objects) it needs to perform the tests.
* The framework is initialised & configured by the `Framework.Initialise.ts` file. This file is responsible for supplying the tests with all the configuration settings it needs to perform the tests.
* Environment variables are fetched from the `.env` files in the `environments` directory. The `Framework.Initialise.ts` file is responsible for loading the environment variables.

## Authors
Joshua Manlunas -- initial work  

## Version History

* 2.0
    * Added the use of a (test) data store to the project.
* 0.1
    * Initial Release

## License

This project is licensed under the GNU General Public License (GPL) License - see the LICENSE file for details

## How to Contribute
* Fork or clone the project
* Create a feature branch
* Commit your changes
* Push to the branch
* Open a pull request

## Acknowledgments

Me, myself and I