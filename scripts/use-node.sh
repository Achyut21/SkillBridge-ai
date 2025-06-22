#!/bin/bash

# Check if nvm is loaded
if ! command -v nvm &> /dev/null; then
    echo "Loading nvm..."
    export NVM_DIR="$HOME/.nvm"
    [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
fi

# Switch to Node 24.2.0
echo "Switching to Node 24.2.0..."
nvm use 24.2.0

echo "Current Node version:"
node -v

echo "Current npm version:"
npm -v
