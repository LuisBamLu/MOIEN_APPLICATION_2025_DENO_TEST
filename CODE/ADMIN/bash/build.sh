#!/bin/bash

cd ../
yarn run build
rsync -av --delete dist/ ../SERVER/dist/public/admin/