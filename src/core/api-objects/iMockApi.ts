export interface UpdatePolicy {
    /**
     * When true, the mock will be updated with the real API response
     * if the response status is in the allowedStatusCodes array
     */
    enabled: boolean;

    /**
     * Array of status codes that are allowed to update the mock
     * Default is [200]
     */
    allowedStatusCodes?: number[];

    /**
     * When true, will update mock even if response body differs from current mock
     * Default is false
     */
    forceUpdate?: boolean;
}

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

    /**
     * Enable/disable update mode for API calls
     * When enabled, actual API responses will update existing mock files
     */
    setUpdateMode(enabled: boolean): void;

    /**
     * Get current update mode status
     */
    isUpdateMode(): boolean;

    /**
     * Set update policy for a specific mock
     */
    setUpdatePolicy(url: string | RegExp, policy: UpdatePolicy): void;

    /**
     * Get update policy for a specific mock
     */
    getUpdatePolicy(url: string | RegExp): UpdatePolicy | undefined;

    /**
     * Clear all update policies
     */
    clearUpdatePolicies(): void;
} 