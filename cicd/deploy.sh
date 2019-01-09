#! /bin/bash

# Install yarn globally in the codebuild image
npm install -g yarn

# Install required npm packages for running serverless stack, make sure this reflects list of plugins in serverless.yml
npm install -g serverless
npm install \
    "@anttiviljami/serverless-stack-output" \
    serverless-aws-documentation \
    serverless-plugin-typescript \
    serverless-dynamodb-local \
    serverless-offline \
    serverless-secrets-plugin \
    serverless-plugin-include-dependencies

# Deploy serverless stack to specific environment based on env variable set by codebuild project
yarn run deploy:$ENV