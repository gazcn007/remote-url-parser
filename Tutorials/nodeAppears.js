const CDP = require('chrome-remote-interface');
const fs = require('fs');

async function nodeAppears(client, selector) {
    // browser code to register and parse mutations
    const browserCode = (selector) => {
        return new Promise((fulfill, reject) => {
            new MutationObserver((mutations, observer) => {
                // add all the new nodes
                const nodes = [];
                mutations.forEach((mutation) => {
                    nodes.push(...mutation.addedNodes);
                });
                // fulfills if at least one node matches the selector
                if (nodes.find((node) => node.matches(selector))) {
                    observer.disconnect();
                    fulfill();
                }
            }).observe(document.body, {
                childList: true
            });
        });
    };
    // inject the browser code
    const {Runtime} = client;
    await Runtime.evaluate({
        expression: `(${browserCode})(${JSON.stringify(selector)})`,
        awaitPromise: true
    });
}

function demo() {
    setTimeout(() => {
        const foo = document.createElement('div');
        foo.id = 'foo';
        foo.innerText = 'foo';
        document.body.appendChild(foo);
    }, 3000);
}

CDP(async (client) => {
    const {Runtime, Page} = client;
    try {
        await Page.enable();
        await Page.navigate({ url: 'http://www.carlrocks.com'});
        await Page.loadEventFired()

        // wait for the element to be present
        await nodeAppears(client, '.site-author-image');
        console.log('OK');
        let {data} = await Page.captureScreenshot({
            format: 'png',
        });

        fs.writeFile('screenshot.png', data, 'base64', e => console.error(e));

    } catch (err) {
        console.error(err);
    } finally {
        client.close();
    }
}).on('error', (err) => {
    console.error(err);
});
