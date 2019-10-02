"use strict";

var _interopRequireDefault = require("@babel/runtime-corejs2/helpers/interopRequireDefault");

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime-corejs2/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime-corejs2/helpers/createClass"));

require("core-js/modules/es6.regexp.replace");

require("core-js/modules/es6.regexp.constructor");

var defaultHtmlSerializer = require('./schema');

var escapeHTML = function escapeHTML(string) {
  var htmlEscapes = {
    '&': '&amp',
    '<': '&lt',
    '>': '&gt',
    '"': '&quot',
    "'": '&#39'
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
    value: function render(data) {
      var _this = this;

      var html = '';
      data.content.forEach(function (node) {
        html += _this.renderNode(node);
      });
      return html;
    }
  }, {
    key: "renderNode",
    value: function renderNode(item) {
      var _this2 = this;

      var html = [];

      if (item.marks) {
        item.marks.forEach(function (m) {
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
        item.content.forEach(function (content) {
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
        item.marks.reverse().forEach(function (m) {
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
        return "<".concat(tags).concat(ending, ">");
      }

      var all = tags.map(function (tag) {
        if (tag.constructor === String) {
          return "<".concat(tag).concat(ending, ">");
        } else {
          var h = "<".concat(tag.tag);

          if (tag.attrs) {
            for (var key in tag.attrs) {
              var value = tag.attrs[key];

              if (value !== null) {
                h += " ".concat(key, "=\"").concat(value, "\"");
              }
            }
          }

          return "".concat(h).concat(ending, ">");
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
      if (tags.constructor === String) {
        return "</".concat(tags, ">");
      }

      var all = tags.reverse().map(function (tag) {
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