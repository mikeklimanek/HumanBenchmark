const puppeteer = require('puppeteer');
const fs = require('fs');


async function clickNumbersInOrder(page) {
    const count = await page.evaluate(() => {
        const elements = document.querySelectorAll('.css-19b5rdt, .css-10qtjsi');
        return elements.length; 
    });

    
    for (let number = 1; number <= count; number++) { 
        const selector = `[data-cellnumber="${number}"]`; 
        try {
            await page.waitForSelector(selector, { timeout: 5000 }); 
            await page.click(selector); 
            console.log(`Clicked on number: ${number}`);
        } catch (error) {
            console.log(`Error clicking number: ${number}. Error: ${error.message}`);
            break; 
        }
    }
}




async function chimpTest(page) {
    // const browser = await puppeteer.launch({ headless: false, args: ['--start-maximized'], defaultViewport: null});
    // const page = await browser.newPage();
    await page.goto('https://humanbenchmark.com/tests/chimp', { waitUntil: 'networkidle2' });

    // try {     /* clicks 'AGREE' on cookies first to get rid of the pop up */
    // const selector = 'button.css-47sehv, span.css-47sehv';
    // const agreeButton = await page.waitForSelector(selector, { timeout: 5000 });
    // if (agreeButton) {
    //   console.log('Accepted cookies');
    //   await agreeButton.click();
    // }
    // } catch (error) {
    //     console.log('Cookies AGREE button not found:', error);
    // }

    const clickStartSelector = '.css-de05nr.e19owgy710'; 
    const clickStart = await page.waitForSelector(clickStartSelector, { timeout: 5000 });
    await clickStart.click();
    console.log('Start button clicked');

    console.log('Waiting for sequence to start...');
    const delay = time => new Promise(resolve => setTimeout(resolve, time));
    await delay(500);


    for (let i = 0; i < 30; i++) {
        let continueToNextLevel = true;
        while (continueToNextLevel) {
            const nextLevelButton = await page.$('.css-de05nr.e19owgy710'); 
            if (nextLevelButton) {
                console.log('Next level button found. Clicking to continue...');
                await nextLevelButton.click();
                await delay(200);
            } else {
                console.log('Attempting to click numbers in order...');
                await clickNumbersInOrder(page);
            }
            
            continueToNextLevel = await page.$('.css-de05nr.e19owgy710') !== null;
        }        
    }
    for (let j = 0; j < 3; j++) { // Use < 3 to run the loop three times
        let continueToNextLevel = true;
        while (continueToNextLevel) {
            const nextLevelButton = await page.$('.css-de05nr.e19owgy710');
            if (nextLevelButton) {
                console.log('Next level button found. Clicking to continue...');
                await nextLevelButton.click();
                await delay(200);
            } else {
                console.log('Attempting to click wrong numbers...');
                const wrongSelector = `[data-cellnumber="2"]`;
                const isWrongSelectorPresent = await page.$(wrongSelector) !== null;
                if (isWrongSelectorPresent) {
                    await page.click(wrongSelector);
                    await delay(200);
                } else {
                    break;
                }
            }
            
        }        
    }
    console.log('Chimp test finished');
    const saveButtonSelector = 'button.css-qm6rs9.e19owgy710';
    await page.click(saveButtonSelector);
    await delay(2500);

    // await browser.close();
}

// chimpTest();

module.exports = { chimpTest };
