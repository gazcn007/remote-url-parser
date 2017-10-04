import Cdp from 'chrome-remote-interface'
import { sleep } from '../utils'

const LOAD_TIMEOUT = 1000 * 30

export default (async function handler (event) {
    const { queryStringParameters: {url}} = event;
    const requestsMade = []
    let loaded = false
    let wait = ms => new Promise(resolve => setTimeout(resolve, ms));

    const loading = async (startTime = Date.now()) => {
      if (!loaded && Date.now() - startTime < LOAD_TIMEOUT) {
        await sleep(100)
        await loading(startTime)
      }
    }

    const [tab] = await Cdp.List()
    const client = await Cdp({ host: '127.0.0.1', target: tab })

    const { Network, Page, Input } = client

    Network.requestWillBeSent(params => requestsMade.push(params))

    Page.loadEventFired(() => {
      loaded = true
    })

    // https://chromedevtools.github.io/devtools-protocol/tot/Network/#method-enable
    await Network.enable()

    // https://chromedevtools.github.io/devtools-protocol/tot/Page/#method-enable
    await Page.enable()

    // https://chromedevtools.github.io/devtools-protocol/tot/Page/#method-navigate
    await Page.navigate({ url })

    // wait until page is done loading, or timeout
    await loading()
    await wait(6000);
    // for(var i=0;i<3;i++){
    await Input.synthesizeTapGesture({
    	x: Math.random()*1000,
    	y: Math.random()*1000
    })
    // }
    
    const screenshot = await Page.captureScreenshot()
    result = screenshot.data

    // It's important that we close the websocket connection,
    // or our Lambda function will not exit properly
    await client.close()
	
	return {
    statusCode: 200,
    // it's not possible to send binary via AWS API Gateway as it expects JSON response from Lambda
    body: `<html><body><img src="data:image/png;base64,${result}" /></body></html>`,
    headers: {
      'Content-Type': 'text/html',
    },
  }
    // return {
    //   statusCode: 200,
    //   body: JSON.stringify({
    //     totalRequests: requestsMade.length,
    //     totalTimegap: requestsMade[requestsMade.length-1].timestamp-requestsMade[0].timestamp,
    //     requestsMade,
    //   }),
    //   headers: {
    //     'Content-Type': 'application/json',
    //   },
    // }
})