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

With this method you can get single or multiple items. The multiple items are paginated and you will receive 25 items per page by default. If you want to get all items at once use the `getAll` method.

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

### Method `Storyblok#getAll`

With this method you can get all items at once.

**Parameters**
- `[return]` Promise, Array of entities
- `path` String, Path (can be `cdn/stories`, `cdn/stories/*`, `cdn/tags`, `cdn/datasources`, `cdn/links`)
- `options` Object, Options can be found in the [API documentation](https://www.storyblok.com/docs/Delivery-Api/get-a-story).
- `entity` String, Storyblok entity like stories, links or datasource. It's optional.

**Example**

```javascript
Storyblok
  .getAll('cdn/stories', {
    version: 'draft'
  })
  .then((stories) => {
    console.log(stories); // an array
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

### Method `Storyblok#setComponentResolver`

**Parameters**

- `callback` Function, Render function to render components of the richtext field

Option 1: Use a switch case definition to render different components:

```javascript
Storyblok.setComponentResolver((component, blok) => {
  switch(component) {
    case 'my-custom-component':
      return `<div class="my-component-class">${blok.text}</div>`
      break;
    case 'my-header':
      return `<h1 class="my-class">${blok.title}</h1>`
      break;
    default:
      return 'Resolver not defined'
  }
})
```

Option 2: Dynamically render a component (Example in Vue.js):

```javascript
Storyblok.setComponentResolver((component, blok) => {
  return `<component :blok='${JSON.stringify(blok)}'
                     is="${component}"></component>`
})
```

### Method `Storyblok#richTextResolver.render`

**Parameters**
- `[return]` String, Rendered html of a richtext field
- `data` Richtext object, An object with a `content` (an array of nodes) field.

**Example**

```javascript
Storyblok.richTextResolver.render(blok.richtext)
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


#### How to define a custom schema for the rich text renderer

To define to add some classes to specific html attributes rendered by the rich text renderer. To do so you can overwrite the resolver and initialize it with your own schema definition. Copy the content of https://github.com/storyblok/storyblok-js-client/blob/master/source/schema.js to my-schema.js and overwrite richTextResolver like in the following example:

~~~javascript
const StoryblokClient = require('storyblok-js-client')
const RichTextResolver = require('storyblok-js-client/dist/richTextResolver')
const MySchema = require('./my-schema')

let client = new StoryblokClient({
  accessToken: 'WcdDcNgDm59K72EbsQg8Lgtt'
})

client.richTextResolver = new RichTextResolver(MySchema)
~~~

If you just want to change the way a specific tag is rendered you can import the default schema and extend it. Following an example that will render headlines with classes:

Instead of `<p>Normal headline</p><h3><span class="margin-bottom-fdsafdsada">Styled headline</span></h3>` it will render `<p>Normal headline</p><h3 class="margin-bottom-fdsafdsada">Styled headline</h3>`.

~~~javascript

const RichTextResolver = require('storyblok-js-client/dist/richTextResolver')
const MySchema = require('storyblok-js-client/dist/schema')

MySchema.nodes.heading = function(node) {
  let attrs = {}

  if (node.content &&
      node.content.length === 1 &&
      node.content[0].marks &&
      node.content[0].marks.length === 1 &&
      node.content[0].marks[0].type === 'styled') {
    attrs = node.content[0].marks[0].attrs
    delete node.content[0].marks
  }

  return {
    tag: [{
      tag: `h${node.attrs.level}`,
      attrs: attrs
    }]
  }
}

let rteResolver = new RichTextResolver(MySchema)
let rendered = rteResolver.render({
  "content": [
    {
      "content": [
        {
          "text": "Normal headline",
          "type": "text"
        }
      ],
      "type": "paragraph"
    },
    {
      "attrs": {
        "level": 3
      },
      "content": [
        {
          "marks": [
            {
              "attrs": {
                "class": "margin-bottom-fdsafdsada"
              },
              "type": "styled"
            }
          ],
          "text": "Styled headline",
          "type": "text"
        }
      ],
      "type": "heading"
    }
  ],
  "type": "doc"
})

console.log(rendered)
~~~

## Contribution

Fork me on [Github](https://github.com/storyblok/storyblok-js-client).

This project use [semantic-release](https://semantic-release.gitbook.io/semantic-release/) for generate new versions by using commit messages and we use the Angular Convention to naming the commits. Check [this question](https://semantic-release.gitbook.io/semantic-release/support/faq#how-can-i-change-the-type-of-commits-that-trigger-a-release) about it in semantic-release FAQ.
