# Changelog

## 1.0.0 (2025-11-25)


### ⚠ BREAKING CHANGES

* **meta:** The functions _getMetaVersion, _getMetaDescription, and _getMetaName are no longer exported from the package. If your application directly imported and used these functions, it will now fail. Consumers should only rely on the getMetaData function for extracting package metadata.

### Bug Fixes

* **meta:** Consolidate public API by unexporting internal helpers ([be9e345](https://github.com/ioncakephper/commander-pkg-meta/commit/be9e3459fd99b40d9c022cf5b1c78075974df67d))
