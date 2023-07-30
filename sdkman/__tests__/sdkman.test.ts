import * as process from 'process'
import * as childProcess from 'child_process'
import * as path from 'path'
import {expect, afterEach, test} from '@jest/globals'
import * as fs from 'fs'
import * as os from 'os'

const SDKMAN_DIR = `${os.homedir()}/__sdkman_install_test`

afterEach(() => {
  fs.rmSync(SDKMAN_DIR, {recursive: true, force: true})
})

// shows how the runner will run a javascript action with env / stdout protocol
test('run action', () => {
  process.env['INPUT_SDKMAN-INSTALL-DIR'] = SDKMAN_DIR
  const nodeProcessPath = process.execPath
  const mainScriptPath = path.join(__dirname, '..', 'lib', 'sdkman.js')
  const options: childProcess.ExecFileSyncOptions = {
    env: process.env
  }
  console.log(
    childProcess
      .execFileSync(nodeProcessPath, [mainScriptPath], options)
      .toString()
  )

  expect(fs.existsSync(SDKMAN_DIR))
}, 40000)
