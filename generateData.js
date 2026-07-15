// generateData.js
const { faker } = require('@faker-js/faker');
const fs = require('fs');

// Set seed for reproducible data
faker.seed(123);

// Define categories
const categories = [
  'Groceries',
  'Dining',
  'Rent',
  'Entertainment',
  'Transport',
  'Utilities',
  'Shopping',
  'Healthcare'
];

// Define merchants by category for realism
const merchantMap = {
  'Groceries': ['Whole Foods', 'Trader Joe\'s', 'Safeway', 'Kroger', 'Aldi', 'Costco'],
  'Dining': ['Chipotle', 'Starbucks', 'McDonald\'s', 'The Cheesecake Factory', 'Panera', 'Local Bistro'],
  'Rent': ['Property Management Inc.', 'Landlord LLC', 'Apartment Complex'],
  'Entertainment': ['Netflix', 'Spotify', 'AMC Theaters', 'Ticketmaster', 'Hulu', 'Disney+'],
  'Transport': ['Uber', 'Lyft', 'Shell Gas', 'BP', 'City Metro', 'Parking Garage'],
  'Utilities': ['PG&E', 'Water Works', 'City Utilities', 'AT&T', 'Comcast'],
  'Shopping': ['Amazon', 'Target', 'Walmart', 'Best Buy', 'Nordstrom', 'Etsy'],
  'Healthcare': ['CVS Pharmacy', 'Walgreens', 'Doctor\'s Office', 'Dental Clinic', 'Health Insurance']
};

// Generate 365 transactions
const transactions = [];
const startDate = new Date('2026-01-01');

for (let i = 0; i < 365; i++) {
  const date = new Date(startDate);
  date.setDate(date.getDate() + i);
  
  // Choose a random category
  const category = faker.helpers.arrayElement(categories);
  
  // Get merchants for that category
  const merchants = merchantMap[category];
  const merchant = faker.helpers.arrayElement(merchants);
  
  // Generate amount based on category
  let amount;
  switch (category) {
    case 'Rent':
      amount = faker.number.float({ min: 1200, max: 2500, fractionDigits: 2 });
      break;
    case 'Utilities':
      amount = faker.number.float({ min: 50, max: 300, fractionDigits: 2 });
      break;
    case 'Groceries':
      amount = faker.number.float({ min: 30, max: 250, fractionDigits: 2 });
      break;
    case 'Dining':
      amount = faker.number.float({ min: 8, max: 80, fractionDigits: 2 });
      break;
    case 'Entertainment':
      amount = faker.number.float({ min: 5, max: 60, fractionDigits: 2 });
      break;
    case 'Transport':
      amount = faker.number.float({ min: 10, max: 120, fractionDigits: 2 });
      break;
    case 'Shopping':
      amount = faker.number.float({ min: 15, max: 200, fractionDigits: 2 });
      break;
    case 'Healthcare':
      amount = faker.number.float({ min: 10, max: 150, fractionDigits: 2 });
      break;
    default:
      amount = faker.number.float({ min: 5, max: 500, fractionDigits: 2 });
  }
  
  transactions.push({
    date: date.toISOString().split('T')[0], // YYYY-MM-DD format
    category: category,
    merchant: merchant,
    amount: amount,
    // Add a random "essentials" flag for bonus filtering
    isEssential: ['Rent', 'Utilities', 'Groceries', 'Healthcare'].includes(category)
  });
}

// Write to data.json
fs.writeFileSync('data.json', JSON.stringify(transactions, null, 2));

console.log(`Generated ${transactions.length} transactions`);
console.log('Saved to data.json');

// Preview the first 3 transactions
console.log('\n Sample transactions:');
console.log(transactions.slice(0, 3));