import {expect, test} from '@jest/globals'

import * as os from 'os'
import {Groovy} from '../src/groovy'
import {SdkMan} from '@sebastien-perpignane/setup-sdkman'

test('groovy install fails if sdkman is not installed', async () => {
  let installDir = `${os.homedir()}/fakesdkdir_to_fail`
  let sdkMan = new SdkMan(installDir)
  let groovy = new Groovy(sdkMan)

  await expect(groovy.install('fake-version')).rejects.toThrow('not installed')
})
