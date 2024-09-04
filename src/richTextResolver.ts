import defaultHtmlSerializer from './schema'
import { ISbSchema, ISbRichtext } from './interfaces'

type HtmlEscapes = {
  [key: string]: string
}

type OptimizeImagesOptions =
  | boolean
  | {
      class?: string
      filters?: {
        blur?: number
        brightness?: number
        fill?: string
        format?: 'webp' | 'jpeg' | 'png'
        grayscale?: boolean
        quality?: number
        rotate?: 90 | 180 | 270
      }
      height?: number
      loading?: 'lazy' | 'eager'
      sizes?: string[]
      srcset?: (number | [number, number])[]
      width?: number
    }

type RenderOptions = {
  optimizeImages?: OptimizeImagesOptions
}

const escapeHTML = function (string: string) {
  const htmlEscapes = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
  } as HtmlEscapes

  const reUnescapedHtml = /[&<>"']/g
  const reHasUnescapedHtml = RegExp(reUnescapedHtml.source)

  return string && reHasUnescapedHtml.test(string)
    ? string.replace(reUnescapedHtml, (chr) => htmlEscapes[chr])
    : string
}

interface ISbTag extends Element {
  [key: string]: any
}

interface ISbNode {
  [key: string]: ISbSchema | ((arg: ISbRichtext) => any)
}

interface ISbFunction<T extends any[], R> {
  (...args: T): R
}

let hasWarnedAboutDeprecation = false; 

class RichTextResolver {
  private marks: ISbNode
  private nodes: ISbNode

  public constructor(schema?: ISbSchema) {
    if (!schema) {
      schema = defaultHtmlSerializer as ISbSchema
    }

    this.marks = schema.marks || []
    this.nodes = schema.nodes || []
  }

  public addNode(key: string, schema: ISbSchema | ISbFunction<any, any>) {
    this.nodes[key] = schema
  }

  public addMark(key: string, schema: ISbSchema) {
    this.marks[key] = schema
  }

  public render(
    data?: ISbRichtext,
    options: RenderOptions = { optimizeImages: false },
    deprecationWarning = true
  ) {
    if(!hasWarnedAboutDeprecation && deprecationWarning) {
      console.warn(
        "Warning ⚠️: The RichTextResolver class is deprecated and will be removed in the next major release. Please use the `@storyblok/richtext` package instead. https://github.com/storyblok/richtext/"
      );
      hasWarnedAboutDeprecation = true
    }
    if (data && data.content && Array.isArray(data.content)) {
      let html = ''

      data.content.forEach((node) => {
        html += this.renderNode(node)
      })

      if (options.optimizeImages) {
        return this.optimizeImages(html, options.optimizeImages)
      }

      return html
    }

    console.warn(
      `The render method must receive an Object with a "content" field.
			The "content" field must be an array of nodes as the type ISbRichtext.
			ISbRichtext:
				content?: ISbRichtext[]
				marks?: ISbRichtext[]
				attrs?: any
				text?: string
				type: string
				
				Example:
				{
					content: [
						{
							content: [
								{
									text: 'Hello World',
									type: 'text'
								}
							],
							type: 'paragraph'
						}
					],
					type: 'doc'
				}`
    )
    return ''
  }

  private optimizeImages(html: string, options: OptimizeImagesOptions): string {
    let w = 0
    let h = 0
    let imageAttributes = ''
    let filters = ''

    if (typeof options !== 'boolean') {
      if (typeof options.width === 'number' && options.width > 0) {
        imageAttributes += `width="${options.width}" `
        w = options.width
      }

      if (typeof options.height === 'number' && options.height > 0) {
        imageAttributes += `height="${options.height}" `
        h = options.height
      }

      if (options.loading === 'lazy' || options.loading === 'eager') {
        imageAttributes += `loading="${options.loading}" `
      }

      if (typeof options.class === 'string' && options.class.length > 0) {
        imageAttributes += `class="${options.class}" `
      }

      if (options.filters) {
        if (
          typeof options.filters.blur === 'number' &&
          options.filters.blur >= 0 &&
          options.filters.blur <= 100
        ) {
          filters += `:blur(${options.filters.blur})`
        }

        if (
          typeof options.filters.brightness === 'number' &&
          options.filters.brightness >= -100 &&
          options.filters.brightness <= 100
        ) {
          filters += `:brightness(${options.filters.brightness})`
        }

        if (
          options.filters.fill &&
          (options.filters.fill.match(/[0-9A-Fa-f]{6}/g) ||
            options.filters.fill === 'transparent')
        ) {
          filters += `:fill(${options.filters.fill})`
        }

        if (
          options.filters.format &&
          ['webp', 'png', 'jpeg'].includes(options.filters.format)
        ) {
          filters += `:format(${options.filters.format})`
        }

        if (
          typeof options.filters.grayscale === 'boolean' &&
          options.filters.grayscale
        ) {
          filters += ':grayscale()'
        }

        if (
          typeof options.filters.quality === 'number' &&
          options.filters.quality >= 0 &&
          options.filters.quality <= 100
        ) {
          filters += `:quality(${options.filters.quality})`
        }

        if (
          options.filters.rotate &&
          [90, 180, 270].includes(options.filters.rotate)
        ) {
          filters += `:rotate(${options.filters.rotate})`
        }

        if (filters.length > 0) filters = '/filters' + filters
      }
    }

    if (imageAttributes.length > 0) {
      html = html.replace(/<img/g, `<img ${imageAttributes.trim()}`)
    }

    const parameters =
      w > 0 || h > 0 || filters.length > 0 ? `${w}x${h}${filters}` : ''

    html = html.replace(
      /a.storyblok.com\/f\/(\d+)\/([^.]+)\.(gif|jpg|jpeg|png|tif|tiff|bmp)/g,
      `a.storyblok.com/f/$1/$2.$3/m/${parameters}`
    )

    if (typeof options !== 'boolean' && (options.sizes || options.srcset)) {
      html = html.replace(/<img.*?src=["|'](.*?)["|']/g, (value: string) => {
        const url = value.match(
          /a.storyblok.com\/f\/(\d+)\/([^.]+)\.(gif|jpg|jpeg|png|tif|tiff|bmp)/g
        )

        if (url && url.length > 0) {
          const imageAttributes = {
            srcset: options.srcset
              ?.map((value) => {
                if (typeof value === 'number') {
                  return `//${url}/m/${value}x0${filters} ${value}w`
                }

                if (typeof value === 'object' && value.length === 2) {
                  let w = 0
                  let h = 0
                  if (typeof value[0] === 'number') w = value[0]
                  if (typeof value[1] === 'number') h = value[1]
                  return `//${url}/m/${w}x${h}${filters} ${w}w`
                }
              })
              .join(', '),
            sizes: options.sizes?.map((size) => size).join(', '),
          }

          let renderImageAttributes = ''
          if (imageAttributes.srcset) {
            renderImageAttributes += `srcset="${imageAttributes.srcset}" `
          }
          if (imageAttributes.sizes) {
            renderImageAttributes += `sizes="${imageAttributes.sizes}" `
          }

          return value.replace(/<img/g, `<img ${renderImageAttributes.trim()}`)
        }

        return value
      })
    }

    return html
  }

  private renderNode(item: ISbRichtext) {
    const html = []

    if (item.marks) {
      item.marks.forEach((m) => {
        const mark = this.getMatchingMark(m)

        if (mark && mark.tag !== '') {
          html.push(this.renderOpeningTag(mark.tag))
        }
      })
    }

    const node = this.getMatchingNode(item)

    if (node && node.tag) {
      html.push(this.renderOpeningTag(node.tag))
    }

    if (item.content) {
      item.content.forEach((content) => {
        html.push(this.renderNode(content))
      })
    } else if (item.text) {
      html.push(escapeHTML(item.text))
    } else if (node && node.singleTag) {
      html.push(this.renderTag(node.singleTag, ' /'))
    } else if (node && node.html) {
      html.push(node.html)
    } else if (item.type === 'emoji') {
      html.push(this.renderEmoji(item))
    }

    if (node && node.tag) {
      html.push(this.renderClosingTag(node.tag))
    }

    if (item.marks) {
      item.marks
        .slice(0)
        .reverse()
        .forEach((m) => {
          const mark = this.getMatchingMark(m)

          if (mark && mark.tag !== '') {
            html.push(this.renderClosingTag(mark.tag))
          }
        })
    }

    return html.join('')
  }

  private renderTag(tags: ISbTag[], ending: string) {
    if (tags.constructor === String) {
      return `<${tags}${ending}>`
    }

    const all = tags.map((tag) => {
      if (tag.constructor === String) {
        return `<${tag}${ending}>`
      } else {
        let h = `<${tag.tag}`
        if (tag.attrs) {
          for (const key in tag.attrs) {
            if (Object.prototype.hasOwnProperty.call(tag.attrs, key)) {
              const value = tag.attrs[key]
              if (value !== null) {
                h += ` ${key}="${value}"`
              }
            }
          }
        }

        return `${h}${ending}>`
      }
    })
    return all.join('')
  }

  private renderOpeningTag(tags: ISbTag[]) {
    return this.renderTag(tags, '')
  }

  private renderClosingTag(tags: ISbTag[]) {
    if (tags.constructor === String) {
      return `</${tags}>`
    }

    const all = tags
      .slice(0)
      .reverse()
      .map((tag) => {
        if (tag.constructor === String) {
          return `</${tag}>`
        } else {
          return `</${tag.tag}>`
        }
      })

    return all.join('')
  }

  private getMatchingNode(item: ISbRichtext) {
    const node = this.nodes[item.type]
    if (typeof node === 'function') {
      return node(item)
    }
  }

  private getMatchingMark(item: ISbRichtext) {
    const node = this.marks[item.type]
    if (typeof node === 'function') {
      return node(item)
    }
  }

  private renderEmoji(item: ISbRichtext) {
    if (item.attrs.emoji) {
      return item.attrs.emoji
    }

    const emojiImageContainer = [
      {
        tag: 'img',
        attrs: {
          src: item.attrs.fallbackImage,
          draggable: 'false',
          loading: 'lazy',
          align: 'absmiddle',
        },
      },
    ] as unknown as ISbTag[]

    return this.renderTag(emojiImageContainer, ' /')
  }
}

export default RichTextResolver
