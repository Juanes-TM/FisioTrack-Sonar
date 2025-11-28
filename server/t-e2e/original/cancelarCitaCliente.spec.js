const { createChromeDriver, By, Key, until } = require('../setup-chrome');
const assert = require('assert');

jest.setTimeout(60000);

describe('CancelarCitaCliente', function() {
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
  it('CancelarCitaCliente', async function() {
    const baseUrl = process.env.CI ? 'http://localhost:3000' : 'https://10.6.131.134';
    await driver.get(baseUrl)
    await driver.manage().window().setRect({ width: 1854, height: 1048 })
    
    await driver.wait(until.elementLocated(By.css(".w-full:nth-child(1)")), 10000);
    await driver.findElement(By.css(".w-full:nth-child(1)")).click()
    await driver.findElement(By.css(".w-full:nth-child(1)")).sendKeys("nano@ull.es")
    
    await driver.wait(until.elementLocated(By.css(".w-full:nth-child(2)")), 5000);
    await driver.findElement(By.css(".w-full:nth-child(2)")).click()
    await driver.findElement(By.css(".w-full:nth-child(2)")).sendKeys("123456")
    await driver.findElement(By.css(".w-full:nth-child(2)")).sendKeys(Key.ENTER)
    
    await driver.wait(until.urlContains('/dashboard'), 15000);
    
    await driver.wait(until.elementLocated(By.linkText("Reservar cita")), 10000);
    await driver.findElement(By.linkText("Reservar cita")).click()
    
    await driver.wait(until.elementLocated(By.css(".border-gray-300")), 10000);
    await driver.findElement(By.css(".border-gray-300")).click()
    {
      const dropdown = await driver.findElement(By.css(".border-gray-300"))
      await dropdown.findElement(By.xpath("//option[. = 'fisio1 uno']")).click()
    }
    await driver.findElement(By.css("option:nth-child(2)")).click()
    await driver.findElement(By.css(".hover\\3A bg-teal-600")).click()
    
    await driver.wait(until.elementLocated(By.css(".text-indigo-700")), 10000);
    await driver.findElement(By.css(".text-indigo-700")).click()
    
    await driver.wait(until.elementLocated(By.css(".bg-red-50")), 10000);
    await driver.findElement(By.css(".bg-red-50")).click()
    
    await driver.wait(until.elementLocated(By.css(".inline-flex:nth-child(1)")), 5000);
    await driver.findElement(By.css(".inline-flex:nth-child(1)")).click()
    
    await driver.wait(until.elementLocated(By.css(".bg-red-600")), 5000);
    await driver.findElement(By.css(".bg-red-600")).click()
  })
})