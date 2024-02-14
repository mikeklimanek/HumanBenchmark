# HumanBenchmark
Bot for Human Benchmark to practice with Node.js puppeteer

# BOTs on GIFs were slowed down to show their abilities 

# instalation

head to main directory for all bots ```cd humanbenchmark```

then run ```npm start```

for your first use, each bot will install its own node modules and then run.
From second use and onwards the bots will all simply run just by ```npm start```


* Reaction Time bot waits for page to turn green and clicks (averaging around 30ms)

![alt text](ReactionTime.gif)

_____________________________________________________________________________________________________________
* Verbal Memory bot checks if given word has been seen in set, if not it adds the word to set. It uses buttons accordingly

![alt text](MemoryTest.gif)

_____________________________________________________________________________________________________________
* Number Memory bot remembers a number shown on a screen, waits for input, types the number in and presses enter twice to continue

![alt text](NumberMemory.gif)

_____________________________________________________________________________________________________________
* Typing Test bot simulates typing a text provided on a screen by humanbenchmark at speeds over 3500+ words per minute

![alt text](TypingTest.gif)

_____________________________________________________________________________________________________________
* Sequence Memory bot remembers a sequence of tiles shown by humanbenchmark and then simulates clicking in that sequence

![alt text](SequenceMemory.gif)


_____________________________________________________________________________________________________________
* Visual Memory bot remembers a pattern shown and replicates it

![alt text](visualMemory.gif)

_____________________________________________________________________________________________________________
* Aim Trainer bot clicks all targets

![alt text](aimTrainer.gif)

_____________________________________________________________________________________________________________
* Chimp Test bot looks at the order of numbers and clicks on squares based on memory in which order were they numbered

![alt text](chimpTest.gif)



# Installation Guide to run bots separately
Welcome to the Human Benchmark Bot Collection! This guide will help you set up and use the various bots included in this repository. Each bot is designed to automate tasks on the Human Benchmark website using Node.js and Puppeteer. Let's get started.

* Prerequisites
Before you begin, make sure you have Node.js and npm installed on your computer. If you haven't installed these yet, follow the instructions on the Node.js website.

* Step 1: Clone the Repository
  * First, clone the repository to your local machine. Open a terminal or command prompt and run the following command:
```git clone https://github.com/mikeklimanek/HumanBenchmark``` 

* Step 2: Install Dependencies
  * Each bot has its own folder within the repository, containing a package.json file with the necessary dependencies. To install these dependencies, navigate to the bot's folder and run:
f.e. for Chimp Test ```cd chimptest``` then ```npm install ```

* Step 3: Running a Bot
  * To run a specific bot, navigate to the bot's folder in your terminal or command prompt. For example, to run the Chimp Test bot, you would do the following:
```npm start```
