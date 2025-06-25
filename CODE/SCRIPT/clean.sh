#!/bin/bash

cd ../
yarn cache clean
rm -f CLIENT/package-lock.json
rm -f SERVER/package-lock.json
rm -f CLIENT/yarn.lock
rm -f SERVER/yarn.lock
rm -rf CLIENT/dist
rm -rf SERVER/dist
rm -rf CLIENT/node_modules
rm -rf SERVER/node_modules
read -p "Press any key to continue..."
