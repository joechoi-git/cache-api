# Cache API

This is a Cache API application implemented using Node.js, TypeScript, Express, and Jest. The application provides two types of caches: an LRU (Least Recently Used) cache and a TTL (Time to Live) cache. The caches can store any type of data such as strings, numbers, or objects. It can be accessed via RESTful endpoints.

## Features

- **Least Recently Used (LRU) Cache**: Stores a maximum of N records and discards the least recently used entry when a new record is added beyond the limit.
- **Time To Live (TTL) Cache**: Stores records with a time-to-live of N seconds and discards entries that haven't been accessed within this period.
- **Persistent Storage**: Cache data files are saved to disk at regular intervals under the `./data` directory and reloaded when the application starts.

## Installation and Usage

### Clone the repository

```bash
git clone git@github.com:joechoi-git/cache-api.git
cd cache-api
```

### Install dependencies

```bash
npm install
```

### Start the server

```bash
npm start
```

### Run the tests

```bash
npm test
```

### Formats the files

```bash
npm run format
```

### Run the ES Lint checker

```bash
npm run lint
npm run lint:fix
```

## File Structure

```sh
cache-api/
│
├── src/
│ ├── cache/
│ │ ├── leastRecentlyUsedCache.ts
│ │ ├── timeToLiveCache.ts
│ │ └── types.ts
│ ├── controllers/
│ │ └── cache.ts
│ ├── utils/
│ │ └── file.ts
│ └── server.ts
│
├── tests/
│ ├── cache.test.ts
│ └── cacheEndpoints.test.ts
│
├── .eslintrc.json
├── .gitignore
├── .prettierrc
├── jest.config.js
├── package-lock.json
├── package.json
├── README.md
└── tsconfig.json
```

### `src/cache/`

- #### `leastRecentlyUsedCache.ts`

  - Implements the LRU (Least Recently Used) cache. This cache holds a maximum of N items and removes the least recently used item when the limit is exceeded.
  - Ensures that cache data is loaded from disk on startup and saved to disk at regular intervals.

- #### `timeToLiveCache.ts`

  - Implements the TTL (Time to Live) cache. This cache stores items for a specified duration of N seconds, and removes items that have not been accessed within this period.
  - Ensures that cache data is loaded from disk on startup and saved to disk at regular intervals.

- #### `types.ts`

  - Defines a TypeScript interface for the cache operations, ensuring a consistent API for different cache types.

### `src/controllers/cache.ts`

- Exports the cache methods from cache classes to be used in the routes.

### `src/utils/file.ts`

- Contains utility functions for saving cache data to disk and loading it back, ensuring data persistence across application restarts.

### `src/server.ts`

- Sets up the Express server and routes.
- Ensures that cache data is saved to disk on any failure.

### `tests/`

- #### `cache.test.ts`

  - Contains unit tests for the `leastRecentlyUsedCache` and `timeToLiveCache` classes, ensuring they function correctly with multiple data types, including strings and numbers.

- #### `cacheEndpoints.test.ts`

  - Contains integration tests for the Express routes, ensuring that the API endpoints for creating, retrieving, updating, searching, and deleting cache entries work as expected.

## API Documentation

### POST `/cache/:type`

Create or update a cache entry

```bash
curl -X POST http://localhost:3000/cache/lru -H "Content-Type: application/json" -d '{"key": "testKey", "value": "testValue"}'
curl -X POST http://localhost:3000/cache/ttl -H "Content-Type: application/json" -d '{"key": "testKey", "value": "testValue"}'
```

### GET `/cache/:type/:key`

Retrieve a cache entry

```bash
curl -X GET http://localhost:3000/cache/lru/testKey
curl -X GET http://localhost:3000/cache/ttl/testKey
```

### PUT `/cache/:type/:key`

Update a cache entry

```bash
curl -X PUT http://localhost:3000/cache/lru/testKey -H "Content-Type: application/json" -d '{"value": "newValue"}'
curl -X PUT http://localhost:3000/cache/ttl/testKey -H "Content-Type: application/json" -d '{"value": "newValue"}'
```

### GET `/cache/:type/search`

Search cache entries

```bash
curl -X GET http://localhost:3000/cache/lru/search?value=value
curl -X GET http://localhost:3000/cache/ttl/search?value=value
```

### DELETE `/cache/:type/:key`

Delete a cache entry

```bash
curl -X DELETE http://localhost:3000/cache/lru/testKey
curl -X DELETE http://localhost:3000/cache/ttl/testKey
```
