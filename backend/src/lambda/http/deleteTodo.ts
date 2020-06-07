import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'
import { deleteTodo } from '../../business_logic/services'
import { createLogger } from '../../utils/logger'

const logger = createLogger('todo')

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {

  await deleteTodo(event)
  logger.info(`Deleting Todo item ID: ${event.pathParameters.todoId}`)

  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    },
    body: "item successfully deleted"
  }
}
