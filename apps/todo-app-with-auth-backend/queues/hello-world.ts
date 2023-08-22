import { QueueConfig } from "@readapt/core/utils/setupQueues";


/*
const helloWorldQueue = new Queue('hello-world', {
  connection: redis,
  settings: {

  }
});

const worker = new Worker('hello-world', async (job) => {
  console.log(job.data);
}, {
  autorun: false,
  connection: redis,
})

worker.run()*/

const config: QueueConfig = {
  worker: async (job) => {
    console.log(job.data);
  }
}

export default config