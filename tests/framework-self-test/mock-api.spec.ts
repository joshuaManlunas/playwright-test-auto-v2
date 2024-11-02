import { test, expect } from '../Framework.Bootstrap';
import { MockDataStore } from '../../store/MockDataStore';
import * as path from 'path';
import * as fs from 'fs-extra';

test('@SMOKE API mocking with recording works as expected', async ({ page, mockApi }) => {
    // First run with recording mode to capture actual responses
    mockApi.setRecordMode(true);

    const url = 'https://jsonplaceholder.typicode.com/users';
    // Make actual API call that will be recorded
    const liveResponse = await page.request.get(url);
    expect(liveResponse.status()).toBe(200);

    // Save recorded responses
    await mockApi.saveRecordedResponses();

    // Switch to mock mode
    mockApi.setRecordMode(false);

    // Generate the same filename that MockApiImpl creates
    const fileName = `get-${url.replace(/[^a-zA-Z0-9]/g, '_')}.json`;

    // Load the recorded mock data
    const mockDataStore = MockDataStore.getInstance();
    const mockUsers = await mockDataStore.loadMockData(fileName);

    // Set up mock using recorded data
    await mockApi.mockGet(url, mockUsers);

    // Verify mock works
    const mockedResponse = await page.request.get(url);
    expect(mockedResponse.status()).toBe(200);

    const responseData = await mockedResponse.json();
    expect(responseData).toEqual(mockUsers.body);

    // Clean up
    await mockApi.clearMocks();
});

test('@SMOKE API mocking works with existing mock data', async ({ page, mockApi }) => {
    const mockDataStore = MockDataStore.getInstance();
    const mockUsers = await mockDataStore.loadMockData('users.json');

    const url = 'https://jsonplaceholder.typicode.com/users';
    await mockApi.mockGet(url, {
        status: 200,
        body: mockUsers
    });

    const response = await page.request.get(url);
    expect(response.status()).toBe(200);

    const responseData = await response.json();
    expect(responseData).toEqual(mockUsers);

    await mockApi.clearMocks();
}); 