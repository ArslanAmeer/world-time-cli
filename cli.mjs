#!/usr/bin/env node

import { fileURLToPath } from "url";
import path from "path";
import chalk from "chalk";
import fs from "fs";
import Table from "cli-table3";

// Create __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Define colors based on your portfolio
const colors = {
  no: "#64ffda", // Highlighted text color for numbers (light teal)
  city: "#a3be8c", // Light green for city names
  time: "#b48ead", // Light violet for time
  country: "#64ffda", // Light teal for country name
  border: "#4C566A", // Medium gray for table borders
  margin: "\n", // Add margin between tables
};

// Paths for country data files
const COUNTRY_TIMEZONE_FILE = path.join(__dirname, "countries_timezones.json");

// 1. Get Country Timezones (fetch timezones based on country, case-insensitive)
const getCountryTimezones = (country) => {
  if (!fs.existsSync(COUNTRY_TIMEZONE_FILE)) {
    console.error(chalk.red("Country to timezone mapping file not found."));
    process.exit(1);
  }

  const countryTimezones = JSON.parse(fs.readFileSync(COUNTRY_TIMEZONE_FILE));

  const normalizedCountry = country.toLowerCase();
  const normalizedTimezones = Object.keys(countryTimezones).reduce(
    (acc, key) => {
      acc[key.toLowerCase()] = countryTimezones[key];
      return acc;
    },
    {}
  );

  if (!normalizedTimezones[normalizedCountry]) {
    console.error(
      chalk.red(`No timezones found for ${country}. Please check the country name or try another country.`)
    );
    process.exit(1);
  }

  return normalizedTimezones[normalizedCountry];
};

// 2. Show time for a specific country
const showTimeForCountry = async (country, isFirstCountry = false) => {
  console.log(`Fetching time for ${country}...`);

  try {
    const timezones = getCountryTimezones(country);

    // Add a margin before the first table
    if (isFirstCountry) {
      console.log(colors.margin); // Add space before the first table
    }

    // Create a table with thick borders and matching colors
    const table = new Table({
      head: [
        chalk.hex(colors.no).bold("No"), // Light teal for headers
        chalk.hex(colors.city).bold("City"), // Light green for headers
        chalk.hex(colors.time).bold("Time"), // Light violet for headers
      ],
      style: {
        head: ["cyan"], // Default style
        border: [], // No border color in cli-table3, but chars will have color
      },
      chars: {
        top: chalk.hex(colors.border)("═"),
        "top-mid": chalk.hex(colors.border)("╤"),
        "top-left": chalk.hex(colors.border)("╔"),
        "top-right": chalk.hex(colors.border)("╗"),
        bottom: chalk.hex(colors.border)("═"),
        "bottom-mid": chalk.hex(colors.border)("╧"),
        "bottom-left": chalk.hex(colors.border)("╚"),
        "bottom-right": chalk.hex(colors.border)("╝"),
        left: chalk.hex(colors.border)("║"),
        "left-mid": chalk.hex(colors.border)("╟"),
        mid: chalk.hex(colors.border)("─"),
        "mid-mid": chalk.hex(colors.border)("┼"),
        right: chalk.hex(colors.border)("║"),
        "right-mid": chalk.hex(colors.border)("╢"),
        middle: chalk.hex(colors.border)("│"),
      },
    });

    // Populate the table with timezones and human-readable times
    timezones.forEach((timezone, index) => {
      const currentTime = new Date().toLocaleString("en-US", {
        timeZone: timezone,
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "numeric",
        minute: "numeric",
        second: "numeric",
        hour12: true,
      });

      // Extract city name from timezone (e.g., America/Toronto -> Toronto)
      const cityName = timezone.split("/")[1].replace("_", " "); // Replace _ with space for better readability

      // Add a row to the table with portfolio colors
      table.push([
        chalk.hex(colors.no).bold(index + 1), // No (light teal)
        chalk.hex(colors.city)(cityName), // City (light green)
        chalk.hex(colors.time)(currentTime), // Time (light violet)
      ]);
    });

    // Styled country output
    const styledCountry = chalk.hex(colors.country).bold(country.toUpperCase()); // Light teal for country name
    const styledText = chalk.bold(`Current time for ${styledCountry}:`);

    console.log(colors.margin + styledText); // Add margin before and print country title
    console.log(table.toString()); // Display the custom table

    // Add margin after each table
    console.log(colors.margin); // Add a blank line after each country's table
  } catch (error) {
    console.error(`Error fetching time for ${country}.`, error);
  }
};

// 3. Show time for popular countries
const showPopularCountriesTime = async () => {
  console.log(chalk.green("Displaying popular countries and their times..."));

  const popularCountries = [
    "United States",
    "United Kingdom",
    "Pakistan",
    "Australia",
    "Canada",
    "Germany",
  ];

  for (const country of popularCountries) {
    await showTimeForCountry(country, true); // Ensure we wait for each country's time to be displayed
  }

  process.exit(0); // Exit after showing times
};

// 4. Show time for all countries
const showAllCountriesTime = async () => {
  console.log(chalk.blue("Displaying all countries and their times..."));

  // Load the country timezones
  const countryTimezones = JSON.parse(fs.readFileSync(COUNTRY_TIMEZONE_FILE));

  // Create a Set to track processed timezones to avoid duplicates
  const processedCountries = new Set();

  // Loop through all country names and codes in the file
  for (const [countryNameOrCode, timezones] of Object.entries(
    countryTimezones
  )) {
    // Skip if this set of timezones has already been processed
    const timezoneKey = JSON.stringify(timezones);
    if (processedCountries.has(timezoneKey)) {
      continue;
    }

    // Mark this set of timezones as processed
    processedCountries.add(timezoneKey);

    // Display the time for the current country (name or code)
    await showTimeForCountry(countryNameOrCode);
  }

  process.exit(0); // Exit after displaying all times
};

// 5. Show supported countries list
const showSupportedCountries = () => {
  console.log(chalk.hex("#64ffda").bold("\nSupported Countries:\n"));
  console.log(chalk.green.bold("wtime <country name/country code>:\n"));
  try {
    // Use fs to read JSON file synchronously instead of dynamic import
    const countryTimezones = JSON.parse(
      fs.readFileSync(COUNTRY_TIMEZONE_FILE)
    );
    const countryList = Object.keys(countryTimezones);

    // Loop through and print each country
    countryList.forEach((country) => {
      console.log(chalk.hex("#a3be8c")(country));
    });

    console.log("\n");
  } catch (error) {
    console.error(chalk.red("Error loading countries list."));
  }
};

// 6. Parse CLI arguments manually
const args = process.argv.slice(2);
const command = args[0];
const country = args[1];

// Handle different commands
switch (command) {
  case "help":
    console.log(chalk.hex("#64ffda").bold("\nAvailable Commands:\n"));
    console.log(
      chalk.hex("#64ffda")(
        "1. wtime <country>: Show the time for a specific country."
      )
    );
    console.log(
      chalk.hex("#64ffda")(
        "2. wtime --all: Show the time for all available countries."
      )
    );
    console.log(
      chalk.hex("#64ffda")(
        "3. wtime list: List all available countries supported by the CLI."
      )
    );
    console.log("\n");
    break;

  case "list":
    showSupportedCountries();
    break;

  case "--all":
    showAllCountriesTime();
    break;

  default:
    if (command) {
      showTimeForCountry(command);
    } else {
      showPopularCountriesTime();
    }
    break;
}
