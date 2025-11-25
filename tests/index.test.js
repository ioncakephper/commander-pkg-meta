const semver = require('semver');
const { getMetaData, _getMetaVersion, _getMetaDescription, _getMetaName } = require('..');

describe('getMetaData', () => {
  let warnSpy;

  beforeEach(() => {
    warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
  });

  afterEach(() => {
    warnSpy.mockRestore();
  });

  test('returns defaults when no fields provided', () => {
    const result = getMetaData({});
    expect(result).toEqual({ name: 'unnamed-package', version: '0.0.1', description: '' });
    expect(warnSpy).not.toHaveBeenCalled();
  });

  test('prefers bin string over name for name extraction', () => {
    const result = getMetaData({ name: 'pkg', bin: ' my-cli ' });
    expect(result.name).toBe('my-cli');
  });

  test('uses first key from bin object when available', () => {
    const result = getMetaData({ name: 'pkg', bin: { ' tool ': 'index.js', other: 'x.js' } });
    expect(result.name).toBe('tool');
  });

  test('falls back to name when bin is not usable', () => {
    const result = getMetaData({ name: '  my-name  ', bin: '' });
    expect(result.name).toBe('my-name');
  });

  test('warns when invalid name/bin provided but cannot derive name', () => {
    const result = getMetaData({ name: '   ', bin: {} });
    expect(result.name).toBe('unnamed-package');
    expect(warnSpy).toHaveBeenCalledTimes(1);
    expect(warnSpy.mock.calls[0][0]).toMatch(/Could not determine a valid package name/);
  });

  test('accepts valid semver version and cleans it', () => {
    const result = getMetaData({ version: ' v1.2.3 ' });
    expect(result.version).toBe(semver.clean('1.2.3'));
  });

  test('uses default version and warns when invalid semver provided', () => {
    const result = getMetaData({ version: 'not-a-version' });
    expect(result.version).toBe('0.0.1');
    expect(warnSpy).toHaveBeenCalled();
    expect(warnSpy.mock.calls[0][0]).toMatch(/Invalid semantic version/);
  });

  test('uses default version and warns when version is non-string', () => {
    const result = getMetaData({ version: 123 });
    expect(result.version).toBe('0.0.1');
    expect(warnSpy).toHaveBeenCalled();
    expect(warnSpy.mock.calls[0][0]).toMatch(/Version input is not a string/);
  });

  test('trims non-empty description and accepts empty string as default', () => {
    const result = getMetaData({ description: '  nice tool  ' });
    expect(result.description).toBe('nice tool');
  });

  test('uses default description and warns when non-string provided', () => {
    const result = getMetaData({ description: { x: 1 } });
    expect(result.description).toBe('');
    expect(warnSpy).toHaveBeenCalled();
    expect(warnSpy.mock.calls[0][0]).toMatch(/Description input is not a string/);
  });

  test('does not warn for undefined/null inputs where defaults apply', () => {
    getMetaData({ version: undefined, description: undefined, name: undefined, bin: undefined });
    // Only warnings should occur when invalid values are provided, not when missing
    expect(warnSpy).not.toHaveBeenCalled();
  });
});

describe('_getMetaVersion', () => {
  let warnSpy;

  beforeEach(() => {
    warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
  });

  afterEach(() => {
    warnSpy.mockRestore();
  });

  test('returns cleaned version for valid semver string', () => {
    expect(_getMetaVersion('  v1.2.3  ')).toBe('1.2.3');
    expect(warnSpy).not.toHaveBeenCalled();
  });

  test('returns undefined and warns for invalid semver string', () => {
    expect(_getMetaVersion('not-a-version')).toBeUndefined();
    expect(warnSpy).toHaveBeenCalledTimes(1);
    expect(warnSpy.mock.calls[0][0]).toMatch(/Invalid semantic version string provided: 'not-a-version'/);
  });

  test('returns undefined and warns for non-string input', () => {
    expect(_getMetaVersion(123)).toBeUndefined();
    expect(warnSpy).toHaveBeenCalledTimes(1);
    expect(warnSpy.mock.calls[0][0]).toMatch(/Version input is not a string: 'number'/);
  });

  test('returns undefined and does not warn for undefined input', () => {
    expect(_getMetaVersion(undefined)).toBeUndefined();
    expect(warnSpy).not.toHaveBeenCalled();
  });

  test('returns undefined and does not warn for null input', () => {
    expect(_getMetaVersion(null)).toBeUndefined();
    expect(warnSpy).not.toHaveBeenCalled();
  });
});

describe('_getMetaDescription', () => {
  let warnSpy;

  beforeEach(() => {
    warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
  });

  afterEach(() => {
    warnSpy.mockRestore();
  });

  test('returns trimmed description for valid string', () => {
    expect(_getMetaDescription('  A test description  ')).toBe('A test description');
    expect(warnSpy).not.toHaveBeenCalled();
  });

  test('returns undefined for empty string', () => {
    expect(_getMetaDescription('   ')).toBeUndefined();
    expect(warnSpy).not.toHaveBeenCalled();
  });

  test('returns undefined and warns for non-string input', () => {
    expect(_getMetaDescription(123)).toBeUndefined();
    expect(warnSpy).toHaveBeenCalledTimes(1);
    expect(warnSpy.mock.calls[0][0]).toMatch(/Description input is not a string: 'number'/);
  });

  test('returns undefined and does not warn for undefined input', () => {
    expect(_getMetaDescription(undefined)).toBeUndefined();
    expect(warnSpy).not.toHaveBeenCalled();
  });

  test('returns undefined and does not warn for null input', () => {
    expect(_getMetaDescription(null)).toBeUndefined();
    expect(warnSpy).not.toHaveBeenCalled();
  });
});

describe('_getMetaName', () => {
  let warnSpy;

  beforeEach(() => {
    warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
  });

  afterEach(() => {
    warnSpy.mockRestore();
  });

  test('prefers bin string over name', () => {
    expect(_getMetaName({ name: 'pkg-name', bin: ' cli-tool ' })).toBe('cli-tool');
    expect(warnSpy).not.toHaveBeenCalled();
  });

  test('uses first key from bin object when available', () => {
    expect(_getMetaName({ name: 'pkg-name', bin: { ' main-tool ': 'index.js', 'secondary-tool': 'other.js' } })).toBe('main-tool');
    expect(warnSpy).not.toHaveBeenCalled();
  });

  test('falls back to name when bin is empty string', () => {
    expect(_getMetaName({ name: '  my-package  ', bin: '   ' })).toBe('my-package');
    expect(warnSpy).not.toHaveBeenCalled();
  });

  test('falls back to name when bin is empty object', () => {
    expect(_getMetaName({ name: '  my-package  ', bin: {} })).toBe('my-package');
    expect(warnSpy).not.toHaveBeenCalled();
  });

  test('returns undefined and warns when both name and bin are invalid/empty', () => {
    expect(_getMetaName({ name: ' ', bin: {} })).toBeUndefined();
    expect(warnSpy).toHaveBeenCalledTimes(1);
    expect(warnSpy.mock.calls[0][0]).toMatch(/Could not determine a valid package name/);
  });

  test('returns undefined and warns when both name and bin are invalid/empty strings', () => {
    expect(_getMetaName({ name: ' ', bin: '  ' })).toBeUndefined();
    expect(warnSpy).toHaveBeenCalledTimes(1);
    expect(warnSpy.mock.calls[0][0]).toMatch(/Could not determine a valid package name/);
  });

  test('returns undefined and does not warn when name and bin are undefined', () => {
    expect(_getMetaName({ name: undefined, bin: undefined })).toBeUndefined();
    expect(warnSpy).not.toHaveBeenCalled();
  });

  test('returns undefined and does not warn when name and bin are null', () => {
    expect(_getMetaName({ name: null, bin: null })).toBeUndefined();
    expect(warnSpy).not.toHaveBeenCalled();
  });
});
