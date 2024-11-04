import { Page } from '@playwright/test';
import { MockApi } from './iMockApi';
import { logger } from '../../../Framework.Initialise';
import * as path from 'path';
import * as fs from 'fs-extra';

export class MockApiImpl implements MockApi {
    private recordMode: boolean = false;
    private recordedResponses: Map<string, any> = new Map();
    private url: string = '';
    private method: string = '';
    private response: any;
    private readonly mockDataDir: string;

    constructor(private readonly page: Page) {
        this.mockDataDir = path.resolve(__dirname, '../../../store/mock-data');
        logger.info(`Mock data directory: ${this.mockDataDir}`);
    }

    setUrl(url: string): this {
        this.url = url;
        return this;
    }

    setMethod(method: string): this {
        this.method = method;
        return this;
    }

    setResponse(response: any): this {
        this.response = response;
        return this;
    }

    setRecordMode(enabled: boolean): void {
        this.recordMode = enabled;
        logger.info(`Mock recording mode ${enabled ? 'enabled' : 'disabled'}`);
    }

    isRecordMode(): boolean {
        return this.recordMode;
    }

    private async recordResponse(method: string, url: string, response: any): Promise<void> {
        const key = `${method}-${url}`;
        this.recordedResponses.set(key, response);
        logger.info(`Recorded response for ${method} ${url}`);
    }

    private async setupMock(
        method: string,
        url: string | RegExp,
        response: any
    ): Promise<void> {
        await this.page.route(url, async (route) => {
            if (route.request().method() === method) {
                if (this.recordMode) {
                    try {
                        // In record mode, make the actual request and save the response
                        const response = await route.fetch();
                        const responseBody = await response.json();
                        const recordedResponse = {
                            status: response.status(),
                            headers: response.headers(),
                            body: responseBody
                        };
                        await this.recordResponse(method, url.toString(), recordedResponse);
                        await route.fulfill({
                            status: response.status(),
                            headers: response.headers(),
                            body: JSON.stringify(responseBody)
                        });
                    } catch (error) {
                        logger.error(`Failed to record response for ${method} ${url}:`, error);
                        await route.continue();
                    }
                } else {
                    // In mock mode, use the provided mock response
                    logger.info(
                        `Mocking ${method} request to ${route.request().url()} with response:`,
                        response
                    );
                    await route.fulfill({
                        status: response.status || 200,
                        headers: response.headers || {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(response.body || response),
                    });
                }
            } else {
                await route.continue();
            }
        });
    }

    async saveRecordedResponses(): Promise<void> {

        this.recordResponse(this.method, this.url, this.response);

        if (this.recordedResponses.size === 0) {
            logger.info('No responses recorded');
            return;
        }

        try {
            // Ensure the directory exists, create it if it doesn't
            await fs.ensureDir(this.mockDataDir);
            logger.info(`Ensuring mock data directory exists at: ${this.mockDataDir}`);

            for (const [key, response] of this.recordedResponses.entries()) {
                try {
                    const [method, url] = key.split('-');
                    const fileName = `${method.toLowerCase()}-${url.replace(/[^a-zA-Z0-9]/g, '_')}.json`;
                    const filePath = path.join(this.mockDataDir, fileName);

                    // Create the file if it doesn't exist
                    if (!await fs.pathExists(filePath)) {
                        await fs.createFile(filePath);
                        logger.info(`Created new mock file: ${fileName}`);
                    }

                    await fs.writeJson(filePath, response, { spaces: 2 });
                    logger.info(`Saved recorded response to ${fileName}`);
                } catch (error) {
                    logger.error(`Failed to save recorded response for ${key}:`, error);
                    // Continue with other files even if one fails
                }
            }
        } catch (error) {
            logger.error(`Failed to ensure mock data directory exists:`, error);
            throw error; // Rethrow as this is a critical error
        }
    }

    async mockGet(url: string | RegExp, response: any): Promise<void> {
        await this.setupMock('GET', url, response);
    }

    async mockPost(url: string | RegExp, response: any): Promise<void> {
        await this.setupMock('POST', url, response);
    }

    async mockPut(url: string | RegExp, response: any): Promise<void> {
        await this.setupMock('PUT', url, response);
    }

    async mockDelete(url: string | RegExp, response: any): Promise<void> {
        await this.setupMock('DELETE', url, response);
    }

    async clearMocks(): Promise<void> {
        await this.page.unroute('**/*');
        logger.info('Cleared all API mocks');
    }
} 