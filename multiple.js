const fs = require('fs');
const CDP = require('chrome-remote-interface');
const ChromePool = require('chrome-pool');
const fsPath = require('fs-path');

async function process(urls){
    const chromepoll = await ChromePool.new({
        maxTab : 5,
        port : 9222
    });
    let wait = ms => new Promise(resolve => setTimeout(resolve, ms));
    var toRet = [];
    for (url of urls){
        const { tabId,protocol } = await chromepoll.require();
        const { Page,Target,Network, DOM } = protocol;
        await Page.enable();
        await Page.navigate({url})
        await Page.loadEventFired();
        await wait(3000);
        // ScreenShots?
        // let {data} = await Page.captureScreenshot({
        //     format: 'png',
        // });
        // fs.writeFile('screenshot.png', data, 'base64', e => console.error(e));
        const rootElement = await DOM.getDocument();
        const { root: { nodeId } } = rootElement;
        const { nodeIds: linkIDs } = await DOM.querySelectorAll({
            selector: "iframe",
            nodeId,
        });
        const attributes = await Promise.all(linkIDs.map((ID) =>
            DOM.getAttributes({ nodeId: ID })
        ));
        // Atrributes are returned in single array and item pairs
        const url_parsed = attributes
            .map(x => x.attributes)
            .filter(x => x.includes("ng-src"))
            .map((attrs) => {
                const index = attrs.indexOf("ng-src");
                return attrs[index + 1];
            });
        toRet.push(url_parsed);
        await chromepoll.release(tabId);
    }
    await chromepoll.destroyPoll();
    return toRet;
}


async function batchProcess(){
    fs.readFile("./profile-urls.json", "utf8", async (err, fileData)=>{
        var { urls } = JSON.parse(fileData);
        var fullList = [];
        for (let i = 0; i<urls.length; i=i+3){
            console.log('Batch Processing :', i,' to ',i+3);
            var res = await process(urls.slice(i,i+3));
            console.log("finished : ", res);
            fullList.push(res);
        }
        fsPath.writeFile('./viz-urls.json', JSON.stringify({urls: fullList},null,2), function (err){
            if(err) throw err;
        })
    });
    return; 
}
batchProcess();

// process([ 'https://public-aws-poc.dev.tabint.net/profile/qa.tableau#!/vizhome/USIncomeDistribution_1/USIncomeDistribution',
//   'https://public-aws-poc.dev.tabint.net/profile/qa.tableau#!/vizhome/BUG74669/Sheet1',
//   'https://public-aws-poc.dev.tabint.net/profile/qa.tableau#!/vizhome/8-0-MoreVerySimple/Dashboard2',
//   'https://public-aws-poc.dev.tabint.net/profile/qa.tableau#!/vizhome/8-0-MoreVerySimple_0/Sheet3' ])

// function loadForScrot(url) {
//     return new Promise(async (fulfill, reject) => {
//         const tab = await CDP.New();
//         const client = await CDP({tab});
//         const {Page} = client;
//         Page.loadEventFired(() => {
//             fulfill({client, tab});
//         });
//         await Page.enable();
//         await Page.navigate({url});
//     });
// }

// async function process(urls) {
//     try {
//         const handlers = await Promise.all(urls.map(loadForScrot));
//         for (const {client, tab} of handlers) {
//             const {Page, DOM} = client;
//             await CDP.Activate({id: tab.id});
//             const filename = `./scrot_${tab.id}.png`;
//             const result = await Page.captureScreenshot();
//             const image = Buffer.from(result.data, 'base64');
//             fs.writeFileSync(filename, image);
//             console.log(filename);
            
//             const rootElement = await DOM.getDocument();
//             const { root: { nodeId } } = rootElement;
//             const { nodeIds: linkIDs } = await DOM.querySelectorAll({
//                 selector: "iframe",
//                 nodeId,
//             });
//             const attributes = await Promise.all(linkIDs.map((ID) =>
//                 DOM.getAttributes({ nodeId: ID })
//             ));
//             // Atrributes are returned in single array and item pairs
//             const urls = attributes
//                 .map(x => x.attributes)
//                 .filter(x => x.includes("ng-src"))
//                 .map((attrs) => {
//                     const index = attrs.indexOf("ng-src");
//                     return attrs[index + 1];
//                 });
//             console.log(urls);
//             await client.close();
//         }
//     } catch (err) {
//         console.error(err);
//     }
// }

