require("util.promisify/shim")();
const util = require("util");
const ical = require("node-ical");
const crypto = require("crypto");

const fromURL = util.promisify(ical.fromURL);

const createContentDigest = obj =>
  crypto
    .createHash(`md5`)
    .update(JSON.stringify(obj))
    .digest(`hex`);

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

exports.sourceNodes = async (
  { actions, createNodeId },
  { url, name, upcomingOnly }
) => {
  const { createNode } = actions;

  const data = await fromURL(url, {});

  for (let id in data) {
    if (!data.hasOwnProperty(id)) {
      return;
    }

    const datum = data[id];

    if (datum.type === 'VEVENT' && (!upcomingOnly || datum.start > new Date())) {
      createNode(processDatum(datum, createNodeId, name));
    }
  }
};
