# 🎬 Movie Explorer

A single-page application for browsing, searching and saving movies, built with **Angular 21** and the **TMDB API**. 
Written to explore modern Angular  with a **pure RxJS** state-management approach — no NgRx, just services with `BehaviorSubject`.

**🔗 Live demo:** https://movie-explorer-scafley.netlify.app


---

## ✨ Features

- **Live search** with debouncing and request cancellation — typing filters results without hammering the API.
- **Genre filtering** via TMDB's discover endpoint, combined with search in a single reactive stream.
- **Infinite pagination** ("Load more") with page accumulation and duplicate-click protection.
- **Movie details** — synopsis, runtime, genres, cast and similar titles, loaded in parallel.
- **Favourites** — add/remove with a heart button, persisted to `localStorage`, on a dedicated page.
- **Resilient networking** — automatic retries with back-off and graceful error handling.

---

## 🛠️ Tech Stack

| Area | Choice |
|------|--------|
| Framework | Angular 21 |
| State | Pure RxJS — service-based stores with `BehaviorSubject` |
| Styling | Tailwind CSS v4 |
| HTTP | `HttpClient` + functional interceptor (auth header) |
| Testing | Vitest (unit tests with HTTP & dependency mocking) |
| Tooling | ESLint, Prettier, Husky, lint-staged, Commitlint |
| Deployment | Netlify (env-injected build, SPA routing) |
| API | [The Movie Database (TMDB)](https://www.themoviedb.org/) |

---

## 🧩 Architecture Highlights

**Feature-based structure** under `src/app/features/movies/` — API layer, models, stores, and smart/dumb components kept separate.

**Smart vs. dumb components** — container components (`MovieSearch`, `MovieDetails`) own state and inject stores; presentational components (`MovieCard`, `MovieList`) receive data via `@Input` and are fully reusable. `MovieList` is reused across the home page, favourites, and the "similar movies" section.

**RxJS state management** — each store exposes read-only slices (`movies$`, `loading$`, `error$`, `hasMore$`) derived from a private `BehaviorSubject`, with immutable updates via a `patch` helper. State changes flow through trigger subjects, so:

- **search** uses `switchMap` — a new query cancels the previous request;
- **load more** uses `exhaustMap` — clicks while a request is in flight are ignored;
- **details** uses `forkJoin` — details, cast and similar movies are fetched in parallel.

**Operators in real use:** `debounceTime`, `distinctUntilChanged`, `combineLatest`, `shareReplay` (genre caching), `retry`, `catchError`, `takeUntilDestroyed`.

---

## 🧪 Testing

Unit tests are written with **Vitest**, covering the application's business logic:

- **`MovieApi`** — endpoints, query parameters, and DTO→model mapping, with HTTP mocked via `HttpTestingController`.
- **`MovieStore`** — endpoint-selection rules (search vs. discover vs. popular), pagination accumulation vs. reset, and the last-page guard, with `MovieApi` mocked as a dependency.
- **`FavoritesStore`** — toggle add/remove, `isFavorite` reactivity, and `localStorage` persistence (mocked global).

```bash
ng test
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js 22+
- A free [TMDB API Read Access Token](https://developer.themoviedb.org/docs/getting-started)

### Setup

```bash
# install dependencies
npm install

# create your local environment file from the template
cp src/environments/environment.development.example.ts src/environments/environment.development.ts
# then paste your TMDB access token into it
```

### Run

```bash
npm start          # dev server at http://localhost:4200
```

### Build

```bash
ng build           # production build into dist/movie-explorer/browser
```

---

## 🌐 Deployment

Deployed on **Netlify**. The TMDB token is kept out of the repository: a build script (`set-env.js`) injects it from a Netlify environment variable (`TMDB_TOKEN`) into `environment.ts` at build time, and a `public/_redirects` rule routes all paths to `index.html` so client-side routing works on refresh.

> Note: as a client-only SPA, the API token is present in the shipped bundle — acceptable here since the TMDB read token is free and read-only. Hiding it fully would require a backend or serverless proxy (a planned next step).



---

## 📄 License

Released under the MIT License. Movie data and images are provided by [TMDB](https://www.themoviedb.org/); this product uses the TMDB API but is not endorsed or certified by TMDB.
