export interface MockApi {
    /**
     * Mock a GET request to the specified URL
     */
    mockGet(url: string | RegExp, response: any): Promise<void>;

    /**
     * Mock a POST request to the specified URL
     */
    mockPost(url: string | RegExp, response: any): Promise<void>;

    /**
     * Mock a PUT request to the specified URL
     */
    mockPut(url: string | RegExp, response: any): Promise<void>;

    /**
     * Mock a DELETE request to the specified URL
     */
    mockDelete(url: string | RegExp, response: any): Promise<void>;

    /**
     * Clear all mocks
     */
    clearMocks(): Promise<void>;

    /**
     * Enable/disable recording mode for API calls
     * When enabled, actual API responses will be saved as mock data
     */
    setRecordMode(enabled: boolean): void;

    /**
     * Get current recording mode status
     */
    isRecordMode(): boolean;

    /**
     * Save recorded responses to mock files
     */
    saveRecordedResponses(): Promise<void>;
} 