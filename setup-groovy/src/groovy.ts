import {Candidate, SdkMan} from './sdkman'
import * as core from '@actions/core'
import * as exec from '@actions/exec'

export class Groovy implements Candidate {
  private currentGroovyDir: string

  constructor(private sdkMan: SdkMan) {
    this.currentGroovyDir = `${sdkMan.candidatesDir()}/groovy/current/`
  }

  getName(): string {
    return 'groovy'
  }

  getCurrentDir(): string {
    return this.currentGroovyDir
  }

  async install(version: string): Promise<void> {
    if (!this.sdkMan.isInstalled()) {
      throw new Error('sdkman is not installed')
    }

    core.info('Installing groovy...')

    await this.sdkMan.install(this, version)
  }

  extractGroovyDependencies(): void {
    exec.exec('groovy', ['GrapeDependencies.groovy'])
  }
}
