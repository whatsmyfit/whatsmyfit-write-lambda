# WhatsMyFit Write Lambda functions
[![dependencies Status](https://david-dm.org/whatsmyfit/whatsmyfit-write-lambda/status.svg)](https://david-dm.org/whatsmyfit/whatsmyfit-write-lambda)
[![devDependencies Status](https://david-dm.org/whatsmyfit/whatsmyfit-write-lambda/dev-status.svg)](https://david-dm.org/whatsmyfit/whatsmyfit-write-lambda?type=dev)
[![Known Vulnerabilities](https://snyk.io/test/github/whatsmyfit/whatsmyfit-write-lambda/badge.svg?targetFile=package.json)](https://snyk.io/test/github/whatsmyfit/whatsmyfit-write-lambda?targetFile=package.json)

### Install Serverless CLI and Serverless DynamoDB local
[Serverless CLI doc](https://serverless.com/framework/docs/providers/aws/cli-reference/) might be helpful
```(bash)
$ npm i serverless -g
$ yarn install
$ sls dynamodb install
```

### Run lambda functions locally with local DynamoDB
- [serverless-offline plugin](https://www.npmjs.com/package/serverless-offline) and [serverless-plugin-typescript](https://www.npmjs.com/package/serverless-plugin-typescript) are used.
- We use [serverless-dynamodb-local](https://github.com/99xt/serverless-dynamodb-local) plugin to run DynamoDB locally. See also example [serverless-react-boilerplate](https://github.com/99xt/serverless-react-boilerplate)
- When you run `sls offline start` DynamoDB will be started locally and seeded according to the `serverless.yml` configuration. Visit DynamoDB Shell at http://localhost:8000/shell

```(bash)
$ sls offline start --stage dev
```

Open [http://localhost:3000]( http://localhost:3000) in web browser

### Serverless workflow
Read [Workflow](https://serverless.com/framework/docs/providers/aws/guide/workflow/) for recommendation on CI/CD workflow

### TSLint
```(bash)
$ yarn run lint
```

### Run tests locally
```(bash)
# Run unit and integration tests
$ yarn run build-test:all

# Run unit tests only
$ yarn run build-test:unit

# Run integration tests only, remember to run sls offline start --stage dev upfront
$ yarn run build-test:integration
```

### Debug with serverless-offline in Intellij
- Set breakpoints in Typescript code
- Setup new `Node.js` run configuration with **Application Parameters**: `/usr/local/bin/sls offline start`
- Press the Debug-button

### Turn on serverless debug log
````(bash)
$ export SLS_DEBUG=*
````

### Swagger doc for APIs
We use [serverless-aws-documentation](https://github.com/deliveryhero/serverless-aws-documentation#readme) plugin for documenting API Gateway endpoint.

### Add/modify secrets
We use [serverless-aws-secrets](https://github.com/serverless/serverless-secrets-plugin) for adding secrets as encrypted values in environment variables.

- NOTE 1! **Only encrypted secret files shall be commited to GIT**
- NOTE 2! **You need to make sure that you have decrypted secret file locally before deploying the service to AWS**

```(bash)
# Decrypt secrets and add/modify variables/secrets
$ serverless decrypt --stage dev --password '<insert encryption password>'

# Encrypt secrets
$ serverless encrypt --stage dev --password '<insert encryption password>'
```

### AWS Account
- To deploy lambda function to AWS you need an AWS account and an IAM user that has following permissions:
  - `AWSLambdaFullAccess`
  - `IAMFullAccess` (it might be possible to narrow access rights)
  - AWS Api Gateway full access (create inline policy)
  - AWS Cloud Formation full access (create inline policy)
- Make sure to install [AWS CLI](https://aws.amazon.com/cli/) on your machine

### CICD with AWS Codepipeline

#### Simple
To setup simple Continuous Integration/Continuous Deployment with AWS Codepipeline follow steps below:
1. Read the sls blog post [CICD for Serverless Part 2 - AWS CodePipeline Integration](https://serverless.com/blog/cicd-for-serverless-part-2/)
2. Follow the steps in [codePipeline.md](https://github.com/nerdguru/serverlessTodos/blob/master/docs/codePipeline.md), note that AWS console has changed a bit since the README was written
3. Add `buildspec.yml` file

#### Advanced
To setup more advanced pipeline with unit and integration testing and staging to production stages follow steps below:
1. Read steps in following Serverless CI/CD Tutorial: 
[Part 1: Build](https://www.1strategy.com/blog/2018/02/27/serverless-cicd-tutorial-part-1-build/), 
[Part 2: Test](https://www.1strategy.com/blog/2018/03/06/serverless-cicd-tutorial-part-2-test/) 
[Part 3: Deploy](https://www.1strategy.com/blog/2018/03/13/serverless-cicd-tutorial-part-3-deploy/)

#### Useful links:
- [Build Specification Reference for AWS CodeBuild](https://docs.aws.amazon.com/codebuild/latest/userguide/build-spec-ref.html)
- [Docker Images Provided by AWS CodeBuild](https://docs.aws.amazon.com/codebuild/latest/userguide/build-env-ref-available.html)
- [AWS CodeBuild curated Docker images](https://github.com/aws/aws-codebuild-docker-images)

#### To test and debug CodeBuild locally
1. Read [Test and Debug Locally with the AWS CodeBuild Agent](https://docs.aws.amazon.com/codebuild/latest/userguide/use-codebuild-agent.html)
1. Download [codebuild_build.sh](https://github.com/aws/aws-codebuild-docker-images/blob/master/local_builds/codebuild_build.sh) in current folder
1. `git clone https://github.com/aws/aws-codebuild-docker-images.git`
1. `cd ubuntu/nodejs/10.14.1/`
1. `docker build -t aws/codebuild/nodejs:10.14.1 .`
1. `./codebuild_build.sh -i "aws/codebuild/nodejs:10.14.1" -a "./codebuild"`

You can also ssh into the CodeBuild docker image to debug and run build steps manually with
`docker run -it -v whatsmyfit-write-lambda:/whatsmyfit-write-lambda aws/codebuild/nodejs:10.14.1 /bin/bash`

### Check for outdated NPM dependencies
```(bash)
$ yarn outdated
```
