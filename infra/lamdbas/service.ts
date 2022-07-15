import * as cdk from "@aws-cdk/core";
import * as lambda from "@aws-cdk/aws-lambda";

import { StageProps } from "../config";

//
//
//

export default class ServiceLambda extends cdk.Construct {
	public readonly fn: lambda.Function;

	constructor(
		scope: cdk.Construct,
		stage: StageProps,
		envs: Record<string, string>,
	) {
		super(scope, "service-lambda");

		this.fn = new lambda.Function(scope, stage.id("service"), {
			runtime: lambda.Runtime.NODEJS_16_X,
			handler: "index.handler",
			code: lambda.Code.fromAsset("build/src"),
			functionName: stage.id("service"),
			memorySize: stage.lambda.memorySize,
			timeout: cdk.Duration.seconds(stage.lambda.timeout),
			tracing: stage.lambda.isTracingOn
				? lambda.Tracing.ACTIVE
				: undefined,
			description: "lambda to provide a service blablabla",
			logRetention: stage.lambda.logRetentionDays,
			environment: {
				...envs,
			},
		});
	}
}
