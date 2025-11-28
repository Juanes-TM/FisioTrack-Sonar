const { createChromeDriver, By, Key, until } = require('../setup-chrome');
const assert = require('assert');

jest.setTimeout(60000);

describe('VerPerfilCliente', function() {
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
  it('VerPerfilCliente', async function() {
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
    
    await driver.wait(until.elementLocated(By.linkText("Ver mi perfil")), 10000);
    await driver.findElement(By.linkText("Ver mi perfil")).click()
    
    await driver.wait(until.elementLocated(By.css(".mt-6:nth-child(7)")), 10000);
    await driver.findElement(By.css(".mt-6:nth-child(7)")).click()
    
    await driver.findElement(By.css(".text-gray-600")).click()
    
    await driver.findElement(By.css(".mt-6:nth-child(8)")).click()
    await driver.findElement(By.css(".mt-6:nth-child(8)")).click()
    
    // Actions mejoradas para mayor estabilidad
    try {
      const element = await driver.findElement(By.css(".flex-1:nth-child(3)"))
      await driver.actions({ bridge: true })
        .move({ origin: element })
        .pause(1000)
        .perform();
      
      await driver.findElement(By.css(".flex-1:nth-child(3)")).click()
    } catch (error) {
      console.log('Actions might have failed, continuing...');
      await driver.findElement(By.css(".flex-1:nth-child(3)")).click()
    }
  })
})