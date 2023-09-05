# setup raku [![](https://github.com/Raku/setup-raku/workflows/test/badge.svg)](https://github.com/Raku/setup-raku/actions)

This action sets up a Raku environment for use in [GitHub Actions](https://docs.github.com/en/actions).

# Usage

See [action.yml](action.yml) for the details.

Basic:

```yaml
jobs:
  raku:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: Raku/setup-raku@v1  # By default, this sets up the latest rakudo
```

Matrix:

```yaml
jobs:
  raku:
    strategy:
      matrix:
        os:
          - ubuntu-latest
          - macos-latest
          - windows-latest
        raku-version:
          - "2020.06"
          - "2020.05.1"
          - "2020.02.1"
          - "2020.01"
          - "2019.11"
    runs-on: ${{ matrix.os }}
    steps:
      - uses: actions/checkout@v4
      - uses: Raku/setup-raku@v1
        with:
          raku-version: ${{ matrix.raku-version }}
```

# FAQ

## What raku-versions are available?

Try this command:

```console
curl -s https://rakudo.org/dl/rakudo | jq -r '. [] | select( .platform != "src" ) | .ver' | sort -r | uniq
```

# License

MIT
