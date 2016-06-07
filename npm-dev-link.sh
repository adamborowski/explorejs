#!/usr/bin/env bash
e=explorejs-common
cd src/common
npm link
cd ../client
npm link ${e}

cd ../explorejs-lib
npm link ${e}

cd ../server
npm link ${e}

cd ../explorejs-lib
npm link
cd ../client
npm link explorejs