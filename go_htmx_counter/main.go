package main

import (
	"log"

	counter "github.com/dxps/go_htmx_playground/go_htmx_counter/internal"
	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/template/html/v2"
)

func main() {

	counter := counter.Counter{}

	// Init the standard Go html template views.
	views := html.New("./views", ".html")

	app := fiber.New(fiber.Config{Views: views})

	app.Get("/", func(c *fiber.Ctx) error {
		return c.Render("index", fiber.Map{
			"CounterValue": counter.GetValue(),
		})
	})

	app.Post("/increase", func(c *fiber.Ctx) error {
		counter.Increase()
		return renderCounter(counter.GetValue(), c)
	})

	app.Post("/decrease", func(c *fiber.Ctx) error {
		counter.Decrease()
		return renderCounter(counter.GetValue(), c)
	})

	app.Static("/public", "./public")

	log.Fatal(app.Listen(":9091"))
}

func renderCounter(counterValue int, c *fiber.Ctx) error {

	return c.Render("counter", fiber.Map{
		"CounterValue": counterValue,
	})
}
