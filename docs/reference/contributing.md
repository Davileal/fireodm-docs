---
sidebar_position: 2
---

# Contributing

First, thanks for considering a contribution! Whether you’re filing a bug report, requesting a feature, or sending a pull request, your help is greatly appreciated.

## 1. Getting the Code

Clone the repository and install dependencies:

```bash
    git clone https://github.com/Davileal/fireodm.git
    cd fireodm
    npm install
```

## 2. Development Workflow

### Run the Firestore Emulator + Tests

FireODM uses the Firebase Emulator for integration tests. Simply run:

```bash
npm test
```

This will start the emulator and execute the Jest test suite.

### Run Docs Locally

To preview documentation in Docusaurus:

```bash
cd docs
npm install
npm start
```

Open http://localhost:3000 to view the docs site.

### Building the Library

To compile TypeScript into JavaScript and generate type definitions:

```bash
npm run build
```

Your output will be in the `dist/` directory.

### Linting & Formatting

We enforce code style with ESLint and Prettier. To check:

```bash
npm run lint
```

To automatically fix issues:

```bash
npm run lint:fix
npm run format
```

## 3. Submitting Changes

1. **Fork** the repo.  
2. Create a **feature branch**: `git checkout -b feat/my-new-feature`.  
3. **Commit** your changes with clear, descriptive messages.  
4. **Rebase** or **merge** the latest `main` to keep your branch up to date.  
5. **Push** to your fork and open a **Pull Request** in this repo.  
6. Fill out the PR template and describe the motivation and context.  

We’ll review your PR, suggest any changes, and merge once it’s ready.

## 4. Issues

Please search existing issues before opening a new one. For bug reports, provide:

- **Steps to reproduce**  
- **Expected vs. actual behavior**  
- **Code snippets** or **logs**  

Feature requests should include a clear use case and proposed API if possible.

## 5. Code of Conduct

This project follows the [Contributor Covenant](https://www.contributor-covenant.org/). Please be respectful and inclusive.


---

Thank you for helping make FireODM better! 🚀