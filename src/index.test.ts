import { APIGatewayProxyEventV2, Context } from "aws-lambda";
import { handler } from "./handler";
import fetchMock from "jest-fetch-mock";

// Enable fetch mocks
fetchMock.enableMocks();

// Mock context
const mockContext: Context = {
	callbackWaitsForEmptyEventLoop: false,
	functionVersion: "10",
	functionName: "XXXXXXXXXXXXXXXXXX",
	memoryLimitInMB: "64",
	logGroupName: "/aws/lambda/XXXXXXXXXXXXXXXXXXLambda",
	logStreamName: "2020/10/21/[10]e319c9569d2d47ceb3b63e422e1b7c09",
	invokedFunctionArn:
		"arn:aws:lambda:xxxxxxx:1234567890:function:XXXXXXXXXXXXX:Current",
	awsRequestId: "149d19a7-13da-4cb6-a104-30328f94ca3a",
	getRemainingTimeInMillis: () => 1,
	done: (): void => {},
	fail: (): void => {},
	succeed: (): void => {},
};

// Mock event
const mockEvent: APIGatewayProxyEventV2 = {
	version: "2.0",
	routeKey: "POST /",
	rawPath: "/",
	rawQueryString: "",
	headers: {
		accept: "application/json, */*;q=0.5",
		"accept-encoding": "gzip, deflate",
		"content-length": "627",
		"content-type": "application/json",
		host: "test.execute-api.eu-west-2.amazonaws.com",
		"user-agent": "HTTPie/2.2.0",
		"x-amzn-trace-id": "Root=1-5f90582d-40a913185c30e1cc5b0e3934",
		"x-forwarded-for": "11.11.111.111",
		"x-forwarded-port": "443",
		"x-forwarded-proto": "https",
	},
	requestContext: {
		accountId: "1234567890",
		apiId: "test",
		domainName: "test.execute-api.eu-west-2.amazonaws.com",
		domainPrefix: "test",
		http: {
			method: "POST",
			path: "/",
			protocol: "HTTP/1.1",
			sourceIp: "86.18.106.128",
			userAgent: "HTTPie/2.2.0",
		},
		requestId: "UxK3DjsFrPEEMyQ=",
		routeKey: "POST /",
		stage: "$default",
		time: "21/Oct/2020:15:47:57 +0000",
		timeEpoch: 1603295277092,
	},
	body: '{"foo":"bar"}',
	isBase64Encoded: false,
};

describe("Handler tests", () => {
	beforeEach(() => {
		fetchMock.resetMocks();
	});

	it("Return combined users and posts data", async () => {
		fetchMock.mockResponses(
			[
				JSON.stringify([
					{ id: 1, name: "Ayub Nganga", email: "ayub@example.com" },
				]),
				{ status: 200 },
			],
			[
				JSON.stringify([
					{
						userId: 1,
						id: 1,
						title: "post title",
						body: "This is a good coding excercise",
					},
				]),
				{ status: 200 },
			],
		);

		const response = await handler(mockEvent, mockContext);

		expect(response.statusCode).toBe(200);
		const body = JSON.parse(response.body);
		expect(Array.isArray(body)).toBe(true);
		expect(body.length).toBeGreaterThan(0);
		expect(body[0]).toHaveProperty("id");
		expect(body[0]).toHaveProperty("name");
		expect(body[0]).toHaveProperty("email");
		expect(body[0]).toHaveProperty("posts");
		expect(Array.isArray(body[0].posts)).toBe(true);
		expect(body[0].posts[0]).toHaveProperty("id");
		expect(body[0].posts[0]).toHaveProperty("title");
		expect(body[0].posts[0]).toHaveProperty("body");
	});

	it("should handle errors well", async () => {
		fetchMock.mockRejectOnce(new Error("Failed to fetch"));

		const response = await handler(mockEvent, mockContext);

		expect(response.statusCode).toBe(500);
		const body = JSON.parse(response.body);
		expect(body).toHaveProperty("message", "Internal Server Error");
	});
});
