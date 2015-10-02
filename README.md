# Wikipedia List of Episodes parser

Simple node.js parser for wikipedia List of episodes pages. Currently only supports list of episodes pages and not sub-sections with episodes.

## Quickstart
```js
var LOE = require('WP-LOE');

LOE("https://en.wikipedia.org/wiki/List_of_Arrow_episodes")
    .then((episodes) => {
        // ...
    })
    .catch((err) => {
        // ...
    });

LOE({
    url: "https://en.wikipedia.org/wiki/List_of_Arrow_episodes"
})
    .then((episodes) => {
        // ...
    })
    .catch((err) => {
        // ...
    });
```
### Object
Options Object are passed to the [request module](https://www.npmjs.com/package/request)
