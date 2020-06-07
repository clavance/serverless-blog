# Full-stack Serverless Web Blog

This repository implements a simple web blog using AWS Lambda and Serverless framework, with a React client. A user can create an account with the application or log in with a third party account, eg. Google. They can then create, remove, update, and fetch blog posts they have created, and upload images to any items in their blog post.

This application will allow creating/removing/updating/fetching blog post. Each blog post can optionally have an attachment image, which will be stored in an Amazon S3 Bucket. A user can only upload images to their own blog posts, and this is implemented using signed URLs. Each user also only has access to blog posts that he/she has created. Each user has to authenticate their login by creating an account or logging in with a third party account such as Google, which is done via Auth0, using JWT tokens. An infrastructure as code approach is taken, with all AWS configuration found in the serverless.yml found.

# Demo

A user can click on the login button:

![](assets/1.png?raw=true)

The user can then log in through Auth0:

![](assets/2.png?raw=true)

With a third-party login, the user is directed to authorise Auth0 to access certain resources in their account:
![](assets/3.png?raw=true)

Logging in for the first time, the user has no posts. The user cannot access the posts of other users:
![](assets/4.png?raw=true)

A user can make a new blog post and upload an image to the corresponding post.
  The date at which the post is made is also added.
![](assets/5.png?raw=true)

For distributed tracing, AWS X-Ray has been enabled:
![](assets/6.png?raw=true)




# Backend
## Features
This aim of this application is largely to demonstrate the use of AWS, including:
* API Gateway, AWS Lambda and DynamoDB
    * Our REST API is implemented with API Gateway. API Gateway receives HTTP requests, and depending on the type of request, these are passed on to different AWS Lambda functions. Lambda functions receive HTTP requests as events (containing the type of request, body, headers).
    * Depending on the request, the relevant AWS resources are further triggered, eg. when a user first creates an account, a user ID is created in DynamoDB, and when a user logs back in, their previously created items are retrieved through a DynamoDB query.
* Serverless
    * [Serverless Application Framework](https://github.com/serverless/serverless) was used to demonstrate familiarity with an Infrastructure as Code approach to DevOps. The AWS configurations for the application are found in `backend/serverless.yml`, and can be entirely deployed using the command `sls deploy -v`. Note that this requires AWS credentials and IAM roles to be set up to allow deployment by Serverless.
* Authentication
    * Authentication is implemented via Auth0, with asymmetrically encrypted JWT tokens. A user can log in with a third party account, eg. Google Accounts, and a user ID will be created in the relevant AWS DynamoDB table.
* Logging
    * A [Winston](https://github.com/winstonjs/winston) logger is used to output log statements, to assist with debugging and maintenance of the application.
* Distributed tracing
    * AWS X-Ray is enabled to allow the user to view an entire map of the application system, to see how a request propogates through the system. As the application becomes increasingly complex, this becomes more useful in identifying how different parts of the system interact with each other, finding sources of errors, performance bottlenecks, etc.
* Architecture
    * A key challenge with building serverless applications is vendor lock-in. Each architecture design involves [significant trade-offs](https://martinfowler.com/articles/oss-lockin.html). Thus, we employ a [hexagonal architecture](https://en.wikipedia.org/wiki/Hexagonal_architecture_(software)), ensuring loose coupling of the components in our application. The `src/business_logic` directory houses the code relating to the business functions of the application, and the `src/database_logic` directory contains the code relating to accessing and deploying database resources.
    * So, for example, if we wish to migrate from DynamoDB to another database provider, this can be achieved without severely breaking the code.

# Frontend

The `client` folder contains the React web application that can deployed with the backend API.

The configurations for the frontend have been done in the `config.ts` file in the `client` folder. It contains an API endpoint and Auth0 configuration:

```ts
const apiId = '...' API Gateway id
export const apiEndpoint = `https://${apiId}.execute-api.us-east-1.amazonaws.com/dev`

export const authConfig = {
  domain: '...',    // Domain from Auth0
  clientId: '...',  // Client id from an Auth0 application
  callbackUrl: 'http://localhost:3000/callback'  // Add this callback URL to Auth0
}
```

# Deployment Instructions

## Backend

To deploy the backend:

```
cd backend
npm i
sls deploy -v
```

## Frontend

To deploy the frontend:

```
cd client
npm i
npm run start
```

# Credits

This project was completed as part of the Udacity Cloud Developer Nanodegree.
