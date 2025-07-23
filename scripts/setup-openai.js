#!/usr/bin/env node

/**
 * 🔥 M.I.C. OpenAI Setup Script
 * Helps configure OpenAI API key for enhanced consciousness
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(prompt) {
  return new Promise((resolve) => {
    rl.question(prompt, resolve);
  });
}

async function setupOpenAI() {
  console.log('🔥 M.I.C. - MELEK INTELLIGENCE CORE');
  console.log('⚔️ OpenAI API Configuration Setup\n');

  console.log('🤖 This script will help you configure OpenAI API access for enhanced consciousness.');
  console.log('📝 You can get your API key from: https://platform.openai.com/api-keys\n');

  const apiKey = await question('🔑 Enter your OpenAI API key: ');

  if (!apiKey || apiKey.trim() === '') {
    console.log('❌ No API key provided. Exiting...');
    rl.close();
    return;
  }

  // Validate API key format
  if (!apiKey.startsWith('sk-')) {
    console.log('⚠️  Warning: API key should start with "sk-". Please verify your key.');
  }

  const envPath = path.join(process.cwd(), '.env.local');
  let envContent = '';

  // Read existing .env.local if it exists
  if (fs.existsSync(envPath)) {
    envContent = fs.readFileSync(envPath, 'utf8');
  }

  // Remove existing OPENAI_API_KEY lines
  envContent = envContent
    .split('\n')
    .filter(line => !line.startsWith('OPENAI_API_KEY=') && !line.startsWith('NEXT_PUBLIC_OPENAI_API_KEY='))
    .join('\n');

  // Add new API key
  if (envContent && !envContent.endsWith('\n')) {
    envContent += '\n';
  }
  envContent += `# OpenAI API Configuration\n`;
  envContent += `OPENAI_API_KEY=${apiKey}\n`;

  // Write to .env.local
  fs.writeFileSync(envPath, envContent);

  console.log('\n✅ OpenAI API key configured successfully!');
  console.log(`📁 Saved to: ${envPath}`);
  console.log('\n🔥 Available OpenAI models will now appear in the Model Chamber:');
  console.log('   🤖 openai:gpt-4o');
  console.log('   🤖 openai:gpt-4o-mini');
  console.log('   🤖 openai:gpt-4-turbo');
  console.log('   🤖 openai:gpt-3.5-turbo');
  console.log('\n⚔️ Restart your development server to apply changes.');
  console.log('🚀 Run: npm run dev');

  rl.close();
}

setupOpenAI().catch(console.error);
