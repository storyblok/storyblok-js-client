const presets = [
  [
    "@babel/env",
    {
      targets: {
        ie: "11",
        edge: "17",
        firefox: "60",
        chrome: "67",
        safari: "11.1"
      },
      useBuiltIns: "entry",
      corejs: 3
    }
  ]
];

const plugins = [
  [
    "@babel/plugin-transform-runtime",
    {
      "absoluteRuntime": false,
      "corejs": 3,
      "helpers": true,
      "regenerator": true,
      "useESModules": false
    }
  ],
];

module.exports = { presets, plugins }