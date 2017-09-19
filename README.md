# remote-url-parser
A parser using headless chrome and chrome-remote-interface to imitate human interactions on Tableau Public Profile to get all urls for vizzes

## Installions
### Google Chrome Canary Installion
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

### chrome-remote-interface Installation
`git clone` this remote and `npm install`

## Test Run
1. open a terminal window, run 
```bash
chrome --headless --disable-gpu --remote-debugging-port=9222 https://public-aws-poc.dev.tabint.net/profile/qa.tableau#
```
2. open another terminal window (or you can bg the step 1), and run `node parser.js`