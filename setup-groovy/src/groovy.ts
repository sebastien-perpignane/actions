import {Candidate, SdkMan} from './sdkman'
import * as exec from '@actions/exec'

export class Groovy implements Candidate {
  private currentGroovyDir: string

  constructor(private sdkMan: SdkMan) {
    this.currentGroovyDir = `${sdkMan.candidatesDir()}/groovy/current/`
  }

  get name(): string {
    return 'groovy'
  }

  getVersionDir(version: string): string {
    return `${this.sdkMan.candidatesDir()}/groovy/${version}/`
  }

  async install(version: string): Promise<void> {
    if (!this.sdkMan.isInstalled()) {
      throw new Error('sdkman is not installed')
    }
    await this.sdkMan.installCandidateAndAddToPath(this, version)
  }

  extractGroovyDependencies(): void {
    exec.exec('groovy', ['GrapeDependencies.groovy'])
  }
}
