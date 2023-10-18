#!/usr/bin/env ts-node-dev

import cliRunner from '@zemble/core/cli-runner'

import nodeRunner from './serve'

void cliRunner(nodeRunner)
