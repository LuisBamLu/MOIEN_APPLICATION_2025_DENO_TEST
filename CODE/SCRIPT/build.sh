#!/bin/bash

set -x
cd ../
cd SERVER/bash
bash build.sh
cd ../../CLIENT/bash
bash build.sh
cd ../../ADMIN/bash
bash build.sh
cd ../../
read -p "Press any key to continue..."