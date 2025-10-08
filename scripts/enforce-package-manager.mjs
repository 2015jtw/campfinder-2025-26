#!/usr/bin/env node

import { env, exit } from 'node:process'

const EXPECTED = 'pnpm'
const { npm_execpath, npm_config_user_agent } = env

const agent = npm_config_user_agent?.split('/')?.[0]
const execBin = npm_execpath?.split('/')?.pop()

if (agent && agent.includes(EXPECTED)) {
  exit(0)
}

if (execBin === 'pnpm' || execBin === 'pnpm.cjs') {
  exit(0)
}

const message = `✖ This repository uses pnpm. Please run pnpm install instead.\n`
process.stderr.write(message)
exit(1)
