const puppeteer = require('puppeteer');
const fs = require('fs');
const { aimTrainer } = require('./aimtrainer/aimTrainer');
const { chimpTest } = require('./chimptest/chimpTest');
const { numberMemory } = require('./numbermemory/numberMemory');
const { reactionTime } = require('./reactiontime/reactionTime');
const { sequence } = require('./sequence/sequence');
const { typingTest } = require('./typingtest/typingTest');
const { verbalMemory } = require('./verbalmemory/verbalMemory');
const { visualMemory } = require('./visualmemory/visualMemory');
// const { execSync } = require('child_process');
// const botDirectories = ['./aimtrainer', './chimptest', './numbermemory', './reactiontime', './sequence', './typingtest', './verbalmemory', './visualmemory'];


// async function setupAndStartBot(botDir) {
//   if (!fs.existsSync(`${botDir}/package.json`) || !fs.existsSync(`${botDir}/node_modules`)) {
//     console.log(`Installing dependencies for bot in ${botDir}...`);
//     execSync('npm i puppeteer express dotenv', { cwd: botDir, stdio: 'inherit' });
//   }

//   console.log(`Starting bot in ${botDir}...`);
//   execSync('npm start', { cwd: botDir, stdio: 'inherit' });
// }

// const botTasks = [aimTrainer, chimpTest, numberMemory, reactionTime, sequence, typingTest, verbalMemory, visualMemory];
const botTasks = [aimTrainer, visualMemory];

async function startAllBots() {
  const browser = await puppeteer.launch({ headless: false, args: ['--start-maximized'], defaultViewport: null });
  const page = await browser.newPage();
  // for (const botDir of botDirectories) {
  //   await setupAndStartBot(botDir);
  // }
  for (const botTask of botTasks) {
    await botTask(page);
  }
}

startAllBots().then(() => console.log('All bots have finished running.'));
