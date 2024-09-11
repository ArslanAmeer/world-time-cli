<h1 align="center">
World Time CLI
</h1>

<p align="center" float="left">
     <img src="./wtime.png" alt="wtime" width="450">
</p>


`world-time-cli` is a simple yet handy Node.js command-line tool that allows you to quickly fetch the current time for various countries worldwide without needing an internet search. Whether you're looking for the time in a specific country, popular regions, or all supported countries, this CLI makes it easy and fun to check the time right from your terminal.

Designed with developers in mind, `world-time-cli` is a convenient and accessible tool for those who spend a lot of time in the terminal. It's a fun, quick way to avoid switching contexts and stay productive while working on code!


## Features
- **Popular Countries**: Displays the current time for major countries like the USA, UK, China, Australia, and more.
- **Specific Country Time**: Fetches the current time for any specific country by name or country code (case-insensitive).
- **All Countries**: View the current time for all supported countries using the `wtime all` command.
- **Supported Country List**: Easily list all countries supported by the CLI with the `wtime list` command.
- **Comprehensive Help**: Detailed help with the `wtime help` command.

## Installation

To install the `world-time-cli` globally, use npm:

```bash
npm install -g world-time-cli
```

## Usage

Once installed, use the following commands to interact with the CLI:

### Show Time for Popular Countries

```bash
wtime
```

This command will display the current time for popular countries such as the USA, UK, India, Australia, and Canada.

### Show Time for a Specific Country

```bash
wtime <country>
```

You can specify the country by its name or country code (case-insensitive). For example:

```bash
wtime USA
wtime UK
```

#### Sample Output:
```
Current time for USA:
╔════╤═════════════╤═══════════════════════════════════════════╗
║ No │ City        │ Time                                      ║
╟────┼─────────────┼───────────────────────────────────────────╢
║ 1  │ New York    │ Tuesday, September 10, 2024 at 7:23:35 PM ║
╟────┼─────────────┼───────────────────────────────────────────╢
║ 2  │ Chicago     │ Tuesday, September 10, 2024 at 6:23:35 PM ║
╟────┼─────────────┼───────────────────────────────────────────╢
║ 3  │ Denver      │ Tuesday, September 10, 2024 at 5:23:35 PM ║
╟────┼─────────────┼───────────────────────────────────────────╢
║ 4  │ Los Angeles │ Tuesday, September 10, 2024 at 4:23:35 PM ║
╚════╧═════════════╧═══════════════════════════════════════════╝
```

### Show Time for All Countries

```bash
wtime all
```

This command will display the current time for all supported countries.

### List Supported Countries

```bash
wtime list
```

Displays a list of all the countries supported by `world-time-cli`.

### Help Command

For a comprehensive guide on available commands, use:

```bash
wtime help
```

## Roadmap

- **City Filter**: Add city filter to fetch time for specific city.

## License

This project is licensed under the [MIT License](https://opensource.org/licenses/MIT). You are free to use, modify, and distribute this package, provided that you include the copyright notice and the license text. For more information, please see the [LICENSE](./LICENSE) file.

## Author

`world-time-cli` is developed and maintained by [Arslan Ameer](https://github.com/arslanameer). If you have any questions or need help, feel free to open an issue on the [GitHub repository](https://github.com/ArslanAmeer/world-time-cli/issues).

## Contributing

Contributions to world-time-cli are welcome and greatly appreciated! If you would like to contribute, please follow these steps:

1. Fork the repository on GitHub.
2. Clone your fork and create a new branch for your changes.
3. Commit and push your changes to your fork.
4. Create a Pull Request on the original repository, describing your changes and referencing any related issues.

Your contributions will be reviewed and, if approved, merged into the main repository.

Thank you for your interest in contributing to world-time-cli!

---
