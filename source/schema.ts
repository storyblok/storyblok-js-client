import { INode, NodeSchema, MarkSchema, IStoryblokComponent } from './interfaces'

const pick = function (attrs: Attrs, allowed: string[]) {
	const h = {} as Attrs

	for (const key in attrs) {
		const value = attrs[key]
		if (allowed.indexOf(key) > -1 && value !== null) {
			h[key] = value
		}
	}
	return h
}

const isEmailLinkType = (type: string) => type === 'email'

type Attrs = {
	[key: string]: string | number | Array<IStoryblokComponent<any>>
}

// nodes
const horizontal_rule: NodeSchema = () => {
	return {
		singleTag: 'hr',
	}
}
const blockquote: NodeSchema = () => {
	return {
		tag: 'blockquote',
	}
}
const bullet_list: NodeSchema = () => {
	return {
		tag: 'ul',
	}
}
const code_block: NodeSchema = (node: INode) => {
	return {
		tag: [
			'pre',
			{
				tag: 'code',
				attrs: node.attrs,
			},
		],
	}
}
const hard_break: NodeSchema = () => {
	return {
		singleTag: 'br',
	}
}
const heading: NodeSchema = (node: INode) => {
	return {
		tag: `h${node.attrs.level}`,
	}
}
const image: NodeSchema = (node: INode) => {
	return {
		singleTag: [
			{
				tag: 'img',
				attrs: pick(node.attrs, ['src', 'alt', 'title']),
			},
		],
	}
}
const list_item: NodeSchema = () => {
	return {
		tag: 'li',
	}
}
const ordered_list: NodeSchema = () => {
	return {
		tag: 'ol',
	}
}
const paragraph: NodeSchema = () => {
	return {
		tag: 'p',
	}
}

// marks
const bold: MarkSchema = () => {
	return {
		tag: 'b',
	}
}
const strike: MarkSchema = () => {
	return {
		tag: 'strike',
	}
}
const underline: MarkSchema = () => {
	return {
		tag: 'u',
	}
}
const strong: MarkSchema = () => {
	return {
		tag: 'strong',
	}
}
const code: MarkSchema = () => {
	return {
		tag: 'code',
	}
}
const italic: MarkSchema = () => {
	return {
		tag: 'i',
	}
}
const link: MarkSchema = (node :INode) => {
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
}
const styled: MarkSchema = (node :INode) => {
	return {
		tag: [
			{
				tag: 'span',
				attrs: node.attrs,
			},
		],
	}
}

export default {
	nodes: {
		horizontal_rule,
		blockquote,
		bullet_list,
		code_block,
		hard_break,
		heading,
		image,
		list_item,
		ordered_list,
		paragraph,
	},
	marks: {
		bold,
		strike,
		underline,
		strong,
		code,
		italic,
		link,
		styled,
	},
}
