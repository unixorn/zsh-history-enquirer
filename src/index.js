import getCursorPos from './cursorPosition'
import history from './zshHistory'
import HistorySearcher from './historySearcher'
import { getStdin, getStdout } from './tty'
import signale from './signale'


const { stringify } = JSON

export default async function searchHistory({ input = '', historyCommand, historyFile }) {
  signale.info('searchHistory start')

  const [
    cursor,
    lines,
  ] = await Promise.all([
    getCursorPos(),
    history(historyCommand, historyFile),
  ])

  signale.info('searchHistory cursor', cursor)
  signale.info(
    'searchHistory lines',
    lines.length,
    stringify(lines[0]),
  )

  const stdin = process.stdin.isTTY ? process.stdin : getStdin()
  const stdout = process.stdout.isTTY ? process.stdout : getStdout()
  signale.info(
    'searchHistory stdin',
    stdin.constructor.name,
    ['isTTY', stdin.isTTY],
  )
  signale.info(
    'searchHistory stdout',
    stdout.constructor.name,
    ['isTTY', stdout.isTTY],
  )

  const searcher = new HistorySearcher({
    name: 'history',
    message: 'reverse search history',
    promptLine: false,
    choices: lines,
    // shell prompt start col without input buffer
    initCol: cursor.x - input.length,
    stdin,
    stdout,
    get limit() {
      return Math.min(15, stdout.rows - 2)
    },
    onRun(prompt) {
      signale.info('HistorySearcher onRun start')
      signale.info('HistorySearcher start input', stringify(input))

      if (input.length) {
        prompt.input = input
        prompt.cursor += input.length
        prompt.choices = prompt.suggest()
      }

      signale.info(
        'HistorySearcher onRun choices',
        prompt.choices.length,
        stringify(prompt.choices[0].value),
      )
    },
  })

  return searcher
}

