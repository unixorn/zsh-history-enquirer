const path = require('path')
const signale = require('signale')
const searchHistory = require('..')


test('search `echo` in history', async () => {
  const searcher = await searchHistory({
    input: 'author',
    historyFile: path.join(__dirname, 'history.txt'),
  })

  searcher.once('run', async() => {
    await searcher.render();
    await searcher.submit();
  });

  const result = await searcher.run()
  signale.info('found history command: ', result)
  expect(result).toBe('echo author zthxxx')
})

test('search multiple words in history', async () => {
  const searcher = await searchHistory({
    input: 'log iso',
    historyFile: path.join(__dirname, 'history.txt'),
  })

  searcher.once('run', async() => {
    await searcher.render();
    await searcher.submit();
  });

  const result = await searcher.run()
  signale.info('found history command: ', result)
  expect(result).toBe('git log --pretty=fuller --date=iso -n 1')
})
