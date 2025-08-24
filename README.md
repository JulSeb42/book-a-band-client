# Book a Band Client

This is the frontend client for the Book a Band project.

## Tech Stack
- React (with TypeScript)
- Vite
- Tailwind CSS
- Socket.io-client
- pnpm

## Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- [pnpm](https://pnpm.io/)

### Installation

1. Clone the repository:
   ```sh
   git clone <repo-url>
   cd book-a-band-client
   ```
2. Install dependencies:
   ```sh
   pnpm install
   ```
3. Copy the environment template and configure it:
   ```sh
   cp template.env .env
   # Edit .env as needed
   ```

### Running the Development Server

```sh
pnpm dev
```

The app will be available at [http://localhost:5173](http://localhost:5173) by default.

### Building for Production

```sh
pnpm build
```

### Preview Production Build

```sh
pnpm preview
```

## Project Structure

- `src/` — Main source code (components, pages, routes, context, types, utils, etc.)
- `public/` — Static assets
- `plop/` — Code generators (for components, pages, etc.)
- `tailwind.config.js` — Tailwind CSS configuration
- `vite.config.ts` — Vite configuration

## Code Generation

This project uses [Plop](https://plopjs.com/) for scaffolding components, pages, and more. See the `plop/` directory for available generators.

## Linting & Formatting

- ESLint is configured for code linting.
- Run `pnpm lint` to check for lint errors.

## License

MIT

## Author

[Julien Sebag](https://julien-sebag.com)