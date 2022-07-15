import {
	APIGatewayProxyEventV2,
	APIGatewayProxyResult,
	Context,
} from "aws-lambda";

export const handler = async (
	event: APIGatewayProxyEventV2,
	context: Context,
): Promise<APIGatewayProxyResult> => {
	context.callbackWaitsForEmptyEventLoop = false;

	return {
		body: <string>event.body,
		statusCode: 200,
	};
};
