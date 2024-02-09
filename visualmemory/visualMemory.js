const puppeteer = require('puppeteer');
const fs = require('fs');

async function getCurrentLevel(page) {
    return page.evaluate(() => {
        const levelSpan = document.querySelector('span.css-yuq7ce + span');
        return levelSpan ? parseInt(levelSpan.textContent, 10) : null;
    });
}
function gridSizeForLevel(level) {
    if (level <= 2) return 3; 
    if (level <= 5) return 4; 
    if (level <= 9) return 5; 
    
    return 5 + Math.floor((level - 10) / 5) + 1;
}

async function detectActiveSquaresByLevel(page, maxLevel = 25) {
    const levelActive = await getCurrentLevel(page);
    let sequences = {};
    for (let level = 1; level <= maxLevel; level++) {
        console.log(`****************************************`);
        console.log(`***Detecting sequence for Level ${levelActive}...***`);
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
            await new Promise(resolve => setTimeout(resolve, 500)); 
        }
        console.log(`Waiting 2 seconds before clicking for Level ${level}...`);
        await new Promise(resolve => setTimeout(resolve, 2000)); 

            console.log(`****************************************`);
            console.log(`***Clicking sequence for Level ${levelActive}...***`);
            console.log(`****************************************`);
            
            const size = gridSizeForLevel(level);
            console.log(`grid size: ${size}`);
            
            for (const index of sequences[level]) {
                let row = Math.floor((index - 1) / size); 
                let col = ((index - 1) % size);
                
                const selector = `.css-hvbk5q > div:nth-of-type(${row + 1}) .css-lxtdud.eut2yre1:nth-of-type(${col + 1})`;
                try {
                    await page.click(selector, { delay: 150 });
                    console.log(`Clicked on tile in row ${row}, column ${col}`);
                } catch (error) {
                    console.error(`Error clicking on tile in row ${row}, column ${col}: ${error.message}`);
                }
            }
            
            await new Promise(resolve => setTimeout(resolve, 200)); 
        
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
