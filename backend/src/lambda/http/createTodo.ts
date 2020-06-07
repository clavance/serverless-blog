import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'
import { createTodo } from '../../business_logic/services'
import { CreateTodoRequest } from '../../requests/CreateTodoRequest'
import { createLogger } from '../../utils/logger'

const logger = createLogger('todo')

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {

  const checkItem: CreateTodoRequest = JSON.parse(event.body)

  if (!checkItem.name) {
    logger.error('Please enter a string for the Todo item!')
  return {
      statusCode: 400,
      body: JSON.stringify({
        error: 'name is empty'
      })
    }
  }

  const newItem = await createTodo(event)

  logger.info(`Creating Todo item: ${newItem}`)

  return {
    statusCode: 201,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    },
    body: JSON.stringify({
      item: newItem
    })
  }
}
