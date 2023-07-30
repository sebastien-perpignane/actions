import {expect, afterEach, test, afterAll, describe} from '@jest/globals'
import * as fs from 'fs'
import * as os from 'os'
import {SdkMan} from '@sebastien-perpignane/setup-sdkman'

const testInstallDir_sdkman = `${os.homedir()}/_test_sdkinstalldir`

const testInstallDir_java = `${os.homedir()}/_test_sdkinstalldir_java`

const testInstallDir_uninstall = `${os.homedir()}/_test_sdkinstalldir_uninstall`

const sdkMan = new SdkMan(testInstallDir_sdkman)

afterEach(() => {
  fs.rmSync(testInstallDir_sdkman, {recursive: true, force: true})
})

function deleteInstallDir(installDir: string): void {
  fs.rmSync(installDir, {recursive: true, force: true})
}

test('install sdkman', async () => {
  try {
    const sdkMan = new SdkMan(testInstallDir_sdkman)
    await sdkMan.installSdkMan()
    expect(fs.existsSync(testInstallDir_sdkman))
  } finally {
    deleteInstallDir(testInstallDir_sdkman)
  }
}, 40000)

test('candidate dir', () => {
  let groovyDir = sdkMan['candidateDir']({name: 'groovy'})
  expect(groovyDir).toEqual(`${testInstallDir_sdkman}/candidates/groovy`)
})

test('current candidate dir', () => {
  let groovyCurrentDir = sdkMan['candidateCurrentDir']({name: 'groovy'})
  expect(groovyCurrentDir).toEqual(
    `${testInstallDir_sdkman}/candidates/groovy/current`
  )
})

let installJava = async (sdkMan: SdkMan) => {
  let javaCandidate = {
    name: 'java'
  }

  await sdkMan.installSdkMan()

  await sdkMan.installCandidateAndAddToPath(javaCandidate, '20.0.2-amzn')
}

test('install sdkman then java', async () => {
  try {
    const sdkMan = new SdkMan(testInstallDir_java)

    await installJava(sdkMan)
  } finally {
    deleteInstallDir(testInstallDir_java)
  }
}, 90000)

test('uninstall java', async () => {
  try {
    const sdkMan = new SdkMan(testInstallDir_uninstall)

    await installJava(sdkMan)

    await sdkMan.uninstall('java', '20.0.2-amzn', true)
  } finally {
    deleteInstallDir(testInstallDir_uninstall)
  }
}, 90000)
