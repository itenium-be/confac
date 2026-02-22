import { build } from 'vite';
import { execSync } from 'child_process';

// Run TypeScript type checking first
console.log('Running TypeScript type check...');
try {
  execSync('npx tsc', { stdio: 'inherit' });
} catch (error) {
  console.error('TypeScript check failed');
  process.exit(1);
}

// Build with Vite
console.log('Building with Vite...');
try {
  await build();
  console.log('Build completed successfully');
} catch (error) {
  console.error('Build failed:', error.message);
  process.exit(1);
}
