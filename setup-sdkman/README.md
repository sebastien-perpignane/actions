# Setup SDKMAN!

The setup-sdkman action allows to bring SDKMAN! in GitHub Actions runners. 
Using SDKMAN, you can install and manage parallel versions of multiple Software Development Kits. For more details, see: [SDKMAN! official website](https://sdkman.io/)

# Usage:

Inputs:

  - `sdkman-install-dir`: (_optional_) if you want to decide where sdkman will be installed. Default path is  &lt;user directory&gt;/sdkman_gh_actions .

Environment variables

The action automatically exports SDKMAN_DIR environment variable, that is used internally by SDKMAN!.

# Examples

I want to install jmeter to run some load test scenarios in my workflow:

```yaml
steps:
  - uses: 'sebastien-perpignane/actions/setup-sdkman@main'
    with:
      candidate-name: 'jmeter'
      candidate-version: '5.5'
```

It is also possible to use SDKMAN! in bash steps:

```yaml
  steps:
    - name: 'install SDKMAN!'
      uses: 'sebastien-perpignane/actions/setup-sdkman@main'
    - name: 'install SDKs with SDKMAN!'
      shell: bash
      run:|
          # this step is needed to initialize the 'sdk' function in the shell
          # $SDKMAN_DIR environment variable is automatically exported by the action
          source $SDKMAN_DIR/bin/sdkman-init.sh

          # Install SDKs
          sdk install groovy
          sdk install java

          # Use installed SDKs
          groovy -version
          java -version

          #etc

```
