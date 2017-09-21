const fs = require('fs');
const CDP = require('chrome-remote-interface');
const ChromePool = require('chrome-pool');
const fsPath = require('fs-path');
const Promise = require('bluebird');
const exec = Promise.promisify(require('child_process').exec);

async function batchProcess(){
    fs.readFile("./viz-urls.json", "utf8", async (err, fileData)=>{
        var { urls } = JSON.parse(fileData);
        var fullList = [].concat.apply([], urls).map(e=>{
            return "https://public-aws-poc.dev.tabint.net"+e;
        });
        var indexJson = [];
        var index =1;
        for ( url of fullList){
            indexJson.push({index, url});
            await exec ('goad -n 10000 -c 10 --json-output="./goad-results/goad-'+index+'.json" "'+url+'"');
            // console.log('goad -n 10000 -c 10 --json-output="./goad-'+index+'.json" "'+url+'"');
            index++;
        }
    });
    await exec('touch test.delete');
    return; 
}
batchProcess();

