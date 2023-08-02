import * as exec from '@actions/exec'
import * as fs from 'fs'
import * as core from '@actions/core'

import * as os from 'os'

export const SDKMAN_DIR = `${os.homedir()}/sdkman_gh_actions`

export class SdkMan {
  // download url for sdkman -> https://api.sdkman.io/2/broker/download/groovy/4.0.13/linux
  // the url redirects the http client to the real download url of the candidate

  constructor(private installDir: string = SDKMAN_DIR) {}

  async installSdkMan(): Promise<number> {
    const installScriptAsString = await this.getBashSdkmanInstallationScript()
    const installScriptExitCode = await this.runSdkmanInstallScript(
      installScriptAsString
    )
    this.configureSdkManForAutoAnswer()
    core.exportVariable('SDKMAN_DIR', this.installDir)
    return installScriptExitCode
  }

  private async getBashSdkmanInstallationScript(): Promise<string> {
    core.startGroup(
      'Downloading SDKMAN bash install script :right_arrow_curving_down:'
    )

    const execOutput = await exec.getExecOutput('curl', [
      '-s',
      'https://get.sdkman.io?rcupdate=false' //rcupdate=false -> do not modify .bashrc
    ])

    core.endGroup()

    return execOutput.stdout
  }

  private async runSdkmanInstallScript(scriptStr: string): Promise<number> {
    const bashOptions = {
      input: Buffer.from(scriptStr),
      env: {
        SDKMAN_DIR: this.installDir
      }
    }

    core.startGroup('Running SDKMAN installation script')

    const cmdExitCode = await exec.exec('bash', [], bashOptions)

    core.endGroup()

    return cmdExitCode
  }

  configureSdkManForAutoAnswer(): void {
    core.startGroup('Configuring SDKMAN! in non interactive mode')
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

    core.info(`New SDKMAN config:\n${newSdkManConfig}`)

    fs.writeFileSync(sdkmanConfigFilePath, newSdkManConfig)
    core.endGroup()
  }

  async uninstall(
    candidate: string,
    version: string,
    force = false
  ): Promise<void> {
    const params = [candidate, version]
    if (force) {
      params.push('--force')
    }

    await this.runCommand('uninstall', params)
  }

  async installCandidateAndAddToPath(
    candidate: string,
    version: string
  ): Promise<void> {
    core.startGroup(`Installing ${candidate} ${version}...`)

    await this.runCommand('install', [candidate, version])

    const candidateCurrentDir = this.candidateCurrentDir(candidate)

    core.endGroup()

    if (fs.existsSync(candidateCurrentDir)) {
      core.addPath(`${this.candidateCurrentDir(candidate)}/bin`)
      core.info(`Installing ${candidate} ${version}: OK`)
    } else {
      throw Error(`Installation of ${candidate} failed`)
    }
  }

  private candidateDir(candidate: string): string {
    return `${this.candidatesDir()}/${candidate}`
  }

  private candidateCurrentDir(candidate: string): string {
    return `${this.candidateDir(candidate)}/current`
  }

  private candidateVersionDir(candidate: string, version: string): string {
    return `${this.candidateDir(candidate)}/${version}`
  }

  isInstalled(): boolean {
    return fs.existsSync(this.installDir)
  }

  isCandidateInstalled(candidate: string): boolean {
    return fs.existsSync(this.candidateDir(candidate))
  }

  isCandidateVersionInstalled(candidate: string, version: string): boolean {
    return fs.existsSync(this.candidateVersionDir(candidate, version))
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

async function run(): Promise<void> {
  try {
    let sdkmanInstallDir = core.getInput('sdkman-install-dir')
    if (!sdkmanInstallDir) {
      sdkmanInstallDir = SDKMAN_DIR
    }

    const sdkMan = new SdkMan(sdkmanInstallDir)
    if (!sdkMan.isInstalled()) {
      const sdkmanExitCode = await sdkMan.installSdkMan()
      if (sdkmanExitCode) {
        core.setFailed(
          `SDKMAN! installation: KO (error code: ${sdkmanExitCode})`
        )
        return
      }
      core.info('SDKMAN! installation: OK')
      core.setOutput('sdkman_install_dir', sdkmanInstallDir)
    }

    const candidateName = core.getInput('candidate-name')

    if (candidateName) {
      const candidateVersion = core.getInput('candidate-version', {
        required: true
      })
      sdkMan.installCandidateAndAddToPath(candidateName, candidateVersion)
    }
  } catch (error) {
    if (error instanceof Error) core.setFailed(error.message)
  }
}

if (require.main === module) {
  run()
}
