#!/usr/bin/env node

const config = require('./babel.config.json');

require('@babel/register')(
  Object.assign({}, config, {
    extensions: ['.tsx', '.ts', '.jsx', '.js'],
  })
);

require('./src/main');
