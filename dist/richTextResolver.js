"use strict";

var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");

var _map = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/map"));

var _concat = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/concat"));

var _slice = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/slice"));

var _reverse = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/reverse"));

var _forEach = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/for-each"));

var _isArray = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/array/is-array"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/createClass"));

var defaultHtmlSerializer = require('./schema');

var escapeHTML = function escapeHTML(string) {
  var htmlEscapes = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  };
  var reUnescapedHtml = /[&<>"']/g;
  var reHasUnescapedHtml = RegExp(reUnescapedHtml.source);
  return string && reHasUnescapedHtml.test(string) ? string.replace(reUnescapedHtml, function (chr) {
    return htmlEscapes[chr];
  }) : string;
};

var RichTextResolver =
/*#__PURE__*/
function () {
  function RichTextResolver(schema) {
    (0, _classCallCheck2.default)(this, RichTextResolver);

    if (!schema) {
      schema = defaultHtmlSerializer;
    }

    this.marks = schema.marks;
    this.nodes = schema.nodes;
  }

  (0, _createClass2.default)(RichTextResolver, [{
    key: "addNode",
    value: function addNode(key, schema) {
      this.nodes[key] = schema;
    }
  }, {
    key: "addMark",
    value: function addMark(key, schema) {
      this.marks[key] = schema;
    }
  }, {
    key: "render",
    value: function render() {
      var _this = this;

      var data = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      if (data.content && (0, _isArray.default)(data.content)) {
        var _context;

        var html = '';
        (0, _forEach.default)(_context = data.content).call(_context, function (node) {
          html += _this.renderNode(node);
        });
        return html;
      }

      console.warn('The render method must receive an object with a content field, which is an array');
      return '';
    }
  }, {
    key: "renderNode",
    value: function renderNode(item) {
      var _this2 = this;

      var html = [];

      if (item.marks) {
        var _context2;

        (0, _forEach.default)(_context2 = item.marks).call(_context2, function (m) {
          var mark = _this2.getMatchingMark(m);

          if (mark) {
            html.push(_this2.renderOpeningTag(mark.tag));
          }
        });
      }

      var node = this.getMatchingNode(item);

      if (node && node.tag) {
        html.push(this.renderOpeningTag(node.tag));
      }

      if (item.content) {
        var _context3;

        (0, _forEach.default)(_context3 = item.content).call(_context3, function (content) {
          html.push(_this2.renderNode(content));
        });
      } else if (item.text) {
        html.push(escapeHTML(item.text));
      } else if (node && node.singleTag) {
        html.push(this.renderTag(node.singleTag, ' /'));
      } else if (node && node.html) {
        html.push(node.html);
      }

      if (node && node.tag) {
        html.push(this.renderClosingTag(node.tag));
      }

      if (item.marks) {
        var _context4, _context5, _context6;

        (0, _forEach.default)(_context4 = (0, _reverse.default)(_context5 = (0, _slice.default)(_context6 = item.marks).call(_context6, 0)).call(_context5)).call(_context4, function (m) {
          var mark = _this2.getMatchingMark(m);

          if (mark) {
            html.push(_this2.renderClosingTag(mark.tag));
          }
        });
      }

      return html.join('');
    }
  }, {
    key: "renderTag",
    value: function renderTag(tags, ending) {
      if (tags.constructor === String) {
        var _context7;

        return (0, _concat.default)(_context7 = "<".concat(tags)).call(_context7, ending, ">");
      }

      var all = (0, _map.default)(tags).call(tags, function (tag) {
        if (tag.constructor === String) {
          var _context8;

          return (0, _concat.default)(_context8 = "<".concat(tag)).call(_context8, ending, ">");
        } else {
          var _context10;

          var h = "<".concat(tag.tag);

          if (tag.attrs) {
            for (var key in tag.attrs) {
              var value = tag.attrs[key];

              if (value !== null) {
                var _context9;

                h += (0, _concat.default)(_context9 = " ".concat(key, "=\"")).call(_context9, value, "\"");
              }
            }
          }

          return (0, _concat.default)(_context10 = "".concat(h)).call(_context10, ending, ">");
        }
      });
      return all.join('');
    }
  }, {
    key: "renderOpeningTag",
    value: function renderOpeningTag(tags) {
      return this.renderTag(tags, '');
    }
  }, {
    key: "renderClosingTag",
    value: function renderClosingTag(tags) {
      var _context11, _context12;

      if (tags.constructor === String) {
        return "</".concat(tags, ">");
      }

      var all = (0, _map.default)(_context11 = (0, _reverse.default)(_context12 = (0, _slice.default)(tags).call(tags, 0)).call(_context12)).call(_context11, function (tag) {
        if (tag.constructor === String) {
          return "</".concat(tag, ">");
        } else {
          return "</".concat(tag.tag, ">");
        }
      });
      return all.join('');
    }
  }, {
    key: "getMatchingNode",
    value: function getMatchingNode(item) {
      if (typeof this.nodes[item.type] !== 'function') {
        return;
      }

      return this.nodes[item.type](item);
    }
  }, {
    key: "getMatchingMark",
    value: function getMatchingMark(item) {
      if (typeof this.marks[item.type] !== 'function') {
        return;
      }

      return this.marks[item.type](item);
    }
  }]);
  return RichTextResolver;
}();

module.exports = RichTextResolver;