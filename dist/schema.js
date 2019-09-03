"use strict";

var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");

var _concat = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/concat"));

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
            var _context;

            h += (0, _concat.default)(_context = " ".concat(key, "=\"")).call(_context, value, "\"");
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
        tag: 'bold'
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
        tag: 'italic'
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