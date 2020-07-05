# setup raku [![](https://github.com/skaji/setup-raku/workflows/test/badge.svg)](https://github.com/skaji/setup-raku/actions)

This action sets up a Raku environment for use in [GitHub Actions](https://docs.github.com/en/actions).

# Usage

```yaml
jobs:
  raku:
    strategy:
      matrix:
        os:
          - ubuntu-latest
          - macOS-latest
          - windows-latest
        raku-version:
          - "2020.06"
          - "2020.05.1"
          - "2020.02.1"
          - "2020.01"
          - "2019.11"
    runs-on:
      - ${{ matrix.os }}
    steps:
      - uses: actions/checkout@v2
      - uses: skaji/setup-raku@master
        with:
          raku-version: ${{ matrix.raku-version }}
      - name: raku -V
        run: raku -V
```

# License

MIT
