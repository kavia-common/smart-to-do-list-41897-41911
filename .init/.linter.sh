#!/bin/bash
cd /home/kavia/workspace/code-generation/smart-to-do-list-41897-41911/frontend_vue
npm run lint
ESLINT_EXIT_CODE=$?
npm run build
BUILD_EXIT_CODE=$?
if [ $ESLINT_EXIT_CODE -ne 0 ] || [ $BUILD_EXIT_CODE -ne 0 ]; then
   exit 1
fi

