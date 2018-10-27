# gatsby-source-ical

Plugin for creating `Ical` nodes from the remote file.

## Install

`npm install --save gatsby-source-ical`

## How to use

```javascript
// In your gatsby-config.js
module.exports = {
  plugins: [
    // You can have multiple instances of this plugin
    // to read source nodes from different remote files
    {
      resolve: `gatsby-source-ical`,
      options: {
        name: `events`,
        url: `https://web-standards.ru/calendar.ics`,
      },
    },
  ],
}
```

## How to query

You can query calendar nodes like the following:

```graphql
{
  allIcal {
    edges {
      node {
        start
        end
        summary
      }
    }
  }
}
```

To filter by the `name` you specified in the config, use `sourceInstanceName`:

```graphql
{
  allIcal(filter: { sourceInstanceName: { eq: "events" } }) {
    edges {
      node {
        start
        end
        summary
      }
    }
  }
}
```
