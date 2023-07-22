import * as core from '@actions/core'
import * as exec from '@actions/exec'
import * as io from '@actions/io'
import * as fs from 'fs'

export const SDKMAN_DIR = process.cwd() + '/sdkmantest'

async function run(): Promise<void> {
  try {

    let groovyVersion = core.getInput("groovy-version")
    
    let sdkmanInstallDir = core.getInput("sdkman-install-dir")
    if (!sdkmanInstallDir) {
      sdkmanInstallDir = SDKMAN_DIR
    }
    
    let sdkmanExitCode = await installSdkman(sdkmanInstallDir)

    if (sdkmanExitCode) {
      core.setFailed("SDKMAN! installation: KO (error code: " + sdkmanExitCode + ")")
      return
    }

    console.log("SDKMAN! installation: OK")

    await installGroovy(groovyVersion, sdkmanInstallDir)

  } catch (error) {
    if (error instanceof Error) core.setFailed(error.message)
  }
}

function extractGroovyDependencies(): void {
  exec.exec('groovy', ['GrapeDependencies.groovy'])
}

// TODO 

// FIXME: throw error if something goes bad instead of returning exit number
export async function installSdkman(sdkmanInstallDir: string): Promise<number> {
  let curlOutput = await getBashSdkmanInstallationScript()
  let installScriptExitCode = await runSdkmanInstallScript(sdkmanInstallDir, curlOutput.stdout.toString())
  configureSdkManForAutoAnswer(sdkmanInstallDir)
  return installScriptExitCode
}

async function getBashSdkmanInstallationScript(): Promise<exec.ExecOutput> {
  return await exec.getExecOutput('curl', [
    '-s',
    'https://get.sdkman.io?rcupdate=false'
  ])
}

function configureSdkManForAutoAnswer(sdkmanInstallDir: string) {
  console.info("Configuring SDKMAN! in non interactive mode...")
  const sdkmanConfigFilePath = sdkmanInstallDir + '/etc/config'
  const allFileContents = fs.readFileSync(sdkmanConfigFilePath, 'utf-8');
  const newSdkManConfig = allFileContents.split(/\r?\n/).map(line => {
    if (line.startsWith('sdkman_auto_answer=')) {
      return 'sdkman_auto_answer=true'
    }
    else {
      return line
    }
  }).join('\n')
  fs.writeFileSync(sdkmanConfigFilePath, newSdkManConfig)
  console.info("Configuring SDKMAN! in non interactive mode - done")
}

async function runSdkmanInstallScript(sdkmanInstallDir: string, scriptStr: string): Promise<number> {
  const bashOptions = {
    input: Buffer.from(scriptStr),
    env: {
      SDKMAN_DIR: sdkmanInstallDir
    }
  }

  return await exec.exec('bash', [], bashOptions)
}

async function installGroovy(groovyVersion: string, sdkmanInstallDir: string) {
  console.log('Installing groovy...')
  let output = await exec.getExecOutput('bash', [
    '-c',
    "export SDKMAN_DIR='" + sdkmanInstallDir + "' && source " + sdkmanInstallDir + "/bin/sdkman-init.sh && sdk install groovy " + groovyVersion
  ])
  console.log(output)

  console.log('Installing groovy - done')

  let candidatesDir = sdkmanInstallDir + "/candidates"

  fs.readdir(candidatesDir, (err, candidateFiles) => {
    // TODO manage errors
    candidateFiles.forEach((candidateFile) => {
        let candidateDir = candidatesDir + "/" + candidateFile
        let candidateBinDir = candidateDir + "/current/bin"
        if (fs.lstatSync(candidateBinDir).isDirectory() && fs.existsSync(candidateBinDir) ) {
          core.addPath(candidateBinDir)
        }
    })
  })

}

if (require.main === module) {
  run();
}
