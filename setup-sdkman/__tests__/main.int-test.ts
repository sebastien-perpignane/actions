import * as process from 'process'
import * as childProcess from 'child_process'
import * as path from 'path'
import {expect, afterEach, test} from '@jest/globals'
import {SDKMAN_DIR} from '../src/sdkman'
import * as fs from 'fs'
import * as os from 'os'

const integrationTestSdkManDir = `${os.homedir()}/__test_sdkman_dir`

afterEach(() => {
  fs.rmSync(integrationTestSdkManDir, {recursive: true, force: true})
})

// shows how the runner will run a javascript action with env / stdout protocol
test('run action', () => {
  process.env['INPUT_SDKMAN-INSTALL-DIR'] = integrationTestSdkManDir
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

  expect(fs.existsSync(integrationTestSdkManDir))
  expect(fs.existsSync(`${integrationTestSdkManDir}/candidates/groovy/4.0.13`))
  expect(fs.existsSync(`${integrationTestSdkManDir}/candidates/groovy/current`))
}, 40000)
