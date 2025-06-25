#!/bin/bash

npm install --global yarn
npm upgrade --global yarn
bash yarn_install.sh
cd ../
cd SERVER/bash
bash install.sh
cd ../../CLIENT/bash
bash install.sh
cd ../../ADMIN/bash
bash install.sh
cd ../../
read -p "Press any key to continue..."
