// this is an example of custom schema to RichTextResolver

export default {
  nodes: {},
  marks: {
    // this custom schema render a anchor tag (<a></a>)
    // without mailto information when is an e-mail
    // and use % instead # in anchor links
    link(node) {
      const attrs = { ...node.attrs }
      if (attrs.anchor) {
        attrs.href = `${attrs.href}%${attrs.anchor}`
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
  },
}