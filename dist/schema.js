"use strict";

var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");

var _concat = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/concat"));

var _objectSpread2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/objectSpread"));

var _indexOf = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/index-of"));

var pick = function pick(attrs, allowed) {
  if (!attrs) {
    return null;
  }

  var h = {};

  for (var key in attrs) {
    var value = attrs[key];

    if ((0, _indexOf.default)(allowed).call(allowed, key) > -1 && value !== null) {
      h[key] = value;
    }
  }

  return h;
};

var isEmailLinkType = function isEmailLinkType(type) {
  return type === 'email';
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
      var attrs = (0, _objectSpread2.default)({}, node.attrs);
      var _node$attrs$linktype = node.attrs.linktype,
          linktype = _node$attrs$linktype === void 0 ? 'url' : _node$attrs$linktype;

      if (isEmailLinkType(linktype)) {
        attrs.href = "mailto:".concat(attrs.href);
      }

      if (attrs.anchor) {
        var _context;

        attrs.href = (0, _concat.default)(_context = "".concat(attrs.href, "#")).call(_context, attrs.anchor);
        delete attrs.anchor;
      }

      return {
        tag: [{
          tag: 'a',
          attrs: attrs
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