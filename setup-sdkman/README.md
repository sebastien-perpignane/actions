# Setup SDKMAN!

The setup-sdkman action allows to bring SDKMAN! in GitHub Actions runners. 
Using SDKMAN, you can install and manage parallel versions of multiple Software Development Kits. For more details, see: [SDKMAN! official website](https://sdkman.io/)

# Usage:

  - `sdkman-install-dir`: (_optional_) if you want to decide where sdkman will be installed. Default path is  &lt;user directory&gt;/sdkman_gh_actions .


# Examples

We have a script named MyScript.groovy at the root of our repository. To run it in a workflow :

```yaml
steps:
    - uses: sebastien-perpignane/actions/setup-groovy@main
      with:
        groovy-version: '4.0.13'

    - name: Run groovy script
      shell: bash
      run: groovy MyScript.groovy
```

It is also possible to compile your Groovy script:

```yaml
steps:
    - uses: sebastien-perpignane/actions/setup-groovy@main
      with:
        groovy-version: '4.0.13'

    - name: Compile groovy 
      shell: bash
      run: groovyc MyScript.groovy

    - name: Display result
      shell: bash
      run: ls .  # output: MyScript.groovy MyScript.class
```
