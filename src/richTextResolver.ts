import defaultHtmlSerializer from './schema'
import { ISbSchema, ISbRichtext } from './interfaces'

type HtmlEscapes = {
	[key: string]: string,
}

const escapeHTML = function (string: string) {
	const htmlEscapes = {
		'&': '&amp;',
		'<': '&lt;',
		'>': '&gt;',
		'"': '&quot;',
		'\'': '&#39;',
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
	[key: string]: ISbSchema
}

class RichTextResolver {
	private marks: ISbNode
	private nodes: ISbNode

	public constructor(schema?: ISbSchema) {
		if (!schema) {
			schema = defaultHtmlSerializer as ISbSchema
		}

		this.marks = schema.marks
		this.nodes = schema.nodes
	}

	public addNode(key: string, schema: ISbSchema) {
		this.nodes[key] = schema
	}

	public addMark(key: string, schema: ISbSchema) {
		this.marks[key] = schema
	}

	public render(data?: ISbRichtext) {
		if (data && data.content && Array.isArray(data.content)) {
			let html = ''

			data.content.forEach((node) => {
				html += this.renderNode(node)
			})

			return html
		}

		console.warn(
			'The render method must receive an object with a content field, which is an array'
		)
		return ''
	}

	private renderNode(item: ISbRichtext) {
		const html = []

		if (item.marks) {
			item.marks.forEach((m) => {
				const mark = this.getMatchingMark(m)

				if (mark) {
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

					if (mark) {
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
						const value = tag.attrs[key]
						if (value !== null) {
							h += ` ${key}="${value}"`
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
		if (typeof this.nodes[item.type] !== 'function') {
			return
		}
		return this.nodes[item.type](item)
	}

	private getMatchingMark(item: ISbRichtext) {
		if (typeof this.marks[item.type] === 'function') {
			return this.marks[item.type](item)
		}
		return this.marks[item.type](item)
	}
}

export default RichTextResolver
