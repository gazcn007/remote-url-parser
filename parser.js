const CDP = require('chrome-remote-interface');

CDP({
    host: 'localhost',
    port: 9222,
}, async client => {
    const {Page, DOM, Input} = client;

    await Page.enable();
    console.log('The Automation Parser is imitation')
    await Input.synthesizeScrollGesture({x: 500, y: 500, yDistance: -15000, speed: -15000, repeatCount: 5, repeatDelayMs: 2000});

    const rootElement = await DOM.getDocument();
    const { root: { nodeId } } = rootElement;
    const { nodeIds: linkIDs } = await DOM.querySelectorAll({
        selector: ".workbook-title > a",
        nodeId,
    });

    // Get each element attributes
    const attributes = await Promise.all(linkIDs.map((ID) =>
        DOM.getAttributes({ nodeId: ID })
    ));

    // Atrributes are returned in single array and item pairs
    const links = attributes
        .map(x => x.attributes)
        .filter(x => x.includes("href"))
        .map((attrs) => {
            const index = attrs.indexOf("href");
            return attrs[index + 1];
        });

    // Use set to get unique items only
    const uniqueLinks = new Set([...links]);


    console.log('Node Id ', links)
    console.log('Total Count ', links.length)

    let {data} = await Page.captureScreenshot({
        format: 'png',
    });

    // fs.writeFile('screenshot.png', data, 'base64', e => console.error(e));

    await client.close();
});