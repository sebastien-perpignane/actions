import * as process from 'process'
import * as cp from 'child_process'
import * as path from 'path'
import {expect, test, beforeEach} from '@jest/globals'
import {installSdkman, SDKMAN_DIR} from '../src/main'
import * as fs from 'fs'

const customInstallDir = process.cwd() + '/customsdkmandir'

beforeEach(() => {
  fs.rmSync(SDKMAN_DIR, {recursive: true, force: true})
  fs.rmSync(customInstallDir, {recursive: true, force: true})
});


// shows how the runner will run a javascript action with env / stdout protocol
test('test runs', async () => {
  process.env['INPUT_GROOVY_VERSION'] = '4.0.13'
  const np = process.execPath
  const ip = path.join(__dirname, '..', 'lib', 'main.js')
  const options: cp.ExecFileSyncOptions = {
    env: process.env
  }
  console.log(cp.execFileSync(np, [ip], options).toString())
})

test('install sdkman', async () => {

  await installSdkman(customInstallDir)
  expect(fs.existsSync(customInstallDir))
})
