# Change Log

All notable changes to this project will be documented in this file.

## [6.0.0] - 2023-08-15

### Changed

- Error handling changed to expose the error object instead of the error message as a string.

## [5.4.0] - 2023-02-02

### Added

- [Storyblok-JS-client](https://github.com/storyblok/storyblok-js-client/releases/tag/v5.4.0)
- Custom cache provider

## [5.3.4] - 2023-01-24

### Fixed

- [Storyblok-JS-client](https://github.com/storyblok/storyblok-js-client/releases/tag/v5.3.4)
- Error handling is return the correct reject/resolve to the client

## [5.2.1] - 2022-12-20

### Fixed

- [Storyblok-JS-client](https://github.com/storyblok/storyblok-js-client/releases/tag/v5.2.1)
- Added content type header to fix a bug from the api calls.

## [5.2.0] - 2022-12-19

### Added

- [Storyblok-JS-client](https://github.com/storyblok/storyblok-js-client/releases/tag/v5.2.0)
- Added optional fetch function to constructor

## [5.1.0] - 2022-11-24

### Changed

- Update browsers compatibility
- Remove isomorphic fetch from dependencies
- Added a simple playground for manual testing
- Build setup improvements
- Added svelte + ts and Nuxt 3 playgrounds

## [5.0.4] - 2022-10-28

### Fixed

- Ci: run prettier in CI
- Merge conflicting ESLint + Prettier configuration

## [5.0.3] - 2022-10-26

### Fixed

- Remove & ignore stray .DS_Store file

## [5.0.2] - 2022-10-21

### Fixed

- Added the correct function return to get, getAll, set and flush functions

## [5.0.1] - 2022-10-21

### Added

- Added dimensions related features to ISbStoriesParams interface.

## [5.0.0] - 2022-10-17 - BREAKING CHANGE

### Added

- [Storyblok-JS-client](https://github.com/storyblok/storyblok-js-client/compare/v4.5.6...v5.0.0)
- BREAKING CHANGE
- Added Typescript to codebase

### Changed

- BREAKING CHANGE
- Removed Axios as dependency
- All JS codebase was refactored to Typescript

### Fixed

- Fixing application to match unit tests
