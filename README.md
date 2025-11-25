# commander-pkg-meta

[![NPM Version](https://img.shields.io/npm/v/commander-pkg-meta.svg)](https://www.npmjs.com/package/commander-pkg-meta)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A lightweight and robust utility to extract and validate essential metadata from `package.json` properties.

## Description

This package provides a simple function, `getMetaData`, to reliably extract a package's name, version, and description. It intelligently determines the package name from either the `bin` or `name` field in your `package.json` and ensures the version is a valid semantic version. It provides sensible defaults and console warnings for invalid inputs, making it a dependable tool for CLI applications and build scripts.

## Key Features

- **Intelligent Name Resolution**: Automatically selects the best name from `package.json` `bin` or `name` fields. It prioritizes the `bin` field:
  - If `bin` is a string, its trimmed value is used.
  - If `bin` is an object, the trimmed value of its first key is used.
  - If `bin` is not available or usable, it falls back to the `name` field.
- **Semantic Version Validation**: Uses `semver` to validate and clean version strings.
- **Graceful Fallbacks**: Provides sensible default values for missing or invalid fields.
- **Developer Warnings**: Logs helpful warnings to the console when input data is invalid, preventing silent failures.
- **Zero Dependencies**: Aside from `semver`, this utility is lightweight and dependency-free.

## Installation

```bash
npm install commander-pkg-meta
```

## Usage

Simply import the `getMetaData` function and pass it an object containing properties from your `package.json`.

```javascript
const { getMetaData } = require('commander-pkg-meta');
const pkg = require('./package.json');

const metadata = getMetaData({
  name: pkg.name,
  bin: pkg.bin,
  version: pkg.version,
  description: pkg.description,
});

console.log(metadata);
// Example Output:
// {
//   name: 'my-cli-tool',
//   version: '1.2.3',
//   description: 'A cool command-line tool.'
// }
```

### Integration with Commander.js

```javascript
const { getMetaData } = require('commander-pkg-meta');
const { Command } = require('commander');

try {
  const pkg = require('./package.json');
  const metaData = getMetaData(pkg);

  // program's name, version, and description match those in package.json
  const program = new Command();
  program.name(metaData.name).version(metaData.version).description(metadata.description);

  // ...
} catch (error) {
  console.error(error);
}
```

## API Reference

### `getMetaData(props)`

Extracts and validates metadata from `package.json` properties.

**Parameters:**

- `props` (Object): An object containing properties, typically from a `package.json` file.
  - `props.name` (string, optional): The package name.
  - `props.bin` (string | object, optional): The `bin` field. The name is often derived from this for CLI tools.
  - `props.version` (string, optional): The package version string.
  - `props.description` (string, optional): The package description.

**Returns:**

- (Object): An object containing the extracted metadata with fallbacks applied.
  - `name` (string): The resolved package name.
  - `version` (string): The cleaned semantic version.
  - `description` (string): The package description.

## Contributing

Contributions are welcome! Please read our [contributing guidelines](CONTRIBUTING.md) to get started.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
