// import { Middleware } from "@readapt/core";
import { Hono } from "hono";

import {Queue} from 'bullmq'
import { createBullBoard } from '@bull-board/api'
import { BullMQAdapter } from '@bull-board/api/bullMQAdapter'
import { FastifyAdapter } from '@bull-board/fastify'
import { ExpressAdapter } from '@bull-board/express'
import { HapiAdapter } from '@bull-board/hapi'
import { KoaAdapter } from '@bull-board/koa'
import NestAdapter from '@bull-board/nestjs'
import redis from "../utils/redis";


// other configurations of your server

const middleware = {
  setup: (app: Hono) => {
    // const serverAdapter = new ExpressAdapter();
    // serverAdapter.setBasePath('/admin/queues');

    // createBullBoard({
    //   queues: [new BullMQAdapter(queueMQ)],
    //   serverAdapter: serverAdapter,
    // });

    // @ts-ignore
    //serverAdapter.registerPlugin(app, { basePath: '/admin/queues' });

    // app.use('/admin/queues', () => serverAdapter.getRouter());
  }
}

export default middleware