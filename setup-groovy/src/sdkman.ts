import * as exec from '@actions/exec'
import * as fs from 'fs'
import * as core from '@actions/core'

export interface Candidate {
  getName(): string

  getCurrentDir(): string
}

export class SdkMan {
  // download url for sdkman -> https://api.sdkman.io/2/broker/download/groovy/4.0.13/linux
  // the url redirects the http client to the real download url of the candidate

  constructor(private installDir: string) {}

  async installSdkMan(): Promise<number> {
    const curlOutput = await this.getBashSdkmanInstallationScript()
    const installScriptExitCode = await this.runSdkmanInstallScript(
      this.installDir,
      curlOutput.stdout.toString()
    )
    this.configureSdkManForAutoAnswer()
    core.exportVariable('sdkman_dir', this.installDir)
    return installScriptExitCode
  }

  private async getBashSdkmanInstallationScript(): Promise<exec.ExecOutput> {
    return await exec.getExecOutput('curl', [
      '-s',
      'https://get.sdkman.io?rcupdate=false' //rcupdate=false -> do not modify .bashrc
    ])
  }

  private async runSdkmanInstallScript(
    sdkmanInstallDir: string,
    scriptStr: string
  ): Promise<number> {
    const bashOptions = {
      input: Buffer.from(scriptStr),
      env: {
        SDKMAN_DIR: sdkmanInstallDir
      }
    }

    return await exec.exec('bash', [], bashOptions)
  }

  configureSdkManForAutoAnswer(): void {
    core.info('Configuring SDKMAN! in non interactive mode...')
    const sdkmanConfigFilePath = `${this.installDir}/etc/config`
    const allFileContents = fs.readFileSync(sdkmanConfigFilePath, 'utf-8')

    const newSdkManConfig = allFileContents
      .split(/\r?\n/)
      .map(line => {
        if (line.startsWith('sdkman_auto_answer=')) {
          return 'sdkman_auto_answer=true'
        } else {
          return line
        }
      })
      .join('\n')

    fs.writeFileSync(sdkmanConfigFilePath, newSdkManConfig)
    core.info('Configuring SDKMAN! in non interactive mode - OK')
  }

  uninstall(candidate: string, version: string): void {
    this.runCommand('uninstall', [candidate, version])
  }

  async installCandidate(candidate: Candidate, version: string): Promise<void> {
    await this.runCommand('install', [candidate.getName(), version])

    if (
      this.findAllCandidates().find(file => {
        return file.replace('/', '') === candidate.getName()
      })
    ) {
      core.addPath(`${candidate.getCurrentDir()}/bin`)
    } else {
      throw Error(`Installation of ${candidate} failed`)
    }
  }

  isInstalled(): boolean {
    return fs.existsSync(this.installDir)
  }

  private findAllCandidates(): string[] {
    const candidatesDir = `${this.installDir}/candidates`
    return fs.readdirSync(candidatesDir)
  }

  private async runCommand(cmd: string, params: string[]): Promise<void> {
    const sdkmanCmd = `${cmd} ${params.join(' ')}`
    await exec.getExecOutput('bash', [
      '-c',
      `export SDKMAN_DIR='${this.installDir}' && ` +
        `source ${this.installDir}/bin/sdkman-init.sh && ` +
        `sdk ${sdkmanCmd}`
    ])
  }

  candidatesDir(): string {
    return `${this.installDir}/candidates`
  }
}
