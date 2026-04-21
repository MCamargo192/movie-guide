# Movie Guide

A React web app for discovering movies, TV shows, and people powered by the [TMDB API](https://www.themoviedb.org/documentation/api).

## Features

- **Home** — daily trending movies, TV shows, and people
- **Movies catalogue** — browse Popular, Now Playing, Upcoming, and Top Rated movies
- **TV Shows catalogue** — browse Popular, On the Air, and Top Rated series
- **People catalogue** — explore popular actors and crew members
- **Detail pages** — full info for any movie or show: overview, genres, cast, crew, trailer, images, streaming providers, and social media links
- **Person pages** — bio, filmography (cast & crew credits), photo gallery, and social media links
- **Search** — find movies, TV shows, or people by name
- Infinite scroll / "Load More" pagination

## Tech Stack

- React 18 + React Router v6
- TMDB REST API
- CSS Modules

## Getting Started

### Prerequisites

- Node.js 16+
- A free [TMDB API key](https://www.themoviedb.org/settings/api)

### Install & run

```bash
npm install
npm start
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Other scripts

| Command | Description |
|---------|-------------|
| `npm test` | Run tests in watch mode |
| `npm run build` | Production build to `build/` |

## Project Structure

```
src/
  Components/
    Header/        # Navigation bar and router
    Pages/
      Catalogue/   # Movies, TV, and people listing pages
      Details/     # Show and person detail pages
      Home/        # Trending content home page
      Search/      # Search results page
      Profile/     # User profile page
  UI/              # Reusable UI components (Cards, Carousel, Slider, etc.)
  Helpers/
    tmdbHelper.js  # All TMDB API calls and data helpers
```
