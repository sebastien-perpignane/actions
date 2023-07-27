import {Candidate, SdkMan} from './sdkman'
import * as core from '@actions/core'
import * as exec from '@actions/exec'
import * as tcache from '@actions/tool-cache'

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

  getVersionDir(version: string): string {
    return `${this.sdkMan.candidatesDir()}/groovy/${version}/`
  }

  async install(version: string): Promise<void> {
    if (!this.sdkMan.isInstalled()) {
      throw new Error('sdkman is not installed')
    }

    let cacheDir = tcache.find('groovy', version)
    if (cacheDir) {
      core.info(`Groovy ${version} retrieved from cache`)
    }
    else {
      core.info(`Installing groovy ${version}...`)

      await this.sdkMan.installCandidate(this, version)
      cacheDir = await tcache.cacheDir(this.getVersionDir(version), "groovy", version)
  
      core.info(`Installing groovy ${version}: OK`)
    }

    core.addPath(cacheDir)
    
  }

  extractGroovyDependencies(): void {
    exec.exec('groovy', ['GrapeDependencies.groovy'])
  }
}
