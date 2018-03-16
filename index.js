
function sync(gen, ...rest) {
  const start = gen(...rest)
  let promise = null

  const run = (value) => {
    const next = start.next(value)
    const nextValue = next.value
    const done = next.done

    const handlePromise = (resolve, reject) => {
      promise = { resolve, reject }

      if (done) {
        return resolve(nextValue)
      }

      if (nextValue && nextValue.then) {
        nextValue.then(run)
      } else {
        run(nextValue)
      }
    }

    if (!promise) {
      return new Promise(handlePromise)
    } else {
      handlePromise(promise.resolve, promise.reject)
    }
  }

  return run()
}

module.exports = sync
