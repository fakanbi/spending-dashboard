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

// Define subscription services and their fixed monthly prices
const subscriptions = [
  { merchant: 'Netflix', amount: 15.49 },
  { merchant: 'Spotify', amount: 11.99 },
  { merchant: 'Hulu', amount: 7.99 },
  { merchant: 'Disney+', amount: 13.99 },
  { merchant: 'Amazon Prime', amount: 14.99 }
];

// Define rent amount (fixed for the year)
const RENT_AMOUNT = 1850.00;

// Generate realistic transactions
const transactions = [];
const startDate = new Date('2026-01-01');
const endDate = new Date('2026-12-31');

// Track which subscriptions have been added each month to avoid duplicates
const subscriptionsAdded = new Set();

// Loop through each day of the year
for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
  const currentDate = new Date(d);
  const dateStr = currentDate.toISOString().split('T')[0];
  const dayOfMonth = currentDate.getDate();
  const monthKey = `${currentDate.getFullYear()}-${currentDate.getMonth()}`;
  
  // ---- 1. RENT: Always on the 1st of each month ----
  if (dayOfMonth === 1) {
    transactions.push({
      date: dateStr,
      category: 'Rent',
      merchant: 'Property Management Inc.',
      amount: RENT_AMOUNT,
      isEssential: true
    });
  }
  
  // ---- 2. UTILITIES: Once per month, random day between 5th and 15th ----
  if (dayOfMonth === faker.number.int({ min: 5, max: 15 })) {
    // Only add utilities once per month (track by monthKey)
    const utilKey = `util-${monthKey}`;
    if (!subscriptionsAdded.has(utilKey)) {
      subscriptionsAdded.add(utilKey);
      const utilAmount = faker.number.float({ 
        min: 100, 
        max: 200, 
        fractionDigits: 2 
      });
      transactions.push({
        date: dateStr,
        category: 'Utilities',
        merchant: faker.helpers.arrayElement(['PG&E', 'Water Works', 'City Utilities']),
        amount: utilAmount,
        isEssential: true
      });
    }
  }
  
  // ---- 3. SUBSCRIPTIONS: Once per month, random day between 10th and 20th ----
  if (dayOfMonth === faker.number.int({ min: 10, max: 20 })) {
    // Pick 2-3 random subscriptions per month
    const numSubscriptions = faker.number.int({ min: 2, max: 3 });
    const shuffledSubs = faker.helpers.shuffle(subscriptions);
    const selectedSubs = shuffledSubs.slice(0, numSubscriptions);
    
    selectedSubs.forEach(sub => {
      const subKey = `${sub.merchant}-${monthKey}`;
      if (!subscriptionsAdded.has(subKey)) {
        subscriptionsAdded.add(subKey);
        transactions.push({
          date: dateStr,
          category: 'Entertainment',
          merchant: sub.merchant,
          amount: sub.amount,
          isEssential: false
        });
      }
    });
  }
  
  // ---- 4. GROCERIES: 2-3 times per week (random days) ----
  // 30% chance of grocery shopping on any given day
  if (faker.number.float() < 0.30 && dayOfMonth !== 1) {
    // Avoid groceries on the 1st (rent day)
    const amount = faker.number.float({ min: 30, max: 250, fractionDigits: 2 });
    transactions.push({
      date: dateStr,
      category: 'Groceries',
      merchant: faker.helpers.arrayElement(merchantMap['Groceries']),
      amount: amount,
      isEssential: true
    });
  }
  
  // ---- 5. DINING: 1-2 times per week (random days) ----
  if (faker.number.float() < 0.20 && dayOfMonth !== 1) {
    const amount = faker.number.float({ min: 8, max: 80, fractionDigits: 2 });
    transactions.push({
      date: dateStr,
      category: 'Dining',
      merchant: faker.helpers.arrayElement(merchantMap['Dining']),
      amount: amount,
      isEssential: false
    });
  }
  
  // ---- 6. TRANSPORT: 3-4 times per week (random days) ----
  if (faker.number.float() < 0.40 && dayOfMonth !== 1) {
    const amount = faker.number.float({ min: 10, max: 120, fractionDigits: 2 });
    transactions.push({
      date: dateStr,
      category: 'Transport',
      merchant: faker.helpers.arrayElement(merchantMap['Transport']),
      amount: amount,
      isEssential: false
    });
  }
  
  // ---- 7. SHOPPING: 1-2 times per month (random days) ----
  if (faker.number.float() < 0.08 && dayOfMonth !== 1) {
    const amount = faker.number.float({ min: 15, max: 200, fractionDigits: 2 });
    transactions.push({
      date: dateStr,
      category: 'Shopping',
      merchant: faker.helpers.arrayElement(merchantMap['Shopping']),
      amount: amount,
      isEssential: false
    });
  }
  
  // ---- 8. HEALTHCARE: 1 time per month (random day) ----
  if (dayOfMonth === faker.number.int({ min: 20, max: 28 })) {
    const healthcareKey = `health-${monthKey}`;
    if (!subscriptionsAdded.has(healthcareKey)) {
      subscriptionsAdded.add(healthcareKey);
      const amount = faker.number.float({ min: 10, max: 150, fractionDigits: 2 });
      transactions.push({
        date: dateStr,
        category: 'Healthcare',
        merchant: faker.helpers.arrayElement(merchantMap['Healthcare']),
        amount: amount,
        isEssential: true
      });
    }
  }
}

// Sort transactions by date
transactions.sort((a, b) => a.date.localeCompare(b.date));

// Write to data.json
fs.writeFileSync('data.json', JSON.stringify(transactions, null, 2));

console.log(`Generated ${transactions.length} transactions`);
console.log('Saved to data.json');

// Preview the first 10 transactions
console.log('\nSample transactions (first 10):');
console.log(transactions.slice(0, 10));

// Summary by category
console.log('\nSummary by category:');
const summary = {};
transactions.forEach(t => {
  summary[t.category] = (summary[t.category] || 0) + 1;
});
console.log(summary);