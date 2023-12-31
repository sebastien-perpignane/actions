import * as process from 'process'
import * as childProcess from 'child_process'
import * as path from 'path'
import {expect, afterEach, test} from '@jest/globals'
import {SDKMAN_DIR} from '@sebastien-perpignane/setup-sdkman'
import * as fs from 'fs'

afterEach(() => {
  fs.rmSync(SDKMAN_DIR, {recursive: true, force: true})
})

// shows how the runner will run a javascript action with env / stdout protocol
test('run action', () => {
  process.env['INPUT_GROOVY-VERSION'] = '4.0.13'
  const nodeProcessPath = process.execPath
  const mainScriptPath = path.join(__dirname, '..', 'lib', 'main.js')
  const options: childProcess.ExecFileSyncOptions = {
    env: process.env
  }
  console.log(
    childProcess
      .execFileSync(nodeProcessPath, [mainScriptPath], options)
      .toString()
  )

  expect(fs.existsSync(SDKMAN_DIR))
  expect(fs.existsSync(`${SDKMAN_DIR}/candidates/groovy/4.0.13`))
  expect(fs.existsSync(`${SDKMAN_DIR}/candidates/groovy/current`))
}, 40000)
