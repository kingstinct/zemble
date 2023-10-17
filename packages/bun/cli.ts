#!/usr/bin/env bun --hot

import cliRunner from '@zemble/core/cli-runner'

import bunRunner from './runner'

void cliRunner(bunRunner)
