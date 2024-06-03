import {
	APIGatewayProxyEventV2,
	APIGatewayProxyResult,
	Context,
} from "aws-lambda";

export const handler = async (
	_: APIGatewayProxyEventV2, // underscore to indicate unused parameter
	context: Context,
): Promise<APIGatewayProxyResult> => {
	context.callbackWaitsForEmptyEventLoop = false;

	try {
		// Fetch users from jsonplaceholder
		const usersResponse = await fetch(
			"https://jsonplaceholder.typicode.com/users",
		);
		const users = await usersResponse.json();

		// Fetch posts from jsonplaceholder
		const postsResponse = await fetch(
			"https://jsonplaceholder.typicode.com/posts",
		);
		const posts = await postsResponse.json();

		// Combine users and posts
		const combinedData = users.map((user: any) => {
			return {
				id: user.id,
				name: user.name,
				email: user.email,
				posts: posts
					.filter((post: any) => post.userId === user.id)
					.map((post: any) => ({
						id: post.id,
						title: post.title,
						body: post.body,
					})),
			};
		});

		console.log("Combined Data:", combinedData);

		return {
			statusCode: 200,
			body: JSON.stringify(combinedData),
		};
	} catch (error) {
		console.error(error);
		return {
			statusCode: 500,
			body: JSON.stringify({ message: "Internal Server Error" }),
		};
	}
};
