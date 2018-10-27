"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

require("util.promisify/shim")();

const util = require("util");

const ical = require("node-ical");

const crypto = require("crypto");

const fromURL = util.promisify(ical.fromURL);

const createContentDigest = obj => crypto.createHash(`md5`).update(JSON.stringify(obj)).digest(`hex`);

function processDatum(datum, createNodeId, sourceInstanceName = "__PROGRAMMATIC__") {
  return {
    id: createNodeId(datum.uid),
    parent: null,
    type: datum.type,
    uid: datum.uid,
    dtstamp: new Date(datum.dtstamp),
    start: new Date(datum.start),
    end: new Date(datum.end),
    summary: datum.summary,
    location: datum.location,
    description: datum.description,
    children: [],
    sourceInstanceName,
    internal: {
      type: "Ical",
      contentDigest: createContentDigest(datum)
    }
  };
}

exports.sourceNodes =
/*#__PURE__*/
function () {
  var _ref = (0, _asyncToGenerator2.default)(function* ({
    actions,
    createNodeId
  }, {
    url,
    name
  }) {
    const createNode = actions.createNode;
    const data = yield fromURL(url, {});

    for (let id in data) {
      if (!data.hasOwnProperty(id)) {
        return;
      }

      const datum = data[id];
      createNode(processDatum(datum, createNodeId, name));
    }
  });

  return function (_x, _x2) {
    return _ref.apply(this, arguments);
  };
}();