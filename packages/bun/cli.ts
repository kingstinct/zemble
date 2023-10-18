#!/usr/bin/env bun --hot

import cliRunner from '@zemble/core/cli-runner'

import bunRunner from './serve'

void cliRunner(bunRunner)
