const fs = require('fs');
const { execSync } = require('child_process');
const botDirectories = ['./verbalmemory', './sequence', './aimtrainer', './chimptest', './visualmemory', './reactiontime', './numbermemory', './typingtest'];


async function setupAndStartBot(botDir) {
  if (!fs.existsSync(`${botDir}/package.json`) || !fs.existsSync(`${botDir}/node_modules`)) {
    console.log(`Installing dependencies for bot in ${botDir}...`);
    execSync('npm i puppeteer express dotenv', { cwd: botDir, stdio: 'inherit' });
  }

  console.log(`Starting bot in ${botDir}...`);
  execSync('npm start', { cwd: botDir, stdio: 'inherit' });
}

async function startAllBots() {
  for (const botDir of botDirectories) {
    await setupAndStartBot(botDir);
  }
}

startAllBots().then(() => console.log('All bots have been started'));
