const puppeteer = require('puppeteer');
const fs = require('fs');

async function getCurrentLevel(page) {
    return page.evaluate(() => {
        const levelSpan = document.querySelector('span.css-yuq7ce + span');
        return levelSpan ? parseInt(levelSpan.textContent, 10) : null;
    });
}

async function detectActiveSquaresByLevel(page, maxLevel = 25) {
    let sequences = {};
    for (let level = 1; level <= maxLevel; level++) {
        console.log(`****************************************`);
        console.log(`***Detecting sequence for Level ${level}...***`);
        console.log(`****************************************`);
        sequences[level] = [];

        await new Promise(resolve => setTimeout(resolve)); 

        let sequenceDetected = false;
        let previousIndices = new Set(); 
        
        while (!sequenceDetected) {
            const activeIndices = await page.evaluate(() => {
                const activeSquares = Array.from(document.querySelectorAll('.active.css-lxtdud.eut2yre1'));
                return activeSquares.map(square => Array.from(document.querySelectorAll('.css-lxtdud.eut2yre1')).indexOf(square));
            });
            
            let newActiveFound = activeIndices.some(index => !previousIndices.has(index));
            if (newActiveFound) {
                activeIndices.forEach(index => {
                    if (!previousIndices.has(index)) {
                        sequences[level].push(index + 1);
                        console.log(`Level ${level}: Tile ${index + 1} is active`);
                        previousIndices.add(index);
                    }
                });
            } else if (activeIndices.length === 0 && sequences[level].length > 0) {
                sequenceDetected = true;
            }
            
            await new Promise(resolve => setTimeout(resolve, 200)); 
        }

        // currently not clicking by itself, I will add this later
        // code so far checks the active tiles and logs them to the console
        // so far it works even when the number of tiles increases
    }

    return sequences;
}






async function main() {
    const browser = await puppeteer.launch({ headless: false, args: ['--start-maximized'], defaultViewport: null});
    const page = await browser.newPage();
    await page.goto('https://humanbenchmark.com/tests/memory', { waitUntil: 'networkidle2' });

    try {     /* clicks 'AGREE' on cookies first to get rid of the pop up */
    const selector = 'button.css-47sehv, span.css-47sehv';
    const agreeButton = await page.waitForSelector(selector, { timeout: 5000 });
    if (agreeButton) {
      console.log('Accepted cookies');
      await agreeButton.click();
    }
    } catch (error) {
        console.log('Cookies AGREE button not found:', error);
    }

    const clickStartSelector = '.css-de05nr.e19owgy710'; 
    const clickStart = await page.waitForSelector(clickStartSelector, { timeout: 5000 });
    await clickStart.click();
    console.log('Start button clicked');

    console.log('Waiting for sequence to start...');
    const delay = time => new Promise(resolve => setTimeout(resolve, time));
    await delay(500);
    const levelActive = await getCurrentLevel(page);
    const levelActiveSquares = await detectActiveSquaresByLevel(page);
    console.log('Detection completed:', levelActiveSquares, levelActive);


}

main();
