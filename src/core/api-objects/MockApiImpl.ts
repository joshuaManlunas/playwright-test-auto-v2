import { Page } from '@playwright/test';
import { MockApi, UpdatePolicy } from './iMockApi';
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
    private updateMode: boolean = false;
    private updatePolicies: Map<string, UpdatePolicy> = new Map();

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

    setUpdateMode(enabled: boolean): void {
        this.updateMode = enabled;
        logger.info(`Mock update mode ${enabled ? 'enabled' : 'disabled'}`);
    }

    isUpdateMode(): boolean {
        return this.updateMode;
    }

    public setUpdatePolicy(url: string | RegExp, policy: UpdatePolicy): void {
        const urlKey = url.toString();
        this.updatePolicies.set(urlKey, {
            enabled: policy.enabled,
            allowedStatusCodes: policy.allowedStatusCodes || [200],
            forceUpdate: policy.forceUpdate || false
        });
    }

    public getUpdatePolicy(url: string | RegExp): UpdatePolicy | undefined {
        return this.updatePolicies.get(url.toString());
    }

    public clearUpdatePolicies(): void {
        this.updatePolicies.clear();
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
                const policy = this.getUpdatePolicy(url);

                if ((this.recordMode || this.updateMode) || (policy && policy.enabled)) {
                    try {
                        // Make the actual request
                        const response = await route.fetch();
                        const responseBody = await response.json();
                        const status = response.status();

                        const shouldUpdate =
                            this.updateMode ||
                            (policy?.enabled &&
                                policy.allowedStatusCodes?.includes(status) &&
                                (policy.forceUpdate || this.isSimilarResponse(responseBody, response)));

                        if (shouldUpdate) {
                            const recordedResponse = {
                                status: status,
                                headers: response.headers(),
                                body: responseBody
                            };

                            // Update existing mock file if it exists
                            const fileName = `${method.toLowerCase()}-${url.toString().replace(/[^a-zA-Z0-9]/g, '_')}.json`;
                            const filePath = path.join(this.mockDataDir, fileName);

                            if (await fs.pathExists(filePath)) {
                                await fs.writeJson(filePath, recordedResponse, { spaces: 2 });
                                logger.info(`Updated mock file: ${fileName}`);
                            }
                        }

                        if (this.recordMode) {
                            await this.recordResponse(method, url.toString(), responseBody);
                        }

                        await route.fulfill({
                            status: status,
                            headers: response.headers(),
                            body: JSON.stringify(responseBody)
                        });
                    } catch (error) {
                        logger.error(`Failed to ${this.updateMode ? 'update' : 'record'} response for ${method} ${url}:`, error);
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

    private isSimilarResponse(newResponse: any, existingResponse: any): boolean {
        // Implement your comparison logic here
        // This is a simple example - you might want more sophisticated comparison
        return JSON.stringify(newResponse) === JSON.stringify(existingResponse);
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