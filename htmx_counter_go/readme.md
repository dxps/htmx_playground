## A Counter implementation using HTMX and Go

This is a simple showcase of implementing the classic counter example (that can be found in many JS based SPA hello world examples) using:

-   [HTMX](https://htmx.org/) as the UI library for the front-end logic.
-   Go (with [Fiber](https://gofiber.io/) framework) as the Web server and API back-end.

The (global, not user/session/browser specific) state of the counter is kept in server's memory, so that when the page is refreshed, the last value is shown.

![Screenshots](./screenshots.gif)

<br/>

### Usage

You may use `./run.sh` provided script or otherwise the classic `go run main.go` approach to start the server.

Then go to [http://localhost:9091](http://localhost:9091) and see how things are smoothly working, just as you'd use a SPA app.
