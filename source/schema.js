"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pick = function (attrs, allowed) {
    const h = {};
    for (const key in attrs) {
        const value = attrs[key];
        if (allowed.indexOf(key) > -1 && value !== null) {
            h[key] = value;
        }
    }
    return h;
};
const isEmailLinkType = (type) => type === 'email';
// nodes
const horizontal_rule = () => {
    return {
        singleTag: 'hr',
    };
};
const blockquote = () => {
    return {
        tag: 'blockquote',
    };
};
const bullet_list = () => {
    return {
        tag: 'ul',
    };
};
const code_block = (node) => {
    return {
        tag: [
            'pre',
            {
                tag: 'code',
                attrs: node.attrs,
            },
        ],
    };
};
const hard_break = () => {
    return {
        singleTag: 'br',
    };
};
const heading = (node) => {
    return {
        tag: `h${node.attrs.level}`,
    };
};
const image = (node) => {
    return {
        singleTag: [
            {
                tag: 'img',
                attrs: pick(node.attrs, ['src', 'alt', 'title']),
            },
        ],
    };
};
const list_item = () => {
    return {
        tag: 'li',
    };
};
const ordered_list = () => {
    return {
        tag: 'ol',
    };
};
const paragraph = () => {
    return {
        tag: 'p',
    };
};
// marks
const bold = () => {
    return {
        tag: 'b',
    };
};
const strike = () => {
    return {
        tag: 'strike',
    };
};
const underline = () => {
    return {
        tag: 'u',
    };
};
const strong = () => {
    return {
        tag: 'strong',
    };
};
const code = () => {
    return {
        tag: 'code',
    };
};
const italic = () => {
    return {
        tag: 'i',
    };
};
const link = (node) => {
    const attrs = { ...node.attrs };
    const { linktype = 'url' } = node.attrs;
    if (isEmailLinkType(linktype)) {
        attrs.href = `mailto:${attrs.href}`;
    }
    if (attrs.anchor) {
        attrs.href = `${attrs.href}#${attrs.anchor}`;
        delete attrs.anchor;
    }
    return {
        tag: [
            {
                tag: 'a',
                attrs: attrs,
            },
        ],
    };
};
const styled = (node) => {
    return {
        tag: [
            {
                tag: 'span',
                attrs: node.attrs,
            },
        ],
    };
};
exports.default = {
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
};
