"use strict";

var pick = function pick(attrs, allowed) {
  if (!attrs) {
    return null;
  }

  var h = {};

  for (var key in attrs) {
    var value = attrs[key];

    if (allowed.indexOf(key) > -1 && value !== null) {
      h[key] = value;
    }
  }

  return h;
};

module.exports = {
  nodes: {
    horizontal_rule: function horizontal_rule(node) {
      return {
        singleTag: 'hr'
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
        singleTag: 'br'
      };
    },
    heading: function heading(node) {
      return {
        tag: "h".concat(node.attrs.level)
      };
    },
    image: function image(node) {
      return {
        singleTag: [{
          tag: 'img',
          attrs: pick(node.attrs, ['src', 'alt', 'title'])
        }]
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
    },
    styled: function styled(node) {
      return {
        tag: [{
          tag: 'span',
          attrs: node.attrs
        }]
      };
    }
  }
};