const { createChromeDriver, By, Key, until } = require('../setup-chrome');
const assert = require('assert');

jest.setTimeout(60000);

describe('VerPanelInformacionFisio', function() {
  let driver
  let vars
  beforeEach(async function() {
    driver = await createChromeDriver()
    vars = {}
  })
  afterEach(async function() {
    if (driver) { 
      try {
        await driver.quit(); 
      } catch (error) {
        console.log('Error quitting driver:', error);
      }
    }
  })
  it('VerPanelInformacionFisio', async function() {
    const baseUrl = process.env.CI ? 'http://localhost:3000' : 'https://10.6.131.134';
    await driver.get(baseUrl)
    await driver.manage().window().setRect({ width: 979, height: 1063 })
    
    await driver.wait(until.elementLocated(By.css(".w-full:nth-child(1)")), 10000);
    await driver.findElement(By.css(".w-full:nth-child(1)")).click()
    await driver.findElement(By.css(".w-full:nth-child(1)")).sendKeys("fisio1@ull.es")
    
    await driver.wait(until.elementLocated(By.css(".w-full:nth-child(2)")), 5000);
    await driver.findElement(By.css(".w-full:nth-child(2)")).click()
    await driver.findElement(By.css(".w-full:nth-child(2)")).sendKeys("123456")
    
    await driver.wait(until.elementLocated(By.css(".bg-teal-600")), 5000);
    await driver.findElement(By.css(".bg-teal-600")).click()
    
    await driver.wait(until.urlContains('/dashboard'), 15000);
    
    await driver.wait(until.elementLocated(By.linkText("Panel de Información")), 10000);
    await driver.findElement(By.linkText("Panel de Información")).click()
    
    await driver.wait(until.elementLocated(By.css(".bg-white:nth-child(1) .flex > .text-sm")), 10000);
    await driver.findElement(By.css(".bg-white:nth-child(1) .flex > .text-sm")).click()
    await driver.findElement(By.css(".bg-white:nth-child(1) .flex > .text-sm")).click()
    
    await driver.findElement(By.css(".bg-white:nth-child(2) .flex > .text-sm")).click()
    await driver.findElement(By.css(".bg-white:nth-child(2) .flex > .text-sm")).click()
    
    await driver.findElement(By.css(".bg-white:nth-child(4) .flex > .text-sm")).click()
    await driver.findElement(By.css(".bg-white:nth-child(4) .flex > .text-sm")).click()
    
    await driver.findElement(By.css(".p-2:nth-child(1) .font-bold")).click()
    await driver.findElement(By.css(".py-1:nth-child(2)")).click()
    await driver.findElement(By.css(".rounded-md:nth-child(1)")).click()
    await driver.findElement(By.css(".w-full")).click()
  })
})