// const authorization = 'Bearer
// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InJvYmVydEBoZXJiZXIubWUiLCJ1c2VySWQiOiI2MDVkZGQ2NmVjYmFiNTAwMWE4OGVkNDgiLCJpYXQiOjE2MTcwMTUzOTd9.274L1srt8l-HGSRoBJLEA7zl2uxln4ZPTJ8vSZjRsGI';

const config = {
  projects: {
    backend: {
      schema: '../simple-anonymous-auth/graphql/schema.graphql',
      documents: ['./components/**/*.tsx'],
      // extensions: {
      //   endpoints: {
      //     default: {
      //       url: 'https://healthcloud.kingstinct.dev/graphql',
      //       // set up .env in same directory with your SCHEDULIST_AUTH_TOKEN
      //       headers: {
      //         // authorization,
      //       },
      //     },
      //   },
      // },
    },
  },
}

module.exports = config
