module.exports = {
  "rules": {
    "react-native/no-unused-styles": 2,
    "react-native/split-platform-components": 0,
    "react-native/no-inline-styles": 0,
    "react-native/no-color-literals": 0,
    "react/jsx-filename-extension": [1, { "extensions": [".js", ".jsx"] }],
    "react/jsx-uses-react": "error",
    "react/jsx-uses-vars": "error",
    "react/no-unescaped-entities": "off",
    "import/no-unresolved": [2, { ignore: ['\.webp$', 'apollo-cache-inmemory', 'react-native-system-notification', 'md5', 'Toast$', 'RichText$', 'weixin$', 'GoogleAnalytics$', 'JijiaPush$', 'ZoomImage$', 'DatePicker$', 'Audio$', 'Recorder$', 'Swiper$', 'SegmentedControl$', 'react-native-audio-android', 'SwipeableListView', 'SwipeableQuickActions', 'react-native-webview-android', 'react-native-tuofeng-share', 'rn-camera-roll']}],
    'import/extensions': ['off', 'never'],
    "no-underscore-dangle": ['error', {allowAfterThis: true}],
    "max-len": [1, 300],
    'global-require': 'off',
    'no-underscore-dangle': 'off',
    "no-console": ['off'],
    "no-return-assign": ['off'],
    "react/no-multi-comp": ['off'],
    "no-control-regex": ["off"],
    "no-unused-vars": ["error", { args: 'after-used', argsIgnorePattern: '^_' }],
    "indent": [
      2,
      2
    ],
    "quotes": [
      2,
      "single"
    ],
    "linebreak-style": [
      2,
      "unix"
    ],
    "semi": [
      2,
      "never"
    ],
    "object-curly-newline": ["off"],
  },
  "env": {
    "es6": true,
    "node": true,
    "jest": true,
    "react-native/react-native": true,
  },
  "parser": "babel-eslint",
  "extends": ["eslint:recommended", "plugin:react/recommended", "airbnb"],
  "parserOptions": {
    "ecmaFeatures": {
      "modules": true,
      "jsx": true,
      "experimentalObjectRestSpread": true,
      impliedStrict: true,
    }
  },
  "plugins": [
    "react",
    "react-native"
  ]
};
