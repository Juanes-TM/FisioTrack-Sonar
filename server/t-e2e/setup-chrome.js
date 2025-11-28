const { Builder, By, Key, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');

// Configuración optimizada para Chrome en CI
function createChromeDriver() {
  const options = new chrome.Options();
  
  // Configuración para GitHub Actions
  options.addArguments(
    '--headless=new',
    '--no-sandbox',
    '--disable-dev-shm-usage',
    '--disable-gpu',
    '--window-size=1920,1080',
    '--disable-extensions',
    '--disable-plugins'
  );

  return new Builder()
    .forBrowser('chrome')
    .setChromeOptions(options)
    .build();
}

module.exports = { createChromeDriver, By, Key, until };