#!/bin/bash

# GitHub Pages Deployment Script
# This script helps test and validate the build for GitHub Pages deployment

set -e

echo "🚀 LFC Legal Consultancy - GitHub Pages Deployment Helper"
echo "=================================================="
echo ""

# Check Node.js version
NODE_VERSION=$(node -v)
echo "✓ Node.js version: $NODE_VERSION"

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm not found. Please install Node.js and npm."
    exit 1
fi

NPM_VERSION=$(npm -v)
echo "✓ npm version: $NPM_VERSION"
echo ""

# Navigate to client directory
cd client

echo "📦 Installing dependencies..."
npm install --legacy-peer-deps || npm install

echo ""
echo "🔨 Building for GitHub Pages..."
npm run build

echo ""
echo "✓ Build completed successfully!"
echo ""
echo "📂 Build output location: client/dist/"
echo ""
echo "🧪 To preview locally:"
echo "   npm run preview"
echo ""
echo "📤 To deploy:"
echo "   git add ."
echo "   git commit -m 'Build for GitHub Pages'"
echo "   git push origin master"
echo ""
echo "🌍 Your app will be available at:"
echo "   https://charles191911919199191919191.github.io/LFC-LAWFIRM-demo/"
echo ""
echo "⏱️  Deployment typically takes 1-2 minutes"
echo "✓ Monitor progress in GitHub Actions tab"
