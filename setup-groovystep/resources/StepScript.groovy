abstract class StepScript extends Script {

  String envFileName = System.getenv("GITHUB_ENV")
  File envFile = new File(envFileName)

  String outFileName = System.getenv("GITHUB_OUT")
  File outFile = new File(outFileName)

  static String eol = System.lineSeparator()

  def addEnv = { String k, String v ->
    println "adding $k, $v to GITHUB_ENV"
    appendToKeyValueFile(envFile, k, v)
  }

  def addOut = { String k, String v ->
    println "adding $k, $v to GITHUB_OUT"
    appendToKeyValueFile(outFile, k, v)
  }

  static void appendToKeyValueFile(File file, String key, String value) {
    def row = "$key=$value$eol"
    file.append(row)
  }

  def run() {
      def result = runScript()
      println "env file after"
      println envFile.text

      println "out file after"
      println outFile.text

      return result
  }

  abstract def runScript()

}
