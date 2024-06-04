# kamoa tech exercise

1 - pick up 2 endpoints from  https://jsonplaceholder.typicode.com/,

2 - orchestrate both calls in a single lambda and return the payload with a javascritp object (you can pick the props to return at your will)

3 - create the necessary tests to prove the integration is working and the lambda is returning a JSON


## Implementation

The Lambda function is implemented in TypeScript and follows these steps:

1. Fetches users from the `https://jsonplaceholder.typicode.com/users` endpoint.
2. Fetches posts from the `https://jsonplaceholder.typicode.com/posts` endpoint.
3. Combines the users and posts data by matching the `userId` property of posts with the `id` property of users.
4. Returns a JSON payload containing the combined data.

The Lambda function is defined in the `handler.ts` file.

## Testing

The tests cover the following scenarios:

1. Successful execution of the Lambda function, ensuring that the returned JSON payload has the expected structure and data.
2. Error handling, verifying that the Lambda function returns an appropriate error response when an error occurs during execution.


## Setup

1. Clone the repository:

   ```bash
   git clone https://github.com/loneverse/Kamoa_Exercise.git

2. Install the dependencies:

`cd Kamoa_Exercise`

`npm install`

3. Run the App

`npm run test`

