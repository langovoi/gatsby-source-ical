const ical = require("node-ical");

function processDatum(
  datum,
  createNodeId,
  createContentDigest,
  sourceInstanceName = "__PROGRAMMATIC__"
) {
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
    rrule: datum.rrule !== undefined ? datum.rrule.toString() : undefined,
    children: [],
    sourceInstanceName,
    internal: {
      type: "Ical",
      contentDigest: createContentDigest(datum)
    }
  };
}

/**
 * @type {import('gatsby').GatsbyNode['sourceNodes']}
 */
exports.sourceNodes = async (
  { actions, createNodeId, createContentDigest },
  { url, name }
) => {
  const { createNode } = actions;

  const data = await ical.async.fromURL(url);

  for (let id in data) {
    if (!data.hasOwnProperty(id)) {
      return;
    }

    const datum = data[id];

    if (datum.type === "VEVENT") {
      createNode(processDatum(datum, createNodeId, createContentDigest, name));
    }
  }
};
