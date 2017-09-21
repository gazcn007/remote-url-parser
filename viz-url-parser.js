const CDP = require('chrome-remote-interface');
const fs = require('fs');

CDP({
    host: 'localhost',
    port: 9222,
}, async client => {
    fs.readFile("./profile-urls.json", "utf8", async (err, fileData)=>{
        var { links, domain } = JSON.parse(fileData);
        const {Page, DOM, Input} = client;
        let wait = ms => new Promise(resolve => setTimeout(resolve, ms));

        await Page.enable();
        for (link of links){
            console.log('Loading The URL:', domain+link)
            await Page.navigate({ url: domain+link});
            await Page.loadEventFired();
            await wait(8000);
            console.log('parsing The URL:', domain+link)
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
            const urls = attributes
                .map(x => x.attributes)
                .filter(x => x.includes("ng-src"))
                .map((attrs) => {
                    const index = attrs.indexOf("ng-src");
                    return attrs[index + 1];
                });
            console.log(urls);
        }
        await client.close();
    })
});
