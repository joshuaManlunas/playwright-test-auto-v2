import { logger } from '../Framework.Initialise';
import * as path from 'path';
import * as fs from 'fs-extra';

export class MockDataStore {
    private static instance: MockDataStore;
    private mockDataCache: Map<string, any> = new Map();
    private readonly mockDataDir: string;

    private constructor() {
        this.mockDataDir = path.resolve(__dirname, 'mock-data');
    }

    static getInstance(): MockDataStore {
        if (!MockDataStore.instance) {
            MockDataStore.instance = new MockDataStore();
        }
        return MockDataStore.instance;
    }

    async loadMockData(mockDataPath: string): Promise<any> {
        try {
            if (this.mockDataCache.has(mockDataPath)) {
                return this.mockDataCache.get(mockDataPath);
            }

            // Ensure the directory exists
            await fs.ensureDir(this.mockDataDir);

            const fullPath = path.join(this.mockDataDir, mockDataPath);

            // Check if file exists
            if (!await fs.pathExists(fullPath)) {
                throw new Error(`Mock data file not found: ${mockDataPath}`);
            }

            const data = await fs.readJson(fullPath);
            this.mockDataCache.set(mockDataPath, data);
            logger.info(`Loaded mock data from ${mockDataPath}`);
            return data;
        } catch (error) {
            logger.error(`Error loading mock data from ${mockDataPath}:`, error);
            throw error;
        }
    }

    clearCache(): void {
        this.mockDataCache.clear();
        logger.info('Cleared mock data cache');
    }
} 