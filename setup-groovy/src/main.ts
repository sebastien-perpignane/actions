import * as core from '@actions/core'
import * as exec from '@actions/exec'
import {wait} from './wait'

async function run(): Promise<void> {
  try {
    const ms: string = core.getInput('milliseconds')
    core.debug(`Waiting ${ms} milliseconds ...`) // debug is only output if you set the secret `ACTIONS_STEP_DEBUG` to true

    core.debug(new Date().toTimeString())
    await wait(parseInt(ms, 10))
    core.debug(new Date().toTimeString())

    extractGroovyDependencies()

    core.setOutput('time', new Date().toTimeString())
  } catch (error) {
    if (error instanceof Error) core.setFailed(error.message)
  }
}

function extractGroovyDependencies(): void {
  exec.exec("groovy GrapeDependencies.groovy")
}

function installSdkman(): void {
  exec.exec("curl -s 'https://get.sdkman.io' | bash")
}


run()
