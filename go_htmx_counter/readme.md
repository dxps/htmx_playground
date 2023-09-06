## A Counter implementation using Go and HTMX

This is a simple showcase of using Go (with [Fiber](https://gofiber.io/) framework) and [HTMX](https://htmx.org/) for implementing the classic counter example that can be found in many JS based SPA hello world examples.

The (global, not user/session/browser specific) state of the counter is kept in server's memory, so that when the page is refreshed, the last value is shown.

### Usage

You may use `./run.sh` provided script or otherwise the classic `go run main.go` approach to start the server.

Then go to [http://localhost:9091](http://localhost:9091) and see how things are smoothly working, just as you'd use a SPA app.
