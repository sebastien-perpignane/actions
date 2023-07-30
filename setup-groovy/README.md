# Setup Groovy

The setup-groovy action allows to bring Groovy in GitHub Actions runners. It relies on SDKMAN to install the Groovy SDK.
If you want to select the java distribution and version that will run your Groovy scripts, use [setup-java](https://github.com/actions/setup-java) action.

# Usage:

  - `groovy-version`: The Groovy version that will be set up. Mandatory input.
  - `sdkman-install-dir`: if you want to decide where sdkman will be installed. Default path is  &lt;user directory&gt;/sdkman_gh_actions .


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

# Next step
- Manage a cache for grape.