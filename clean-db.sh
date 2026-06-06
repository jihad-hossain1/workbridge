#!/bin/bash

# Set working directory to the project directory
CWD="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"
cd "$CWD"

# Check if .env file exists and export environment variables
if [ -f .env ]; then
  # Load .env file
  export $(grep -v '^#' .env | xargs)
fi

if [ -z "$DATABASE_URL" ]; then
  echo "Error: DATABASE_URL environment variable is not defined and .env file was not found."
  exit 1
fi

echo "Pruning all MongoDB collections in database..."

node -e "
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const models = [
    'activityLog',
    'notification',
    'attachment',
    'comment',
    'task',
    'projectMember',
    'project',
    
  ];
  
  for (const model of models) {
    try {
      console.log(\`Clearing \${model}...\`);
      const res = await prisma[model].deleteMany({});
      console.log(\`Deleted \${res.count} records from \${model}.\`);
    } catch (err) {
      console.error(\`Failed to clear \${model}: \`, err.message);
    }
  }
  console.log('All collections have been cleaned successfully.');
}

main()
  .catch((e) => {
    console.error('Purge error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.\$disconnect();
  });
"
