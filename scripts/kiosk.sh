#!/bin/bash

# --- Kiosk Script ---

# Define the full path to your app directory
APP_DIR="/home/rich/Documents/unsplash-photo-frame"

# --- THIS IS THE FIX ---
# Change the working directory to the 'backend' folder.
# This ensures node server.js finds the .env file.
cd "$APP_DIR/backend"

# Start the node server, now that we are in the correct directory.
# Log files will still be written to the 'scripts' folder
# using the absolute path.
node server.js > "$APP_DIR/scripts/node.log" 2>&1 &
# --- End of fix ---


# Wait for the server to start (5 seconds is usually safe)
sleep 5

# Start unclutter to hide the mouse
# (Make sure you have run 'sudo apt install unclutter')
unclutter -idle 1 &

# Launch Luakit (the config file we made earlier will make it fullscreen)
luakit http://localhost:3000 > "$APP_DIR/scripts/luakit.log" 2>&1