const DB_NAME = "htmx4mobile";
const DB_VERSION = 1;
const MOVIE_STORE = "movies";
const META_STORE = "metadata";
const CACHE_TIME_KEY = "movies.cachedAt";

const sampleMovies = [
  {
    id: "movie-spirited-away",
    title: "Spirited Away",
    description: "A young girl finds courage in a strange bathhouse world.",
    year: 2001
  },
  {
    id: "movie-moonlight",
    title: "Moonlight",
    description: "Three chapters trace identity, tenderness, and survival.",
    year: 2016
  }
];

function requestToPromise(request) {
  return new Promise((resolve, reject) => {
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

function transactionDone(transaction) {
  return new Promise((resolve, reject) => {
    transaction.oncomplete = () => resolve();
    transaction.onerror = () => reject(transaction.error);
    transaction.onabort = () => reject(transaction.error);
  });
}

const movieStore = {
  dbPromise: null,

  open() {
    if (this.dbPromise) return this.dbPromise;

    this.dbPromise = new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onupgradeneeded = () => {
        const db = request.result;
        if (!db.objectStoreNames.contains(MOVIE_STORE)) {
          const movies = db.createObjectStore(MOVIE_STORE, { keyPath: "id" });
          movies.createIndex("year", "year");
          movies.createIndex("title", "title");
        }
        if (!db.objectStoreNames.contains(META_STORE)) {
          db.createObjectStore(META_STORE, { keyPath: "key" });
        }
      };

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });

    return this.dbPromise;
  },

  async all() {
    const db = await this.open();
    const transaction = db.transaction(MOVIE_STORE, "readonly");
    return requestToPromise(transaction.objectStore(MOVIE_STORE).getAll());
  },

  async get(id) {
    const db = await this.open();
    const transaction = db.transaction(MOVIE_STORE, "readonly");
    return requestToPromise(transaction.objectStore(MOVIE_STORE).get(id));
  },

  async count() {
    const db = await this.open();
    const transaction = db.transaction(MOVIE_STORE, "readonly");
    return requestToPromise(transaction.objectStore(MOVIE_STORE).count());
  },

  async save(movie) {
    const db = await this.open();
    const transaction = db.transaction([MOVIE_STORE, META_STORE], "readwrite");
    transaction.objectStore(MOVIE_STORE).put(movie);
    transaction.objectStore(META_STORE).put({ key: CACHE_TIME_KEY, value: new Date().toISOString() });
    await transactionDone(transaction);
  },

  async saveMany(movies) {
    const db = await this.open();
    const transaction = db.transaction([MOVIE_STORE, META_STORE], "readwrite");
    const movieRecords = transaction.objectStore(MOVIE_STORE);
    for (const movie of movies) movieRecords.put(movie);
    transaction.objectStore(META_STORE).put({ key: CACHE_TIME_KEY, value: new Date().toISOString() });
    await transactionDone(transaction);
  },

  async delete(id) {
    const db = await this.open();
    const transaction = db.transaction([MOVIE_STORE, META_STORE], "readwrite");
    transaction.objectStore(MOVIE_STORE).delete(id);
    transaction.objectStore(META_STORE).put({ key: CACHE_TIME_KEY, value: new Date().toISOString() });
    await transactionDone(transaction);
  },

  async cachedAt() {
    const db = await this.open();
    const transaction = db.transaction(META_STORE, "readonly");
    const record = await requestToPromise(transaction.objectStore(META_STORE).get(CACHE_TIME_KEY));
    return record?.value;
  },

  async clear() {
    const db = await this.open();
    const transaction = db.transaction([MOVIE_STORE, META_STORE], "readwrite");
    transaction.objectStore(MOVIE_STORE).clear();
    transaction.objectStore(META_STORE).clear();
    await transactionDone(transaction);
  }
};

function movieId() {
  if (crypto.randomUUID) return crypto.randomUUID();
  return `movie-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function setConnectionStatus() {
  const status = document.querySelector("#connection-status");
  if (!status) return;

  const online = navigator.onLine;
  status.textContent = online ? "Online" : "Offline";
  status.classList.toggle("offline", !online);
}

async function setCacheState() {
  const cacheState = document.querySelector("#cache-state");
  if (!cacheState) return;

  const cachedAt = await movieStore.cachedAt();
  if (!cachedAt) {
    cacheState.textContent = "Stored in IndexedDB";
    return;
  }

  cacheState.textContent = `IndexedDB cache ${new Date(cachedAt).toLocaleString([], {
    dateStyle: "medium",
    timeStyle: "short"
  })}`;
}

async function renderMovies() {
  const list = document.querySelector("#movie-list");
  const empty = document.querySelector("#empty-state");
  const template = document.querySelector("#movie-row-template");
  if (!list || !empty || !template) return;

  const movies = (await movieStore.all()).sort((a, b) => b.year - a.year || a.title.localeCompare(b.title));
  list.replaceChildren();
  empty.hidden = movies.length > 0;

  for (const movie of movies) {
    const node = template.content.firstElementChild.cloneNode(true);
    node.dataset.movieId = movie.id;
    node.querySelector(".movie-year").textContent = movie.year;
    node.querySelector(".movie-title").textContent = movie.title;
    node.querySelector(".movie-description").textContent = movie.description;
    node.querySelector(".movie-id").textContent = `ID: ${movie.id}`;
    node.querySelector('[data-action="edit"]').addEventListener("click", () => editMovie(movie.id));
    node.querySelector('[data-action="delete"]').addEventListener("click", () => deleteMovie(movie.id));
    list.append(node);
  }

  await setCacheState();
}

function resetForm() {
  const form = document.querySelector("#movie-form");
  if (!form) return;

  form.reset();
  form.querySelector("#movie-id").value = "";
  document.querySelector("#movie-form-title").textContent = "Add a movie";
  document.querySelector("#save-button").textContent = "Add movie";
  form.querySelector("#movie-title").focus();
}

async function save(event) {
  event.preventDefault();

  const form = event.currentTarget;
  const data = new FormData(form);
  const id = data.get("id") || movieId();
  const movie = {
    id,
    title: data.get("title").trim(),
    description: data.get("description").trim(),
    year: Number(data.get("year"))
  };

  if (!movie.title || !movie.description || !movie.year) return;

  await movieStore.save(movie);
  await renderMovies();
  resetForm();
}

async function editMovie(id) {
  const movie = await movieStore.get(id);
  const form = document.querySelector("#movie-form");
  if (!movie || !form) return;

  form.querySelector("#movie-id").value = movie.id;
  form.querySelector("#movie-title").value = movie.title;
  form.querySelector("#movie-description").value = movie.description;
  form.querySelector("#movie-year").value = movie.year;
  document.querySelector("#movie-form-title").textContent = "Edit movie";
  document.querySelector("#save-button").textContent = "Save changes";
  form.scrollIntoView({ behavior: "smooth", block: "start" });
}

async function deleteMovie(id) {
  await movieStore.delete(id);
  await renderMovies();
  resetForm();
}

async function seed() {
  const movies = await movieStore.all();
  const ids = new Set(movies.map((movie) => movie.id));
  await movieStore.saveMany(sampleMovies.filter((movie) => !ids.has(movie.id)));
  await renderMovies();
}

async function ensureSeedData() {
  if ((await movieStore.count()) === 0) await seed();
}

async function clearMovies() {
  await movieStore.clear();
  await renderMovies();
}

async function initializeMovies() {
  await ensureSeedData();
  await renderMovies();
}

async function registerServiceWorker() {
  if (!("serviceWorker" in navigator)) return;
  try {
    await navigator.serviceWorker.register("/service-worker.js");
  } catch (error) {
    console.warn("Service worker registration failed", error);
  }
}

window.movieApp = {
  clear: clearMovies,
  deleteMovie,
  editMovie,
  ready: Promise.resolve(),
  renderMovies,
  resetForm,
  save,
  seed
};

window.addEventListener("online", setConnectionStatus);
window.addEventListener("offline", setConnectionStatus);
document.body.addEventListener("htmx:after:swap", () => {
  window.movieApp.ready = initializeMovies();
});
document.addEventListener("DOMContentLoaded", () => {
  setConnectionStatus();
  registerServiceWorker();
});
