#!/bin/bash

LINE="@reboot export DISPLAY=:0 && /Users/rich/Documents/Code/unsplash-photo-display/scripts/kiosk.sh"
(crontab -l 2>/dev/null | grep -F -q "$LINE") || (crontab -l 2>/dev/null ; echo "$LINE") | crontab -