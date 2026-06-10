import renderLocation from './components/location.js';

export default function renderLocationsPage(availableLocations, interestingLocations) {
    return `
    <!DOCTYPE html>
    <html>
      <head>
        <link rel="apple-touch-icon" sizes="180x180" href="/favicons/apple-touch-icon.png">
        <link rel="icon" type="image/png" sizes="48x48" href="/favicons/favicon-48.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicons/favicon-32.png">
        <link rel="icon" type="image/png" sizes="16x16" href="/favicons/favicon-16.png">
        <title>Interesting Locations</title>
        <link rel="stylesheet" href="/main.css" />
        <link rel="icon" href="/logo.png" />
        <script src="/htmx.js" defer></script>
      </head>
      <body>
        <header>
          <img src="/logo.png" alt="Stylized globe" />
          <h1>PlacePicker</h1>
          <p>
            Create your personal collection of places you would like to visit or you have visited.
          </p>
        </header>
        <main>
          <section class="locations-category">
            <h2>My Dream Locations</h2>
            <ul id="interesting-locations" class="locations">
              ${interestingLocations.map((location) => renderLocation(location, false)).join('')}
            </ul>
          </section>

          <section class="locations-category">
            <h2>Available Locations</h2>
            <ul id="available-locations" class="locations">
              ${availableLocations.map((location) => renderLocation(location)).join('')}
            </ul>
          </section>
        </main>
      </body>
    </html>
  `;
}
