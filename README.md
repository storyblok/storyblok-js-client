# Universal JavaScript SDK for Storyblok's API

This client is a thin wrapper for the Storyblok API's to use in Node.js and the browser.

## Install

```
npm install storyblok-js-client
```

## Usage

### Class `Storyblok`

**Parameters**

- `config` Object
  - `accessToken` String, The preview token you can find in your space dashboard at https://app.storyblok.com
  - `cache` Object
    - `type` String, `none` or `memory`
- (`endpoint` optional)

**Example**

```javascript
// 1. Require the Storyblok client
const StoryblokClient = require('storyblok-js-client');

// 2. Initialize the client with the preview token 
// from your space dashboard at https://app.storyblok.com
let Storyblok = new StoryblokClient({
  accessToken: 'xf5dRMMjltLzKOcNgMaU9Att'
});
```

### Activating request cache

The Storyblok client comes with a caching mechanism.
When initializing the Storyblok client you can define a cache provider for caching the requests in memory.
To clear the cache you can call `Storyblok.flushCache();` or activate the automatic clear with clear: 'auto'.

```javascript
let Storyblok = new StoryblokClient({
  accessToken: 'xf5dRMMjltLzKOcNgMaU9Att',
  cache: {
    clear: 'auto',
    type: 'memory'
  }
});
```

### Method `Storyblok#get`

**Parameters**
- `[return]` Promise, Object `response`
- `path` String, Path (can be `cdn/stories`, `cdn/stories/*`, `cdn/tags`, `cdn/datasources`, `cdn/links`)
- `options` Object, Options can be found in the [API documentation](https://www.storyblok.com/docs/Delivery-Api/get-a-story).

**Example**

```javascript
Storyblok
  .get('cdn/stories/home', {
    version: 'draft'
  })
  .then((response) => {
    console.log(response);
  })
  .catch((error) => {
    console.log(error);
  });
```

### Method `Storyblok#flushCache`

**Parameters**

- `[return]` Object, returns the Storyblok client

**Example**

```javascript
Storyblok.flushCache();
```

## Contribution

Fork me on [Github](https://github.com/storyblok/storyblok-js-client)
