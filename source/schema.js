module.exports = {
  nodes: {
  	horizontal_rule(node) {
      return {
        html: '<hr />'
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
        html: '<br />'
      }
    },
    heading(node) {
      return {
        tag: `h${node.attrs.level}`
      }
    },
    image(node) {
      let h = '<img'
      if (node.attrs) {
        for (let key in node.attrs) {
          let value = node.attrs[key]
          if (value !== null) {
            h += ` ${key}="${value}"`
          }
        }
      }
      h += ' />'

      return {
        html: h
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
      return {
        tag: [{
          tag: 'a',
          attrs: node.attrs
        }]
      }
    }
  }
}