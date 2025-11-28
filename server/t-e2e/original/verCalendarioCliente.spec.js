const { createChromeDriver, By, Key, until } = require('../setup-chrome');
const assert = require('assert');

jest.setTimeout(60000);

describe('VerCalendarioCliente', function() {
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
  it('VerCalendarioCliente', async function() {
    const baseUrl = process.env.CI ? 'http://localhost:3000' : 'https://10.6.131.134';
    await driver.get(baseUrl)
    await driver.manage().window().setRect({ width: 1854, height: 1048 })
    
    await driver.wait(until.elementLocated(By.css(".w-full:nth-child(1)")), 10000);
    await driver.findElement(By.css(".w-full:nth-child(1)")).click()
    await driver.findElement(By.css(".w-full:nth-child(1)")).sendKeys("nano@ull.es")
    
    await driver.wait(until.elementLocated(By.css(".w-full:nth-child(2)")), 5000);
    await driver.findElement(By.css(".w-full:nth-child(2)")).click()
    await driver.findElement(By.css(".w-full:nth-child(2)")).sendKeys("123456")
    
    await driver.wait(until.elementLocated(By.css(".bg-teal-600")), 5000);
    await driver.findElement(By.css(".bg-teal-600")).click()
    
    await driver.wait(until.urlContains('/dashboard'), 15000);
    
    await driver.findElement(By.css(".space-y-6")).click()
    await driver.findElement(By.css(".flex:nth-child(3) > span")).click()
    
    await driver.wait(until.elementLocated(By.css(".h-\\[120px\\]:nth-child(26) .text-left:nth-child(1)")), 10000);
    await driver.findElement(By.css(".h-\\[120px\\]:nth-child(26) .text-left:nth-child(1)")).click()
    
    await driver.findElement(By.css(".border-gray-300")).click()
    
    await driver.wait(until.elementLocated(By.css(".h-\\[120px\\]:nth-child(24) .text-left")), 5000);
    await driver.findElement(By.css(".h-\\[120px\\]:nth-child(24) .text-left")).click()
    
    await driver.findElement(By.css(".border-gray-300")).click()
    
    await driver.wait(until.elementLocated(By.css(".h-\\[120px\\]:nth-child(33) > .text-xs")), 5000);
    await driver.findElement(By.css(".h-\\[120px\\]:nth-child(33) > .text-xs")).click()
    
    await driver.wait(until.elementLocated(By.css(".space-y-1:nth-child(2) > .w-full")), 5000);
    await driver.findElement(By.css(".space-y-1:nth-child(2) > .w-full")).click()
    
    await driver.findElement(By.css(".border-gray-300")).click()
    
    await driver.findElement(By.css(".p-2:nth-child(3)")).click()
    
    await driver.wait(until.elementLocated(By.css(".h-\\[120px\\]:nth-child(4) .text-left")), 5000);
    await driver.findElement(By.css(".h-\\[120px\\]:nth-child(4) .text-left")).click()
    
    await driver.findElement(By.css(".border-gray-300")).click()
  })
})