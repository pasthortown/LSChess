#!/bin/bash
ng build --base-href "http://desarrollo.lschess/" --prod
rm -R ./../ClientBuild/
cp -R ./dist/client/ ./../ClientBuild/
