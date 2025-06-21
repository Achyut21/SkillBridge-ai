#!/bin/bash
# Script to kill processes on common development ports

echo "🧹 Clearing development ports..."
echo "================================"

for port in {3000..3005}; do
    pid=$(lsof -ti:$port 2>/dev/null)
    if [ ! -z "$pid" ]; then
        kill -9 $pid 2>/dev/null
        echo "✅ Killed process on port $port (PID: $pid)"
    else
        echo "⚪ Port $port is already free"
    fi
done

echo "================================"
echo "✨ All ports cleared!"
echo ""
echo "You can now run: npm run dev"
echo "The server should start on port 3000"
