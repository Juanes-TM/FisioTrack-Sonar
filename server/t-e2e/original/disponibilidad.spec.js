const { createChromeDriver, By, Key, until } = require('../setup-chrome');
const assert = require('assert');

jest.setTimeout(60000);

describe('disponibilidad', function() {
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
  it('disponibilidad', async function() {
    const baseUrl = process.env.CI ? 'http://localhost:3000' : 'https://10.6.131.134';
    await driver.get(baseUrl)
    await driver.manage().window().setRect({ width: 1854, height: 1048 })
    
    await driver.wait(until.elementLocated(By.css(".w-full:nth-child(1)")), 10000);
    await driver.findElement(By.css(".w-full:nth-child(1)")).click()
    await driver.findElement(By.css(".w-full:nth-child(1)")).sendKeys("fisio1@ull.es")
    
    await driver.wait(until.elementLocated(By.css(".w-full:nth-child(2)")), 5000);
    await driver.findElement(By.css(".w-full:nth-child(2)")).click()
    await driver.findElement(By.css(".w-full:nth-child(2)")).sendKeys("123456")
    
    await driver.wait(until.elementLocated(By.css(".bg-teal-600")), 5000);
    await driver.findElement(By.css(".bg-teal-600")).click()
    
    await driver.wait(until.urlContains('/dashboard'), 15000);
    
    await driver.wait(until.elementLocated(By.linkText("Disponibilidad")), 10000);
    await driver.findElement(By.linkText("Disponibilidad")).click()
    
    await driver.wait(until.elementLocated(By.css(".border:nth-child(1) .text-sm")), 10000);
    await driver.findElement(By.css(".border:nth-child(1) .text-sm")).click()
    
    await driver.wait(until.elementLocated(By.css(".ml-auto")), 5000);
    await driver.findElement(By.css(".ml-auto")).click()
    
    await driver.findElement(By.css(".border:nth-child(1) .text-sm")).click()
    
    await driver.wait(until.elementLocated(By.css(".px-4")), 5000);
    await driver.findElement(By.css(".px-4")).click()
    await driver.findElement(By.css(".px-4")).click()
    await driver.findElement(By.css(".px-4")).click()
    
    await driver.findElement(By.css(".w-full")).click()
  })
})