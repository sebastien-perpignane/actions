import * as process from 'process'
import * as childProcess from 'child_process'
import * as path from 'path'
import {expect, test, afterEach} from '@jest/globals'
import {SDKMAN_DIR} from '../src/main'
import * as fs from 'fs'

afterEach(() => {
  fs.rmSync(SDKMAN_DIR, {recursive: true, force: true})
})

// shows how the runner will run a javascript action with env / stdout protocol
test('test runs', async () => {
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
})
