// Script to update package.json with Cloudinary dependency
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Path to package.json
const packageJsonPath = path.join(__dirname, 'package.json');

// Read package.json
try {
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
  
  // Check if cloudinary is already in dependencies
  if (!packageJson.dependencies.cloudinary) {
    console.log('Adding cloudinary dependency to package.json...');
    
    // Add cloudinary dependency
    packageJson.dependencies.cloudinary = '^1.41.0';
    
    // Write updated package.json
    fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
    
    console.log('package.json updated successfully.');
    console.log('Installing cloudinary dependency...');
    
    // Run npm install
    execSync('npm install', { stdio: 'inherit' });
    
    console.log('\nCloudinary dependency installed successfully!');
    console.log('\nPlease check CLOUDINARY_SETUP.md for setup instructions.');
  } else {
    console.log('Cloudinary dependency is already in package.json.');
    console.log('Please check CLOUDINARY_SETUP.md for setup instructions.');
  }
} catch (error) {
  console.error('Error updating package.json:', error);
  process.exit(1);
} 