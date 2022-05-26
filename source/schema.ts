const pick = function (attrs, allowed: string) {
	if (!attrs) {
		return null
	}
	let h = {}
	for (let key in attrs) {
		let value = attrs[key]
		if (allowed.indexOf(key) > -1 && value !== null) {
			h[key] = value
		}
	}
	return h
}

const isEmailLinkType = (type) => type === 'email'

export interface ISchema {
	nodes: {
		horizontal_rule() {
			return {
				singleTag: 'hr',
			}
		},
		blockquote() {
			return {
				tag: 'blockquote',
			}
		},
		bullet_list() {
			return {
				tag: 'ul',
			}
		},
		code_block(node) {
			return {
				tag: [
					'pre',
					{
						tag: 'code',
						attrs: node.attrs,
					},
				],
			}
		},
		hard_break() {
			return {
				singleTag: 'br',
			}
		},
		heading(node) {
			return {
				tag: `h${node.attrs.level}`,
			}
		},
		image(node) {
			return {
				singleTag: [
					{
						tag: 'img',
						attrs: pick(node.attrs, ['src', 'alt', 'title']),
					},
				],
			}
		},
		list_item() {
			return {
				tag: 'li',
			}
		},
		ordered_list() {
			return {
				tag: 'ol',
			}
		},
		paragraph() {
			return {
				tag: 'p',
			}
		},
	},
	marks: {
		bold() {
			return {
				tag: 'b',
			}
		},
		strike() {
			return {
				tag: 'strike',
			}
		},
		underline() {
			return {
				tag: 'u',
			}
		},
		strong() {
			return {
				tag: 'strong',
			}
		},
		code() {
			return {
				tag: 'code',
			}
		},
		italic() {
			return {
				tag: 'i',
			}
		},
		link(node) {
			const attrs = { ...node.attrs }
			const { linktype = 'url' } = node.attrs

			if (isEmailLinkType(linktype)) {
				attrs.href = `mailto:${attrs.href}`
			}

			if (attrs.anchor) {
				attrs.href = `${attrs.href}#${attrs.anchor}`
				delete attrs.anchor
			}

			return {
				tag: [
					{
						tag: 'a',
						attrs: attrs,
					},
				],
			}
		},
		styled(node) {
			return {
				tag: [
					{
						tag: 'span',
						attrs: node.attrs,
					},
				],
			}
		},
	},
}
