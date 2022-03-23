module.exports = {
  verbose: true,
  moduleFileExtensions: [
    'js',
    'jsx',
    'json'
  ],
  transform: {
    '^.+\\.(js|jsx)?$': 'babel-jest'
  },
  transformIgnorePatterns: [
    '/node_modules/'
  ],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/lib/$1'
  },
  testMatch: [
    '**/tests/**/*.test.(js|jsx|ts|tsx)|**/__tests__/*.(js|jsx|ts|tsx)'
  ]
}