# Universal JavaScript SDK for Storyblok's API

This client is a thin wrapper for the Storyblok API's to use in Node.js and the browser.

The version 2 uses corejs 3. If you are looking for the version that uses corejs 2 please use [version 1.x.x](https://github.com/storyblok/storyblok-js-client/tree/v1).

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
  - (`region` String, optional)
  - (`https` Boolean, optional)
  - (`rateLimit` Integer, optional, defaults to 3 for management api and 5 for cdn api)
  - (`timeout` Integer, optional)
  - (`maxRetries` Integer, optional, defaults to 5)
- (`endpoint` String, optional)

**Example for using the content deliver api**

```javascript
// 1. Require the Storyblok client
const StoryblokClient = require('storyblok-js-client')

// 2. Initialize the client with the preview token
// from your space dashboard at https://app.storyblok.com
let Storyblok = new StoryblokClient({
  accessToken: 'xf5dRMMjltLzKOcNgMaU9Att'
})
```

**Example for using the content management api**

```javascript
// 1. Require the Storyblok client
const StoryblokClient = require('storyblok-js-client')
const spaceId = 12345

// 2. Initialize the client with the oauth token
// from the my account area at https://app.storyblok.com
let Storyblok = new StoryblokClient({
  oauthToken: 'YOUR_OAUTH_TOKEN'
})

Storyblok.post(`spaces/${spaceId}/stories`, {story: {name: 'xy', slug: 'xy'}})
Storyblok.put(`spaces/${spaceId}/stories/1`, {story: {name: 'xy', slug: 'xy'}})
Storyblok.delete(`spaces/${spaceId}/stories/1`, null)
```

### Activating request cache

The Storyblok client comes with a caching mechanism.
When initializing the Storyblok client you can define a cache provider for caching the requests in memory.
To clear the cache you can call `Storyblok.flushCache()` or activate the automatic clear with clear: 'auto'.

```javascript
let Storyblok = new StoryblokClient({
  accessToken: 'xf5dRMMjltLzKOcNgMaU9Att',
  cache: {
    clear: 'auto',
    type: 'memory'
  }
})
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
  })
```

### Method `Storyblok#post` (only management api)

**Parameters**
- `[return]` Promise, Object `response`
- `path` String, Path (`spaces/*`, ... see more at https://www.storyblok.com/docs/management-api/authentication)
- `payload` Object

**Example**

```javascript
Storyblok
  .post('spaces/12345/stories', {
    story: {name 'xy', slug: 'xy'}
  })
  .then((response) => {
    console.log(response);
  })
  .catch((error) => {
    console.log(error);
  })
```

### Method `Storyblok#put` (only management api)

**Parameters**
- `[return]` Promise, Object `response`
- `path` String, Path (`spaces/*`, ... see more at https://www.storyblok.com/docs/management-api/authentication)
- `payload` Object

**Example**

```javascript
Storyblok
  .put('spaces/12345/stories', {
    story: {name 'xy', slug: 'xy'}
  })
  .then((response) => {
    console.log(response);
  })
  .catch((error) => {
    console.log(error);
  })
```

### Method `Storyblok#delete` (only management api)

**Parameters**
- `[return]` Promise, Object `response`
- `path` String, Path (`spaces/*`, ... see more at https://www.storyblok.com/docs/management-api/authentication)
- `payload` Object

**Example**

```javascript
Storyblok
  .delete('spaces/12345/stories', null)
  .then((response) => {
    console.log(response);
  })
  .catch((error) => {
    console.log(error);
  })
```

### Method `Storyblok#flushCache`

**Parameters**

- `[return]` Promise, Object returns the Storyblok client

**Example**

```javascript
Storyblok.flushCache()
```

### Code examples

#### Filter by content type values and path

~~~javascript
const StoryblokClient = require('storyblok-js-client')

let client = new StoryblokClient({
  accessToken: 'zlRONoLBKrilxkz2k6fYuwtt'
})

// Filter by boolean value in content type
client.get('cdn/stories', {
    version: 'draft',
    filter_query: {
      is_featured: {
        in: true
      }
    }
  }).then((res) => {
    console.log(res.data.stories)
  })

// Get all news and author contents
client.get('cdn/stories', {
    version: 'draft',
    filter_query: {
      component: {
        in: 'news,author'
      }
    }
  }).then((res) => {
    console.log(res.data.stories)
  })

// Get all content from the news folder
client.get('cdn/stories', {
    version: 'draft',
    starts_with: 'news/'
  }).then((res) => {
    console.log(res.data.stories)
  })
~~~

#### Download all content from Storyblok

Following a code example using the storyblok-js-client to backup all content on your local filesystem inside a 'backup' folder.

~~~javascript
const StoryblokClient = require('storyblok-js-client')
const fs = require('fs')

let client = new StoryblokClient({
  accessToken: 'WcdDcNgDm59K72EbsQg8Lgtt'
})

let lastPage = 1
let getStories = (page) => {
  client.get('cdn/stories', {
      version: 'draft',
      per_page: 25,
      page: page
    }).then((res) => {

    let stories = res.data.stories
    stories.forEach((story) => {
      fs.writeFile('./backup/' + story.id + '.json', JSON.stringify(story), (err) => {
        if (err) throw err

        console.log(story.full_slug + ' backed up')
      })
    })

    let total = res.total
    lastPage = Math.ceil((res.total / res.perPage))

    if (page <= lastPage) {
      page++
      getStories(page)
    }
  })
}

getStories(1)
~~~

#### Initialize with a proxy server

~~~javascript
const proxy = {
  host: host,
  port: port,
  auth: {
    username: 'username',
    password: 'password'
  }
}

const storyblok = new StoryblokClient({
  ...
  https: false,
  proxy: proxy
})
~~~

Read more about proxy settings in axios [documentation](https://github.com/axios/axios)

## Contribution

Fork me on [Github](https://github.com/storyblok/storyblok-js-client)
