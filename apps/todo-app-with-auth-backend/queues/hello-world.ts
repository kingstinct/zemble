import { QueueConfig } from "readapt-plugin-bull/utils/setupQueues";

const config: QueueConfig = {
  worker: async (job) => {
    console.log(job.data);
  }
}

export default config