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
    if (level < 9) return 5;
    if (level < 14) return 6;
    if (level < 19) return 7;
}

async function detectActiveSquaresByLevel(page, maxLevel = 1) {
    let sequences = {};
    let currentLevel = await getCurrentLevel(page);
    let extraLevels = 3;
    const delay = time => new Promise(resolve => setTimeout(resolve, time));


    while (currentLevel <= maxLevel + extraLevels) {
        console.log(`****************************************`);
        console.log(`***Detecting sequence for Level ${currentLevel}...***`);
        console.log(`****************************************`);
        sequences[currentLevel] = [];

        
        await new Promise(resolve => setTimeout(resolve)); 

        let sequenceDetected = false;
        let previousIndex = null;
        
        while (!sequenceDetected) {
            const activeIndices = await page.evaluate(() => {
                const squares = Array.from(document.querySelectorAll('.css-lxtdud.eut2yre1'));
                return squares.map((square, index) => square.classList.contains('active') ? index : -1).filter(index => index !== -1);
            });
            
            
            if (activeIndices.length > 0) { 
                activeIndices.forEach(activeIndex => {
                    if (!sequences[currentLevel].includes(activeIndex + 1)) {
                        sequences[currentLevel].push(activeIndex + 1); 
                        console.log(`Level ${currentLevel}: Square ${activeIndex + 1} is active`);
                    }
                });
                previousIndex = activeIndices[activeIndices.length - 1];
            } else if (sequences[currentLevel].length > 0) {
                sequenceDetected = true;
            }
            
            await new Promise(resolve => setTimeout(resolve, 200)); 
        }

        let size = gridSizeForLevel(currentLevel);
        console.log(`grid size: ${size}`);

        if (currentLevel > maxLevel) {
            const nonActiveIndices = [];
            const gridSize = gridSizeForLevel(currentLevel); 
            const totalSquares = gridSize * gridSize; 
        
            for (let i = 1; i <= totalSquares; i++) {
                if (!sequences[currentLevel].includes(i)) {
                    nonActiveIndices.push(i);
                }
            }
        
            for (const index of nonActiveIndices) {
                const row = Math.floor((index - 1) / gridSize) + 1;
                const col = (index - 1) % gridSize + 1;
                const selector = `.css-hvbk5q > div:nth-of-type(${row}) .css-lxtdud.eut2yre1:nth-of-type(${col})`;
        
                await page.click(selector, { delay: 50 });
                console.log(`Intentionally clicked on non-active square at row ${row}, column ${col}`);
            }
        } else {
            for (const index of sequences[currentLevel]) {
                const row = Math.floor((index - 1) / size); 
                const col = (index - 1) % size;
                const selector = `.css-hvbk5q > div:nth-of-type(${row + 1}) .css-lxtdud.eut2yre1:nth-of-type(${col + 1})`;
                await page.click(selector, { delay: 50 });
                console.log(`Clicked on square in row ${row + 1}, column ${col + 1}`);
            }
        }

        await waitForLevelTransition(page, currentLevel)
        await new Promise(resolve => setTimeout(resolve)); 
        currentLevel = await getCurrentLevel(page);
    }
    return sequences; 
}



async function waitForLevelTransition(page, previousLevel) {
    let levelChanged = false;
    while (!levelChanged) {
        let newLevel = await getCurrentLevel(page);
        if (newLevel > previousLevel) {
            levelChanged = true;
        }
    }
}



async function visualMemory(page) {
    // const browser = await puppeteer.launch({ headless: false, args: ['--start-maximized'], defaultViewport: null});
    // const page = await browser.newPage();
    await page.goto('https://humanbenchmark.com/tests/memory', { waitUntil: 'networkidle2' });

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
    const levelActive = await getCurrentLevel(page);
    const levelActiveSquares = await detectActiveSquaresByLevel(page);
    console.log('Detection completed:', levelActiveSquares, levelActive);
    // await browser.close();

}

// visualMemory();

module.exports = { visualMemory };
