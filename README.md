Google client
---

_Note:_ Just supports calendar operations currently

### Running tests

You'll need to create a `env.sh` in the root directory with the following contents:

    export SCOPE="Insert value here"
    export CLIENT="Insert value here"
    export APIKEY="insert value here"
    export CALENDAR="Insert value here"

With `enc.sh` in place you can run tests with `npm test` or debug from browser via `npm start`.
