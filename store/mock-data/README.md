# Mock API Feature Documentation

## Overview

The Mock API feature provides a robust mechanism for mocking HTTP requests during testing. It supports recording real API responses, saving them as mock data, and replaying them in subsequent test runs. This feature is particularly useful for:

- Creating reliable, repeatable tests that don't depend on external services
- Testing error scenarios and edge cases
- Reducing test execution time
- Working offline
- Avoiding rate limits from external APIs

## Key Features

### 1. Recording Mode

- Captures real API responses and saves them as mock data
- Automatically creates JSON files for each unique request
- Maintains the original response structure including status, headers, and body

### 2. Mock Mode

- Intercepts HTTP requests and returns saved mock responses
- Supports GET, POST, PUT, and DELETE methods
- Maintains request/response integrity with proper status codes and headers

### 3. Update Mode

- Allows selective updating of existing mock data
- Supports update policies for fine-grained control
- Can force updates or use conditional updating based on response comparison

### 4. Update Policies

- Configure per-URL update behaviors
- Control allowed status codes
- Enable forced updates or conditional updates

## Usage

### Basic Mock Setup
