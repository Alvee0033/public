# Public Website (LMS)

This is a Next.js application for an Education Learning Management System (LMS).

## Project Structure

The project follows a modular architecture designed for scalability and maintainability.

### Key Directories

- `app`: contains the Next.js App Router routes and page layouts.
- `actions`: contains business logic, server actions, and state management organized by module.
  - `actions/[module-name]/`:
    - `actions.ts`: Server actions for fetching or mutating data on the server.
    - `hooks.ts`: Custom React hooks for interacting with the module (API calling, state access).
    - `store.ts`: Zustand store for client-side state management of the module.
    - `schema.ts`: Zod schemas and TypeScript types/interfaces for the module.
- `components`: UI components organized by scope.
  - `components/common/`: Global, reusable UI components (Buttons, Inputs, Modals).
  - `components/modules/[module-name]/`: Components specific to a particular module.
- `lib`: Utility functions, constants, and shared configurations (e.g., axios instance).
- `hooks`: Shared custom React hooks that are not module-specific.
- `types`: Global TypeScript definitions.

### Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) (Latest version, App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **State Management**: [Zustand](https://github.com/pmndrs/zustand)
- **Forms**: [React Hook Form](https://react-hook-form.com/)
- **Validation**: [Zod](https://zod.dev/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Icons**: [Lucide React](https://lucide.dev/)

### Guidelines

1. **Keep files small**: Aim for less than 300 lines per file by extracting sub-components and logic.
2. **Server Actions**: Prefer server actions for data mutations and initial data fetching where appropriate.
3. **Modular Components**: Keep module-specific components inside `components/modules/[module-name]/`.
4. **Type Safety**: Use TypeScript and Zod for end-to-end type safety.

## Git Hook (pre-push)

This repository includes a git `pre-push` hook (in `.git/hooks/pre-push`) that will run a production build of the `public_web` app before allowing a push. The hook runs:

```bash
npm --prefix web/public_web run build
```

If the build fails, the push will be aborted. This ensures CI-like safety locally and prevents pushes that would break production builds.

If you want to opt out temporarily, run `git push --no-verify` (not recommended).

## Troubleshooting

- **Missing `tw-animate-css` in dev**: If you see an error like `Can't resolve 'tw-animate-css'` during development or a Turbopack build, run:

```bash
cd web/public_web
npm install
npm run build
```

- **If the bundler still fails to resolve the package**: a safe workaround is to copy the package CSS locally and import it from `app/`. From the project root:

```bash
cp web/public_web/node_modules/tw-animate-css/dist/tw-animate.css web/public_web/app/tw-animate.css
# then in app/globals.css use:
@import "./tw-animate.css";
```

This avoids edge cases where the bundler does not honor the package `exports` style condition for CSS files.
