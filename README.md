Google client wrapper
---

_Note:_ Currently supports calendar operations.

### Running tests

You'll need to create a `env.sh` in the root directory with the following contents:

    export SCOPE="Insert value here"
    export CLIENT="Insert value here"
    export APIKEY="insert value here"
    export CALENDAR="Insert value here"

With `env.sh` in place you can run then tests with `npm test` or debug from browser via `npm start`.
