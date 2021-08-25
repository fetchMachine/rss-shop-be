const { pathsToModuleNameMapper } = require("ts-jest/utils");
const { compilerOptions } = require('./tsconfig.paths.json')

module.exports = {
  preset: 'ts-jest',
  moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, { prefix: '<rootDir>/' } ),
};
