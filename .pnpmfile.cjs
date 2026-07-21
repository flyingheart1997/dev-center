function readPackage(pkg) {
  if (pkg.dependencies && pkg.dependencies["uuid"]) {
    pkg.dependencies["uuid"] = "^11.1.0"
  }
  return pkg
}

module.exports = {
  hooks: {
    readPackage,
  },
}
