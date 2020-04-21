#!/usr/bin/env node

process.env.NODE_NO_WARNINGS = 1;

const { Radish } = require('../lib/index.js');

new Radish();

