# NextStage Backend

[Candidate Instructions](https://www.notion.so/nextstageai/Backend-Interview-User-Defined-Fields-0c829f607280420f8f3199b5b3596151?pvs=4)


## Getting Started

Run `npm install` in this directory. You can then start the backend using `npm start`.

The server will start on port 4040.

## Prisma
This package uses [Prisma](https://www.prisma.io/docs/orm) as an ORM.

If you need to make changes to the model, you will have to run migrations. To do so, make your changes in [the schema](https://github.com/NextStageAI/nextstage-backend-debug-interview/blob/main/prisma/schema.prisma) and run `npx prisma migrate dev`.

## Tests

You can run tests using `npm run test`.
