import express from 'express';

const courseGoals = [];

function renderGoalListItem(id, text) {
    return `
        <li id="goal-${id}">
            <span>${text}</span>
            <button
                hx-delete="/goals/${id}"
                hx-target="closest li"
                hx-confirm="Are you sure?"
                >Remove
            </button>
        </li>
    `
}

const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.static('public'));

app.get('/', (req, res) => {
    res.send(`
  <!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charSet="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <link rel="apple-touch-icon" sizes="180x180" href="/favicons/apple-touch-icon.png">
      <link rel="icon" type="image/png" sizes="48x48" href="/favicons/favicon-48.png" />
      <link rel="icon" type="image/png" sizes="32x32" href="/favicons/favicon-32.png">
      <link rel="icon" type="image/png" sizes="16x16" href="/favicons/favicon-16.png">
      <title>Goals Mgmt | An HTMX demo</title>
      <link rel="stylesheet" href="/main.css" />
      <script src="/htmx.js" defer></script>
    </head>
    <body>
      <main>
        <h1>Manage your course goals</h1>
        <section>
          <form 
            id="goal-form" 
            hx-post="/goals" 
            hx-target="#goals"
            hx-swap="beforeend"
            hx-on::after-request="if (event.detail.successful) this.reset()"
            hx-disabled-elt="#goal-form button">
            <div>
              <label htmlFor="goal">Goal</label>
              <input type="text" id="goal" name="goal" />
            </div>
            <button type="submit">Add goal</button>
          </form>
        </section>
        <section>
          <ul 
            id="goals" 
            hx-swap="outerHTML"
            hx-confirm="Are you sure?">
            ${courseGoals.map(
        (goal, index) => renderGoalListItem(index, goal)
    ).join('')}
          </ul>
        </section>
      </main>
    </body>
  </html>
  `);
});

app.post('/goals', (req, res) => {

    const goal = req.body.goal;
    courseGoals.push(goal);
    // res.redirect('/');

    const index = courseGoals.length - 1;
    // Simulating a delay, just to see that the submit button is disabled.
    setTimeout(() => {
        res.send(renderGoalListItem(index, goal));
    }, 500);
});

app.delete('/goals/:idx', (req, res) => {
    const index = req.params.idx;
    courseGoals.splice(index, 1);
    res.end();
})

app.listen(3010);
