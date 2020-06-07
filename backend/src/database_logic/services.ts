import * as AWS from 'aws-sdk';
import * as AWSXRay from 'aws-xray-sdk';
import { DocumentClient } from 'aws-sdk/clients/dynamodb';

// implement distributed tracing
const XAWS = AWSXRay.captureAWS(AWS)
const s3 = new XAWS.S3({ signatureVersion: 'v4' })

export default class DBAccess {
  constructor(
      private readonly docClient: DocumentClient = new XAWS.DynamoDB.DocumentClient(),
      private readonly todosTable = process.env.BLOG_TABLE,
      private readonly userIdIndex = process.env.USER_ID_INDEX,
      private readonly todosBucket = process.env.IMAGES_S3_BUCKET,
      private readonly urlExpiration = parseInt(process.env.SIGNED_URL_EXPIRATION)

  ){}

async addTodoDB(newItem) {
  await this.docClient.put({
    TableName: this.todosTable,
    Item: newItem
  }).promise()
}

async deleteTodoDB(todoId, userId) {
  await this.docClient.delete({
    Key: {
      todoId,
      userId
    },
    TableName: this.todosTable
  }).promise()
}

async getTodosDB(userId) {
  // use QUERY, not SCAN
  const result = await this.docClient.query({
    TableName: this.todosTable,
    IndexName: this.userIdIndex,
    KeyConditionExpression: 'userId = :userId',
    ExpressionAttributeValues: {
        ':userId': userId
    }
  }).promise()

  return result.Items
}

async updateUrlDB (todoId, userId) {
    const signedUrl = s3.getSignedUrl('putObject', {
      Bucket: this.todosBucket,
      Key: todoId,
      Expires: this.urlExpiration
    })

    await this.docClient.update({
        TableName: this.todosTable,
        Key: {
            todoId,
            userId
        },
        UpdateExpression: 'set attachmentUrl = :r',
        ExpressionAttributeValues: {
            ':r': `https://${this.todosBucket}.s3.amazonaws.com/${todoId}`
        },
        ReturnValues: "UPDATED_NEW"
    }).promise()

    return signedUrl
}


async updateTodoDB (todoId, userId, updatedTodo) {
    await this.docClient.update({
        TableName: this.todosTable,
        Key: {
            todoId,
            userId
        },
        UpdateExpression: 'set #name = :n, #dueDate = :due, #done = :d',
        ExpressionAttributeValues: {
            ':n': updatedTodo.name,
            ':due': updatedTodo.dueDate,
            ':d': updatedTodo.done
        },
        ExpressionAttributeNames: {
            '#name': 'name',
            '#dueDate': 'dueDate',
            '#done': 'done'
        }
    }).promise();
  }
}
