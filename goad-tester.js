const fs = require('fs');
const CDP = require('chrome-remote-interface');
const ChromePool = require('chrome-pool');
const fsPath = require('fs-path');
const Promise = require('bluebird');
const exec = Promise.promisify(require('child_process').exec);

// Default configuration
var config = {
    numberOfRequests: 1000,
    numberOfConcurrency: 15,
    scenerioRatios:{
        screenshot: 0.3,
        requests: 0.3,
        clicking: 0.3
    },
    numberOfPagesToTest: 10,
    domainURL: "https://public-aws-poc.dev.tabint.net"
}

async function readConfig(){
    if(process.argv[2]=='-c' || process.argv[2]=='--config'){
        if(process.argv[3]&&process.argv[3].split('.').pop()=='json'){
            console.log(process.argv[3]);
            fs.readFile(process.argv[3],'utf8', (err,data)=>{
                if(err) {throw err};
                config = JSON.parse(data);
                console.log(data);
            })
        }
    }
}

async function batchProcess(){
    fs.readFile("./viz-urls.json", "utf8", async (err, fileData)=>{
        var { urls } = JSON.parse(fileData);
        var fullList = [].concat.apply([], urls).map(e=>{
            return config.domainURL+e;
        });
        var url_index_mapping = [];
        var index = 1;
        fsPath.mkdir('/goad-results', function(err){
          console.log('created a folder "goad-results" to save test results');
        });
        for ( url of fullList){
            if(Math.random()<0.1){
                url_index_mapping.push({index, url});
                await exec ('goad -n'+ config.numberOfRequests + ' -c'+ config.numberOfConcurrency+' --json-output="./goad-results/goad-'+index+'.json" "https://jlyd5biq74.execute-api.us-west-2.amazonaws.com/dev/screenshot?url='+url+'"');
                if(index == config.numberOfPagesToTest) break;
                index++;
            }
        }
        fsPath.writeFile('./goad-results/goad-results.json', 
            JSON.stringify({url_index_mapping,
                numberOfRequests: config.numberOfRequests,
                concurrency: config.numberOfConcurrency,
                datetime: getDate()
            }),(err)=>{
                if(err) throw err;
            });
    });
    return; 
}

async function runTest(){
    await readConfig();
    await batchProcess();
}

var getDate = ()=>{
    var time = new Date();
    return (time.getHours() + ":" + time.getMinutes() + ":" + time.getSeconds());
}
runTest();

