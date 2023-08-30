# Wagtail TypeScript Client

The `wagtail-js` package is designed to provide a client for fetching content from a Wagtail-based CMS using TypeScript. This client facilitates the retrieval of various types of content, such as pages, images, and documents, from the CMS.

## Installation

You can install the `wagtail-js` package using npm, pnpm, or yarn:

```bash
npm install wagtail-js
pnpm install wagtail-js
yarn add wagtail-js
```

## Usage

To use the `wagtail-js` package, you need to create an instance of the `CMSClient` class, which provides methods for fetching different types of content from the CMS. The package also includes utility functions and types for handling CMS content.

### Import Statements

```typescript
import {
  CMSClient,
  FetchError,
  fetchContent,
  fetchRequest,
} from "wagtail-js";
import {
  ClientOptions,
  CMSContent,
  CMSContentPath,
  CMSContents,
  CMSMediaMeta,
  CMSQueries,
  NotFoundContents,
} from "wagtail-js";
```

### Creating a CMSClient

To fetch content from the CMS, you need to create an instance of the `CMSClient` class:

```typescript
const client = new CMSClient({
  baseURL: "https://example.com",
  apiPath: "/api/v2",
  headers: {}, // Optional additional headers
  cache: "force-cache", // Optional caching strategy
});
```

### Fetching Content

You can use the methods provided by the `CMSClient` class to fetch different types of content from the CMS. The methods handle response and error cases and return Promises that resolve with the parsed JSON response data.

#### Fetching Pages

```typescript
const pages = await client.fetchPages({ limit: 10 });
console.log("Pages:", pages);
```

#### Fetching Images

```typescript
const images = await client.fetchImages({ limit: 5 });
console.log("Images:", images);
```

#### Fetching Documents

```typescript
const documents = await client.fetchDocuments({ limit: 3 });
console.log("Documents:", documents);
```

#### Fetching a Page

You can fetch a single page based on its ID or slug:

```typescript
const pageIdOrSlug = "home";
const page = await client.fetchPage(pageIdOrSlug);
console.log("Page:", page);
```

#### Fetching an Image

You can fetch a single image based on its ID:

```typescript
const imageId = 1;
const image = await client.fetchImage(imageId);
console.log("Image:", image);
```

#### Fetching a Document

You can fetch a single document based on its ID:

```typescript
const documentId = 2;
const document = await client.fetchDocument(documentId);
console.log("Document:", document);
```

### Utility Functions

The `wagtail-js` package includes utility functions for fetching content and constructing URLs for media items.

#### fetchContent

The `fetchContent` function allows you to fetch CMS content using the provided parameters and handle response and error cases:

```typescript
try {
  const response = await fetchContent(
    "https://example.com",
    "/api/v2",
    "pages",
    { limit: 10 }
  );
  console.log("Response:", response);
} catch (error) {
  if (error instanceof FetchError) {
    console.error("Fetch error:", error.message);
  } else {
    console.error("Unknown error:", error);
  }
}
```

### Types and Interfaces

The package provides various types and interfaces to help you work with CMS content and requests. These include:

- `ClientOptions`: Configuration options for the `CMSClient` class.
- `CMSContentPath`: Path to various types of CMS content.
- `CMSQueries`: Optional queries to filter content.
- `CMSContent`, `CMSContents`, `CMSMediaMeta`, `CMSPageMeta`: Interfaces for representing CMS content and metadata.
- `NotFoundContents`: Interface representing "not found" response data.

## Conclusion

The `wagtail-js` package simplifies the process of fetching content from a Wagtail-based CMS using TypeScript. It provides a convenient `CMSClient` class with methods for fetching different types of content and handling response and error cases. Additionally, utility functions and types help you work with CMS content and requests effectively.

