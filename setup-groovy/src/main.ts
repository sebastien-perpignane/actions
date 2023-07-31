import * as core from '@actions/core'
import {SdkMan, SDKMAN_DIR as DEFAULT_SDKMAN_DIR} from '@sebastien-perpignane/setup-sdkman'
import {Groovy} from './groovy'

async function run(): Promise<void> {
  try {
    const groovyVersion = core.getInput('groovy-version', {required: true})

    let sdkmanInstallDir = core.getInput('sdkman-install-dir')
    if (!sdkmanInstallDir) {
      sdkmanInstallDir = DEFAULT_SDKMAN_DIR
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
