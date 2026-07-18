# ScrapThatPage

A desktop app that automates web scraper with easy to use script actions.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development purposes.

### Requirements

To install and run this project you need:

- [Node.js](https://nodejs.org/ "Node.js")
- [yarn](https://classic.yarnpkg.com/lang/en/docs/install/ "yarn") 
- [git](https://git-scm.com/downloads "git") (only to clone this repository)

### Installation

To set up everything in your local machine, you need to follow these steps:

1. Clone this repo and then change directory to the `myapp-scrapthatpage` folder:

```bash
git clone https://github.com/kaushalmeena/myapp-scrapthatpage.git
cd myapp-scrapthatpage
```

2. Install project dependencies using yarn:

```bash
yarn install
```

### Running

To run the project simply run:

```bash
yarn run start
```

## Screenshots

<img src="./screenshots/Home.png"> 
<img src="./screenshots/Create.png">
<img src="./screenshots/Favorites.png">
<img src="./screenshots/Search.png">
<img src="./screenshots/Settings.png">
<img src="./screenshots/UpdateInformation.png">
<img src="./screenshots/UpdateOperations.png">
<img src="./screenshots/Execute.png">
<img src="./screenshots/Delete.png">

## Development notes

Two dev dependencies are intentionally held one major version behind the latest
release because the linting ecosystem has not yet caught up:

- **TypeScript is pinned to `5.9.x`** (not 7.x). `typescript-eslint` does not yet
  support the TypeScript 7 native compiler (it caps at `<6.1.0`), so ESLint
  crashes when parsing under TS 7. The app itself builds and runs fine on TS 7 —
  only the linter is the blocker.
- **ESLint is pinned to `9.x`** (not 10.x). `eslint-plugin-react` still calls
  `context.getFilename()`, which ESLint 10 removed.

Bump both once `typescript-eslint` ships TypeScript 7 support and
`eslint-plugin-react` supports ESLint 10.

Useful scripts: `yarn typecheck` (type-only check) and `yarn lint`.

## Built With

- [Electron](https://www.electronjs.org/)
- [React](https://reactjs.org/)
- [Material UI](https://mui.com/)

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
