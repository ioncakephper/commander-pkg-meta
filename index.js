const semver = require('semver');

const DEFAULT = {
  VERSION: '0.0.1',
  DESCRIPTION: '',
  NAME: 'unnamed-package',
};

/**
 * Extracts and validates the version for package metadata.
 * @param {string} version - The raw version string.
 * @returns {string|undefined} The cleaned version if valid, otherwise undefined.
 */
function _getMetaVersion(version) {
  if (typeof version !== 'string') {
    if (version !== undefined && version !== null) {
      console.warn(`Version input is not a string: '${typeof version}'.`);
    }
    return undefined;
  }

  const v = version.trim();
  if (!semver.valid(v)) {
    console.warn(`Invalid semantic version string provided: '${version}'.`);
    return undefined;
  }
  return semver.clean(v);
}

/**
 * Extracts and validates the description for package metadata.
 * @param {string} description - The raw description string.
 * @returns {string|undefined} The trimmed description if valid, otherwise undefined.
 */
function _getMetaDescription(description) {
  if (typeof description !== 'string') {
    if (description !== undefined && description !== null) {
      console.warn(`Description input is not a string: '${typeof description}'.`);
    }
    return undefined;
  }

  const d = description.trim();
  if (d.length === 0) {
    // Check for empty string after trimming
    return undefined;
  }
  return d;
}

/**
 * Extracts and validates the name for package metadata from 'bin' or 'name' fields.
 * @param {object} params
 * @param {string} params.name - The raw name string from package.json.
 * @param {string|object} params.bin - The raw bin field from package.json.
 * @returns {string|undefined} The trimmed name if valid, otherwise undefined.
 */
function _getMetaName({ name, bin }) {
  const getTrimmed = (str) => {
    if (typeof str !== 'string') {
      return undefined;
    }
    const trimmed = str.trim();
    if (trimmed.length === 0) {
      return undefined;
    }
    return trimmed;
  };

  let nameCandidate;
  if (typeof bin === 'string') {
    nameCandidate = getTrimmed(bin);
  } else if (typeof bin === 'object' && bin !== null && Object.keys(bin).length > 0) {
    nameCandidate = getTrimmed(Object.keys(bin)[0]);
  }

  if (nameCandidate) {
    return nameCandidate;
  }

  nameCandidate = getTrimmed(name);
  if (nameCandidate) {
    return nameCandidate;
  }

  // Warn only if there was some input to begin with
  if ((name !== undefined && name !== null) || (bin !== undefined && bin !== null)) {
    console.warn(
      `Could not determine a valid package name from name: '${name}' or bin: '${JSON.stringify(bin)}'.`
    );
  }

  return undefined;
}

/**
 * Extracts and validates metadata from package.json properties.
 * @param {object} props - Properties from package.json.
 * @param {string} [props.name] - The package name.
 * @param {string|object} [props.bin] - The bin field.
 * @param {string} [props.version] - The package version.
 * @param {string} [props.description] - The package description.
 * @returns {{name: string, version: string, description: string}} The extracted metadata with fallbacks.
 */
function getMetaData({ name, bin, version, description }) {
  return {
    name: _getMetaName({ name, bin }) ?? DEFAULT.NAME,
    version: _getMetaVersion(version) ?? DEFAULT.VERSION,
    description: _getMetaDescription(description) ?? DEFAULT.DESCRIPTION,
  };
}

module.exports = {
  getMetaData,
};
