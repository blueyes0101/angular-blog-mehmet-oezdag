// Karma configuration file, see link for more information
// https://karma-runner.github.io/1.0/config/configuration-file.html

module.exports = function (config) {
  // Detect Chrome binary for different environments
  const fs = require('fs');
  const chromeBinaryPaths = [
    '/usr/bin/google-chrome',
    '/usr/bin/google-chrome-stable',
    '/usr/bin/chromium',
    '/usr/bin/chromium-browser',
    '/snap/bin/chromium',
  ];

  // Set Chrome binary path for CI environments if not already set
  if (!process.env.CHROME_BIN) {
    for (const path of chromeBinaryPaths) {
      if (fs.existsSync(path)) {
        process.env.CHROME_BIN = path;
        console.log(`Karma: Using Chrome binary: ${path}`);
        break;
      }
    }

    // Fallback for GitHub Actions and other CI environments
    if (!process.env.CHROME_BIN) {
      process.env.CHROME_BIN = 'google-chrome';
      console.log('Karma: Using default google-chrome binary');
    }
  } else {
    console.log(`Karma: Using preset Chrome binary: ${process.env.CHROME_BIN}`);
  }

  config.set({
    basePath: '',
    frameworks: ['jasmine', '@angular-devkit/build-angular'],
    plugins: [
      require('karma-jasmine'),
      require('karma-chrome-launcher'),
      require('karma-jasmine-html-reporter'),
      require('karma-coverage'),
      require('@angular-devkit/build-angular/plugins/karma'),
    ],
    client: {
      jasmine: {
        // you can add configuration options for Jasmine here
        // the possible options are listed at https://jasmine.github.io/api/edge/Configuration.html
        // for example, you can disable the random execution with `random: false`
        // or set a specific seed with `seed: 4321`
      },
      clearContext: false, // leave Jasmine Spec Runner output visible in browser
    },
    jasmineHtmlReporter: {
      suppressAll: true, // removes the duplicated traces
    },
    coverageReporter: {
      dir: require('path').join(__dirname, './coverage/angu-blog-mehmet-oezdag'),
      subdir: '.',
      reporters: [{ type: 'html' }, { type: 'text-summary' }],
    },
    reporters: ['progress', 'kjhtml'],
    browsers: ['Chrome'],
    customLaunchers: {
      ChromeHeadlessCI: {
        base: 'ChromeHeadless',
        flags: [
          '--no-sandbox',
          '--disable-gpu',
          '--disable-web-security',
          '--disable-features=VizDisplayCompositor',
          '--disable-dev-shm-usage',
          '--disable-background-timer-throttling',
          '--disable-backgrounding-occluded-windows',
          '--disable-renderer-backgrounding',
          '--headless',
        ],
      },
    },
    restartOnFileChange: true,
    // Ensure browser process doesn't hang in CI
    browserDisconnectTimeout: 10000,
    browserDisconnectTolerance: 3,
    browserNoActivityTimeout: 60000,
    captureTimeout: 60000,
    singleRun: false,
  });
};
