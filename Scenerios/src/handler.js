import config from './config'
import { spawn as spawnChrome } from './chrome'
import { log } from './utils'

// eslint-disable-next-line import/prefer-default-export
export async function run (event, context, callback, handler = config.handler) {
  let handlerResult = {}
  let handlerError = null

  try {
    await spawnChrome()
  } catch (error) {
    console.error('Error in spawning Chrome')
    return callback(error)
  }

  try {
    handlerResult = await handler(event, context)
  } catch (error) {
    console.error('Error in handler:', error)
    handlerError = error
  }

  log('Handler result:', JSON.stringify(handlerResult, null, ' '))

  return callback(handlerError, handlerResult)
}

// eslint-disable-next-line import/prefer-default-export
export async function screenshot (event, context, callback, handler = config.captureScreenshot) {
  let handlerResult = {}
  let handlerError = null

  try {
    await spawnChrome()
  } catch (error) {
    console.error('Error in spawning Chrome')
    return callback(error)
  }

  try {
    handlerResult = await handler(event, context)
  } catch (error) {
    console.error('Error in handler:', error)
    handlerError = error
  }

  log('Handler result:', JSON.stringify(handlerResult, null, ' '))

  return callback(handlerError, handlerResult)
}

export async function requests (event, context, callback, handler = config.networkReqHandler) {
  let handlerResult = {}
  let handlerError = null

  try {
    await spawnChrome()
  } catch (error) {
    console.error('Error in spawning Chrome')
    return callback(error)
  }

  try {
    handlerResult = await handler(event, context)
  } catch (error) {
    console.error('Error in handler:', error)
    handlerError = error
  }

  log('Handler result:', JSON.stringify(handlerResult, null, ' '))

  return callback(handlerError, handlerResult)
}

export async function clickaround (event, context, callback, handler = config.clickAround) {
  let handlerResult = {}
  let handlerError = null

  try {
    await spawnChrome()
  } catch (error) {
    console.error('Error in spawning Chrome')
    return callback(error)
  }

  try {
    handlerResult = await handler(event, context)
  } catch (error) {
    console.error('Error in handler:', error)
    handlerError = error
  }

  log('Handler result:', JSON.stringify(handlerResult, null, ' '))

  return callback(handlerError, handlerResult)
}
