#!/bin/bash
set -euo pipefail
# Android sdk should be installed. see: https://v2.tauri.app/start/prerequisites/
export ANDROID_HOME="$HOME/Android/Sdk"
export NDK_HOME="$ANDROID_HOME/ndk/$(ls -1 $ANDROID_HOME/ndk)"
# cargo tauri dev  # run dev project
# cargo tauri android dev
cargo tauri build
# cargo tauri android build --aab

