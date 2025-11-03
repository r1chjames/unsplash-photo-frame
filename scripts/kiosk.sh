#!/bin/bash

# Wait for the network to be ready
sleep 15

# REQUIRED: Change this to the full path of your app
cd /home/rich/Documents/unsplash-photo-frame

# Start the server in the background
node backend/server.js &

# Wait for the server to start
sleep 5

# Run unclutter in the background to hide the mouse after 1 sec
unclutter -idle 1 &

# Launch Chromium
luakit http://localhost:3000