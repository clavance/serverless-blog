import 'source-map-support/register'
import { APIGatewayProxyEvent } from 'aws-lambda'
import { CreateTodoRequest } from '../requests/CreateTodoRequest'
import { UpdateTodoRequest } from '../requests/UpdateTodoRequest'
import { getUserId } from '../lambda/utils'
import DBAccess from '../database_logic/services'
import * as uuid from 'uuid'

const dbAccess = new DBAccess()
const todosBucket = process.env.IMAGES_S3_BUCKET

export async function createTodo(event: APIGatewayProxyEvent) {
  const newTodo: CreateTodoRequest = JSON.parse(event.body)

  const todoId = uuid.v4()

  const newItem = {
    todoId: todoId,
    userId: getUserId(event),
    createdAt: new Date(Date.now()).toISOString(),
    done: false,
    attachmentUrl: `https://${todosBucket}.s3.amazonaws.com/${todoId}`,
    ...newTodo
  }

  await dbAccess.addTodoDB(newItem)
  return newItem
}


export async function deleteTodo (event: APIGatewayProxyEvent) {
  const todoId = event.pathParameters.todoId
  const userId = getUserId(event)
  return await dbAccess.deleteTodoDB(todoId, userId)
}


export async function getTodos (event: APIGatewayProxyEvent) {
  const userId = getUserId(event);
  return await dbAccess.getTodosDB(userId)
}


export async function updateTodo (event: APIGatewayProxyEvent) {
  const todoId = event.pathParameters.todoId
  const userId = getUserId(event);
  const updatedTodo: UpdateTodoRequest = JSON.parse(event.body)
  await dbAccess.updateTodoDB(todoId, userId, updatedTodo)
  return true
}

export async function generateUploadUrl (event: APIGatewayProxyEvent) {
  const todoId = event.pathParameters.todoId
  const userId = getUserId(event)
  return await dbAccess.updateUrlDB(todoId, userId)
}
//
