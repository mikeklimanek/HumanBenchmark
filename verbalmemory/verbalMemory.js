const puppeteer = require('puppeteer');
const fs = require('fs');

async function verbalMemory(page){
    // const browser = await puppeteer.launch({ headless: false, args: ['--start-maximized'], defaultViewport: null});
    // const page = await browser.newPage();
    await page.goto('https://humanbenchmark.com/tests/verbal-memory', {waitUntil: 'networkidle2'});
    
    // try {     /* clicks 'AGREE' on cookies first to get rid of the pop up */
    //     const selector = 'button.css-47sehv, span.css-47sehv';
    //     const agreeButton = await page.waitForSelector(selector, { timeout: 5000 });
    //     if (agreeButton) {
    //           console.log('Accepted cookies');
    //           await agreeButton.click();
    //         }
    //       } catch (error) {
    //             console.log('Cookies AGREE button not found:', error);
    //           }
            
            const clickStartSelector = '.css-de05nr.e19owgy710'; 
            const clickStart = await page.waitForSelector(clickStartSelector, { timeout: 5000 });
            await clickStart.click();
            console.log('Start button clicked');

            const delay = time => new Promise(resolve => setTimeout(resolve, time));
            // await delay(5000);
            
            const seenWords = new Set();
            for (let i = 0; i < 10; i++) { 
                const wordElement = await page.$('.word'); 
                if (wordElement) {
                    const word = await page.evaluate(element => element.textContent, wordElement);
        

                    const buttons = await page.$$('button.css-de05nr.e19owgy710');
                    for (const button of buttons) {
                        const buttonText = await page.evaluate(element => element.textContent, button);
                        if ((buttonText === 'NEW' && !seenWords.has(word)) || (buttonText === 'SEEN' && seenWords.has(word))) {
                            if (!seenWords.has(word)) {
                                seenWords.add(word);
                                console.log('**Word added to set:', word);
                            } else {
                                console.log('seen:', word);
                            }
                            await button.click();
                            break;
                        }
                    }
                } else {
                    console.log('No word element found.');
                }
                // await delay(500); // Adjust delay as needed
            }
    
            const newButtonSelector = 'button.css-de05nr.e19owgy710'; 
            while (await page.$(newButtonSelector) !== null) {
                console.log('Clicking NEW to exit...');
                await page.click(newButtonSelector);
                await delay(300); 
            }
        
            const saveButtonSelector = 'button.css-qm6rs9.e19owgy710';
            await page.click(saveButtonSelector);
            await delay(2500);
        }

// verbalMemory();

module.exports = { verbalMemory };
