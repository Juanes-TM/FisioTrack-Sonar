const { createChromeDriver, By, Key, until } = require('../setup-chrome');
const assert = require('assert');

jest.setTimeout(60000);

describe('VerPerfilFisio', function() {
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
  it('VerPerfilFisio', async function() {
    const baseUrl = process.env.CI ? 'http://localhost:3000' : 'https://10.6.131.134';
    await driver.get(baseUrl)
    await driver.manage().window().setRect({ width: 1070, height: 1063 })
    
    await driver.wait(until.elementLocated(By.css(".w-full:nth-child(1)")), 10000);
    await driver.findElement(By.css(".w-full:nth-child(1)")).click()
    await driver.findElement(By.css(".w-full:nth-child(1)")).sendKeys("fisio1@ull.es")
    
    await driver.wait(until.elementLocated(By.css(".w-full:nth-child(2)")), 5000);
    await driver.findElement(By.css(".w-full:nth-child(2)")).click()
    await driver.findElement(By.css(".w-full:nth-child(2)")).sendKeys("123456")
    await driver.findElement(By.css(".w-full:nth-child(2)")).sendKeys(Key.ENTER)
    
    await driver.wait(until.urlContains('/dashboard'), 15000);
    
    await driver.wait(until.elementLocated(By.linkText("Ver Perfil")), 10000);
    await driver.findElement(By.linkText("Ver Perfil")).click()
    
    await driver.wait(until.elementLocated(By.css(".mt-6:nth-child(7)")), 10000);
    await driver.findElement(By.css(".mt-6:nth-child(7)")).click()
    
    await driver.findElement(By.css(".text-gray-600")).click()
    
    await driver.findElement(By.css(".mt-6:nth-child(8)")).click()
    await driver.findElement(By.css(".mt-6:nth-child(8)")).click()
    
    await driver.findElement(By.css(".w-full")).click()
  })
})