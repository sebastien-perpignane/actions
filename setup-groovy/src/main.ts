import * as core from '@actions/core'
import {SdkMan} from './sdkman'
import {Groovy} from './groovy'
import * as os from 'os'

export const SDKMAN_DIR = `${os.homedir()}/sdkman_gh_actions`

async function run(): Promise<void> {
  try {
    const groovyVersion = core.getInput('groovy-version', {required: true})

    let sdkmanInstallDir = core.getInput('sdkman-install-dir')
    if (!sdkmanInstallDir) {
      sdkmanInstallDir = SDKMAN_DIR
    }
    const sdkMan = new SdkMan(sdkmanInstallDir)
    const sdkmanExitCode = await sdkMan.installSdkMan()
    // FIXME use throw error instead
    if (sdkmanExitCode) {
      core.setFailed(`SDKMAN! installation: KO (error code: ${sdkmanExitCode})`)
      return
    }
    core.info('SDKMAN! installation: OK')

    const groovy = new Groovy(sdkMan)
    groovy.install(groovyVersion)
  } catch (error) {
    if (error instanceof Error) core.setFailed(error.message)
  }
}

if (require.main === module) {
  run()
}
