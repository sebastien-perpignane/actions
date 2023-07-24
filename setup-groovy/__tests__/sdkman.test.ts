import {expect, afterEach, test} from '@jest/globals'
import * as fs from 'fs'
import * as os from 'os'
import {SdkMan} from '../src/sdkman'

const testInstallDir = `${os.homedir()}/_test_sdkinstalldir`

afterEach(() => {
  fs.rmSync(testInstallDir, {recursive: true, force: true})
})

test('install sdkman', async () => {
  let sdkMan = new SdkMan(testInstallDir)
  await sdkMan.installSdkMan()
  expect(fs.existsSync(testInstallDir))
}, 40000)
