import * as pkg from "../package.json";

//
// aws config
//

interface AWSProps {
	account: string;
	region: string;
}

export const aws: AWSProps = {
	account: process.env.AWS_ACCOUNT_ID || "",
	region: process.env.AWS_REGION || "eu-west-2",
};

//
// api config
//

interface APIProps {
	readonly name: string;
	readonly version: string;
	readonly aws: AWSProps;
}

export const api: APIProps = {
	name: pkg.name,
	version: pkg.version,
	aws,
};

//
// lambda config
//

interface LambdaProps {
	readonly memorySize: number;
	readonly timeout: number;
	readonly reservedConcurrentExecutions?: number;
	readonly isTracingOn: boolean;
	readonly isProfilingOn: boolean;
	readonly logRetentionDays: number;
}

const lambda: LambdaProps = {
	memorySize: 128,
	reservedConcurrentExecutions: 10,
	timeout: 3,
	isTracingOn: true,
	isProfilingOn: true,
	logRetentionDays: 0,
};

//
//
//

export interface DLQProps {
	readonly maxReceiveCount: number;
	readonly retentionPeriod: number;
	readonly queueUrl?: string;
}

export interface SQSProps {
	readonly queueName: string;
	readonly visibilityTimeout: number;
	readonly receiveMessageWaitTime: number;
	readonly fifo: boolean;
	readonly retentionPeriod: number;
	readonly deliveryDelay: number;
	readonly queueUrl?: string;
	readonly dlq: DLQProps;
	readonly batchSize: number;
}

const sqs: SQSProps = {
	queueName: "events-queue",
	visibilityTimeout: 30,
	receiveMessageWaitTime: 20,
	fifo: false,
	retentionPeriod: 43200,
	deliveryDelay: 360,
	batchSize: 1,
	dlq: {
		maxReceiveCount: 1,
		retentionPeriod: 86400,
	},
};

//
// stage configuration
//

export interface StageProps {
	readonly id: (resource?: string, stageIn?: boolean) => string;
	readonly name: string;
	readonly api: APIProps;
	readonly aws: AWSProps;
	readonly lambda: LambdaProps;
	readonly sqs: SQSProps;
	readonly userPoolArn: string;
	readonly lambdaLayerArn: string;
}

//
// helper
//

const setResourceId =
	(apiName: string, stage: string) =>
	(resource?: string, stageIn = true) =>
		[apiName, resource, stageIn && stage].filter((el) => !!el).join("-");

//
// STAGES
//

export enum Stages {
	Dev = "dev",
	Prod = "prod",
}

//
// dev
//

const dev: StageProps = {
	id: setResourceId(api.name, Stages.Dev),
	name: Stages.Dev,
	api,
	aws: { ...aws },
	lambda: {
		...lambda,
		logRetentionDays: 7,
	},
	sqs: { ...sqs },
	userPoolArn: `arn:aws:cognito-idp:${aws.region}:${aws.account}:userpool/eu-west-2_im3oeW9MF`,
	lambdaLayerArn: `arn:aws:lambda:${aws.region}:${aws.account}:layer:kamoa-utils-layer-lambda:9`,
};

//
// prod
//

const prod: StageProps = {
	...dev,
	id: setResourceId(api.name, Stages.Prod),
	name: Stages.Prod,
	userPoolArn: `arn:aws:cognito-idp:${aws.region}:${aws.account}:userpool/eu-west-2_ZYJ4d76Ga`,
	lambdaLayerArn: `arn:aws:lambda:${aws.region}:${aws.account}:layer:kamoa-utils-layer-lambda:2`,
};

//
// export as an array of stages
//

type StageType = { [key in Stages]: StageProps };

export const stages: StageType = { dev, prod };

//
// define a high level interface for config
//

export interface ConfigProps {
	readonly stages: StageType;
}
