// Let's say you have a function that does some async operation inside setTimeout (think of polling for data)

let  runInterval = (callback, interval = 1000) => {
  setInterval(async () => {
    const results = await Promise.resolve(42) // this might fetch some data from server
    callback(results)
  }, interval)
}

// Goal: We want to test that function - make sure our callback was called
// The easiest way would be to pause inside test for as long as we neeed:

const pause = ms => new Promise(res => setTimeout(res, ms))

it('should call callback', async () => {
  const mockCallback = jest.fn()
  
  runInterval(mockCallback)
  
  await pause(1000)
  expect(mockCallback).toHaveBeenCalledTimes(1)
})

// This works but it sucks we have to wait 1 sec for this test to pass
// We can use jest fake timers to speed up the timeout

it('should call callback', () => { // no longer async
  jest.useFakeTimers()
  const mockCallback = jest.fn()
  
  runInterval(mockCallback)
  
  jest.advanceTimersByTime(1000)
  expect(mockCallback).toHaveBeenCalledTimes(1)
})

// This won't work - jest fake timers do not work well with promises. 
// If our runInterval function didn't have a promise inside that would be fine:

runInterval = (callback, interval = 1000) => {
  setInterval(() => {
    callback()
  }, interval)
}

it('should call callback', () => { 
  jest.useFakeTimers()
  const mockCallback = jest.fn()
  
  runInterval(mockCallback)
  
  jest.advanceTimersByTime(1000)
  expect(mockCallback).toHaveBeenCalledTimes(1) // works!
})

// What we need to do is to have some way to resolve the pending promises. One way to do it is to use process.nextTick:

const flushPromises = () => new Promise(res => process.nextTick(res))

it('should call callback', async () => {
  jest.useFakeTimers()
  const mockCallback = jest.fn()
  
  runInterval(mockCallback)
  
  jest.advanceTimersByTime(1000)
  await flushPromises()
  expect(mockCallback).toHaveBeenCalledTimes(1)
})
