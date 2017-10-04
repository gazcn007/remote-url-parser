# AWS-LoadTester
A parser using chrome-remote-interface to imitate human interactions on Tableau Public Profile to get all urls for vizzes

## Installions
### 1. Google Chrome Canary Installion
On Mac, open a terminal:
1. brew install chrome-canary
```bash
brew install Caskroom/versions/google-chrome-canary
```
2. make the path to chrome-canary:
```bash
sudo find / -type d -name "*Chrome Canary.app
```
3. add alias to .bash_profile:
```bash
alias chrome='/Applications/Google\ Chrome\ Canary.app/Contents/MacOS/Google\ Chrome\ Canary'
```
4. source ~/.bash_profile

### 2. NPM dependencies Installation
`git clone` this remote and `npm install`

### 3. Goad.io installation
1. Download Goad.io versions for your OS from this link:
[https://github.com/goadapp/goad/releases]()
2. Put the binary file into your default app folder (i.e. on OSX, its /usr/local/bin

### 4. Serverless-chrome installation
1. `git clone https://github.com/adieuadieu/serverless-chrome.git` under the current directory
2. `cd serverless-chrome` and follow the `README.md` file in the folder to install serverless-chrome.
3. with in `serverless-chrome` folder, do `cp -a ../Scenerios/. ./`
4. do `yarn deploy`

## Test Run
1. open a terminal window
```bash
chrome --headless --disable-gpu --remote-debugging-port=9222 https://public-aws-poc.dev.tabint.net/profile/qa.tableau#
```
2. open another terminal window (or you can `bg` the step 1)
3. First, you need to run `node sheet-url-parser.js`. What this does is it will open the QA Setup page ([https://public-aws-poc.dev.tabint.net/profile/qa.tableau]()), and imitate a actual user to scroll down to the bottom (show all hidden item), and inspect the DOM to find URLs to each of the vizzes. It will generate a JSON file called `profile-urls.json` under the current directory that has a list of urls parsed 
4. Then, you need to run `node viz-url-parser.js`. This parser, different from the sheet-url-parser, is a parser for urls to each of the particular viz by inspecting the iframes. It will utilizes headless-chrome's tab pool to achieve parallelism. It will generate a viz-urls.json
5. So far, you should have all the urls to vizzes through the automation process. Lets run Goad.io to deploy load testing via AWS-Lambda. Run `node goad-tester.js`.
	-  _Make sure you have access to AWS first!_
	
	This script will use Goad.io to deploy lambda functions on AWS, then it will invoke the lambda functions and save results to `goad-results` folder.
	
6. Check `goad-results` folder for your load-test results