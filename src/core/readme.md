# Mock API Implementation Documentation

## Overview

The `MockApiImpl` class provides a robust implementation of the `MockApi` interface for mocking HTTP requests during testing. This feature enables reliable, repeatable tests by allowing you to:

- Record real API responses and save them as mock data
- Replay recorded responses in subsequent test runs
- Selectively update existing mocks with new responses
- Configure fine-grained update policies per endpoint

## Key Features

### 1. Mock Mode (Default)

- Intercepts HTTP requests and returns predefined mock responses
- Supports all common HTTP methods (GET, POST, PUT, DELETE)
- Configurable response status codes and headers
- Default content-type is application/json
- Automatic response body serialization/deserialization

### 2. Record Mode

- Captures real API responses during test execution
- Automatically saves responses as JSON files
- Maintains complete response structure:
  - Status code
  - Headers
  - Response body
- Files are named based on HTTP method and sanitized URL
- Stored in configurable mock data directory

### 3. Update Mode

- Allows updating existing mock files with new responses
- Configurable update policies per URL pattern
- Supports conditional updates based on:
  - Response status codes
  - Response body comparison
- Preserves existing mocks when updates fail
- Logging of all update operations

## Usage

### Basic Mocking
