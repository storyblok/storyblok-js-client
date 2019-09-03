"use strict";

module.exports = {
  nodes: {
    horizontal_rule: function horizontal_rule(node) {
      return {
        html: '<hr />'
      };
    },
    blockquote: function blockquote(node) {
      return {
        tag: 'blockquote'
      };
    },
    bullet_list: function bullet_list(node) {
      return {
        tag: 'ul'
      };
    },
    code_block: function code_block(node) {
      return {
        tag: ['pre', {
          tag: 'code',
          attrs: node.attrs
        }]
      };
    },
    hard_break: function hard_break(node) {
      return {
        html: '<br />'
      };
    },
    heading: function heading(node) {
      return {
        tag: "h".concat(node.attrs.level)
      };
    },
    image: function image(node) {
      var h = '<img';

      if (node.attrs) {
        for (var key in node.attrs) {
          var value = node.attrs[key];

          if (value !== null) {
            h += " ".concat(key, "=\"").concat(value, "\"");
          }
        }
      }

      h += ' />';
      return {
        html: h
      };
    },
    list_item: function list_item(node) {
      return {
        tag: 'li'
      };
    },
    ordered_list: function ordered_list(node) {
      return {
        tag: 'ol'
      };
    },
    paragraph: function paragraph(node) {
      return {
        tag: 'p'
      };
    }
  },
  marks: {
    bold: function bold() {
      return {
        tag: 'b'
      };
    },
    strike: function strike() {
      return {
        tag: 'strike'
      };
    },
    underline: function underline() {
      return {
        tag: 'u'
      };
    },
    strong: function strong() {
      return {
        tag: 'strong'
      };
    },
    code: function code() {
      return {
        tag: 'code'
      };
    },
    italic: function italic() {
      return {
        tag: 'i'
      };
    },
    link: function link(node) {
      return {
        tag: [{
          tag: 'a',
          attrs: node.attrs
        }]
      };
    }
  }
};