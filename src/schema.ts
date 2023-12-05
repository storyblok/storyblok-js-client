import { ISbNode, NodeSchema, MarkSchema, ISbComponentType } from './interfaces'
import { SbHelpers } from './sbHelpers'

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
	[key: string]: string | number | Array<ISbComponentType<any>>
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
const code_block: NodeSchema = (node: ISbNode) => {
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
const heading: NodeSchema = (node: ISbNode) => {
	return {
		tag: `h${node.attrs.level}`,
	}
}

const image: NodeSchema = (node: ISbNode) => {
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

const emoji: NodeSchema = (node: ISbNode) => {
	const attrs = {
		['data-type']: 'emoji',
		['data-name']: node.attrs.name,
		emoji: node.attrs.emoji
	}

	return {
		tag: [
			{
				tag: 'span',
				attrs: attrs,
			},
		],
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
		tag: 's',
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
const link: MarkSchema = (node: ISbNode) => {
	if (!node.attrs) {
		return {
			tag: '',
		}
	}
	const escapeHTML = new SbHelpers().escapeHTML
	const attrs = { ...node.attrs }
	const { linktype = 'url' } = node.attrs
	delete attrs.linktype

	if (attrs.href) {
		attrs.href = escapeHTML(node.attrs.href || '')
	}

	if (isEmailLinkType(linktype)) {
		attrs.href = `mailto:${attrs.href}`
	}

	if (attrs.anchor) {
		attrs.href = `${attrs.href}#${attrs.anchor}`
		delete attrs.anchor
	}

	if (attrs.custom) {
		for (const key in attrs.custom) {
		  attrs[key] = attrs.custom[key]
		}
		delete attrs.custom
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

const styled: MarkSchema = (node: ISbNode) => {
	return {
		tag: [
			{
				tag: 'span',
				attrs: node.attrs,
			},
		],
	}
}

const subscript: MarkSchema = () => {
	return {
		tag: 'sub',
	}
}

const superscript: MarkSchema = () => {
	return {
		tag: 'sup'
	}
}

const anchor: MarkSchema = (node: ISbNode) => {
	return {
		tag: [
			{
				tag: 'span',
				attrs: node.attrs,
			},
		],
	}
}

const highlight: MarkSchema = (node: ISbNode) => {
	if (!node.attrs?.color) return {
		tag: '',
	}

	const attrs = {
		['style']: `background-color:${node.attrs.color};`,
	}
	return {
		tag: [
			{
				tag: 'span',
				attrs,
			},
		],
	}
}

const textStyle: MarkSchema = (node: ISbNode) => {
	if (!node.attrs?.color) return {
		tag: '',
	}

	const attrs = {
		['style']: `color:${node.attrs.color}`,
	}
	return {
		tag: [
			{
				tag: 'span',
				attrs,
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
		emoji
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
		subscript,
		superscript,
		anchor,
		highlight,
		textStyle,
	},
}
