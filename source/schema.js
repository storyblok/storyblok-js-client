const pick = function(attrs, allowed) {
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

const isEmailLinkType = type => type === 'email'

export default {
  nodes: {
    horizontal_rule(node) {
      return {
        singleTag: 'hr'
      }
    },
    blockquote(node) {
      return {
        tag: 'blockquote'
      }
    },
    bullet_list(node) {
      return {
        tag: 'ul'
      }
    },
    code_block(node) {
      return {
        tag: [
          'pre',
          {
            tag: 'code',
            attrs: node.attrs
          }
        ]
      }
    },
    hard_break(node) {
      return {
        singleTag: 'br'
      }
    },
    heading(node) {
      return {
        tag: `h${node.attrs.level}`
      }
    },
    image(node) {
      return {
        singleTag: [{
          tag: 'img',
          attrs: pick(node.attrs, ['src', 'alt', 'title'])
        }]
      }
    },
    list_item(node) {
      return {
        tag: 'li'
      }
    },
    ordered_list(node) {
      return {
        tag: 'ol'
      }
    },
    paragraph(node) {
      return {
        tag: 'p'
      }
    }
  },
  marks: {
    bold() {
      return {
        tag: 'b'
      }
    },
    strike() {
      return {
        tag: 'strike'
      }
    },
    underline() {
      return {
        tag: 'u'
      }
    },
    strong() {
      return {
        tag: 'strong'
      }
    },
    code() {
      return {
        tag: 'code'
      }
    },
    italic() {
      return {
        tag: 'i'
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
        tag: [{
          tag: 'a',
          attrs: attrs
        }]
      }
    },
    styled(node) {
      return {
        tag: [{
          tag: 'span',
          attrs: node.attrs
        }]
      }
    }
  }
}