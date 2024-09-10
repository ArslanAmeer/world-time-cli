#!/usr/bin/env node

import { Command } from 'commander';
import chalk from 'chalk';
import fs from 'fs';
import path from 'path';
import ora from 'ora';

// Create an instance of the Command class
const program = new Command();

// Paths for timezone and country data files
const TIMEZONE_FILE = path.join(path.resolve(), 'timezones.json');
const COUNTRY_TIMEZONE_FILE = path.join(path.resolve(), 'countries_timezones.json');

// 2. Fetching Timezones from the API (only if necessary)
const fetchTimezones = async () => {
  const spinner = ora('Fetching timezones...').start();
  try {
    const response = await axios.get('http://worldtimeapi.org/api/timezone');
    const timezones = response.data;
    // Save timezones to a local file
    fs.writeFileSync(TIMEZONE_FILE, JSON.stringify(timezones, null, 2));
    spinner.succeed('Timezones fetched and saved locally!');
  } catch (error) {
    spinner.fail('Failed to fetch timezones.');
    console.error(error);
  }
};

// 3. Get Timezones (from file or fetch new)
const getTimezones = () => {
  if (fs.existsSync(TIMEZONE_FILE)) {
    const data = fs.readFileSync(TIMEZONE_FILE);
    return JSON.parse(data);
  } else {
    console.log('Timezones file not found, fetching new data...');
    fetchTimezones();
  }
};

// 5. Get Country Timezones (fetch timezones based on country, case-insensitive)
const getCountryTimezones = (country) => {
  if (!fs.existsSync(COUNTRY_TIMEZONE_FILE)) {
    console.error(chalk.red('Country to timezone mapping file not found.'));
    process.exit(1);
  }

  const countryTimezones = JSON.parse(fs.readFileSync(COUNTRY_TIMEZONE_FILE));

  // Convert the input to lowercase to make the search case-insensitive
  const normalizedCountry = country.toLowerCase();

  // Create a normalized lookup object with lowercase keys
  const normalizedTimezones = Object.keys(countryTimezones).reduce((acc, key) => {
    acc[key.toLowerCase()] = countryTimezones[key];
    return acc;
  }, {});

  // Check if the normalized country name exists
  if (!normalizedTimezones[normalizedCountry]) {
    console.error(chalk.red(`No timezones found for ${country}. Please check the country name or try another country.`));
    process.exit(1);
  }

  return normalizedTimezones[normalizedCountry];
};

// 6. Show time for a specific country
const showTimeForCountry = async (country) => {
  const spinner = ora(`Fetching time for ${country}...`).start();

  try {
    const timezones = getCountryTimezones(country);
    
    // Manually create a list with a count starting from 1 and extract the city name
    const results = timezones.map((timezone, index) => {
      const currentTime = new Date().toLocaleString('en-US', {
        timeZone: timezone,
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric',
        hour12: true
      });

      // Extract city name from timezone (e.g., America/Toronto -> Toronto)
      const cityName = timezone.split('/')[1].replace('_', ' '); // Replace _ with space for better readability

      // Return a clean row
      return {
        // No: index + 1, // Start with 1
        City: cityName, // Show only the city name
        Time: currentTime // Human-readable time
      };
    });

    // Styled country output
    const styledCountry = chalk.bold.blueBright(country.toUpperCase());
    const styledText = chalk.bold(`Current time for ${styledCountry}:`);

    spinner.succeed(styledText);
    console.table(results); // Display the table without styled text
  } catch (error) {
    spinner.fail(`Error fetching time for ${country}.`);
    console.error(error);
  }
};



// 7. Show time for popular countries (you can customize this logic to show specific countries)
const showPopularCountriesTime = async () => {
  console.log(chalk.green('Displaying popular countries and their times...'));

  const popularCountries = ['United States', 'United Kingdom', 'India', 'Australia', 'Canada'];

  for (const country of popularCountries) {
    await showTimeForCountry(country); // Ensure we wait for each country's time to be displayed
  }

  process.exit(0); // Exit after showing times
};

// 8. Show time for all countries
const showAllCountriesTime = async () => {
  console.log(chalk.blue('Displaying all countries and their times...'));
  
  const countryTimezones = JSON.parse(fs.readFileSync(COUNTRY_TIMEZONE_FILE));
  
  // Loop through all countries in the file and display their timezones
  for (const country in countryTimezones) {
    await showTimeForCountry(country); // Ensure each country is displayed in sequence
  }
  
  process.exit(0); // Exit after displaying all times
};

// CLI Command Definition
program
  .name('wtime')
  .description('Show time for popular countries, all countries, or a specific country')
  .option('--all', 'Show time for all countries')
  .option('--refresh', 'Refresh the timezones from the API')
  .argument('[country]', 'Show time for a specific country')
  .action((country, options) => {
    if (options.all) {
      showAllCountriesTime();  // Corrected function call
    } else if (options.refresh) {
      refreshTimezones();
    } else if (country) {
      showTimeForCountry(country);
    } else {
      showPopularCountriesTime();
    }
  });

program.parse(process.argv);
