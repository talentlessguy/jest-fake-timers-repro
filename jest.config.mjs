export default {
  testEnvironment: 'node',
  preset: 'ts-jest/presets/default-esm',
  globals: {
    'ts-jest': {
      useESM: true
    }
  },
  transform: {
    '^.+\\.(t|j)sx?$': 'ts-jest'
  },
  testRegex: '^.+\\.(t|j)sx?$',
  moduleFileExtensions: ['ts', 'js', 'json']
}
