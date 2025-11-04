#!/bin/bash

# --- Kiosk Script ---

# Define the full path to your app directory
APP_DIR="/home/rich/Documents/unsplash-photo-frame"

# Start the node server in the background
# We will log all output (and errors) to a file for debugging
node "$APP_DIR/backend/server.js" > "$APP_DIR/scripts/node.log" 2>&1 &

# Wait for the server to start (5 seconds is usually safe)
sleep 5

# Start unclutter to hide the mouse
unclutter -idle 1 &

# Launch Luakit (the config file we made earlier will make it fullscreen)
luakit http://localhost:8080