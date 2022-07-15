import * as cdk from "@aws-cdk/core";

import { StageProps } from "./config";

import lambdas from "./lamdbas/index";
import ApiGateway from "./api-gateway";

export default class Stack extends cdk.Stack {
	constructor(scope: cdk.Construct, stage: StageProps) {
		super(scope, stage.id(), {
			description: "stack for the service",
			stackName: stage.id(),
			tags: {
				Application: stage.api?.name,
				Enviroment: stage.name,
				Version: stage.api?.version,
			},
			env: {
				account: stage.aws.account,
				region: stage.aws.region,
			},
		});

		//
		// lambdas setup
		//

		const envs = {
			STAGE: stage.name,
			REGION: stage.aws.region,
			API: stage.api?.name,
			VERSION: stage.api?.version,
			AWS_NODEJS_CONNECTION_REUSE_ENABLED: "1",
		};

		const svcLambdas = lambdas(this, stage, envs);

		//
		// set the lambdas and create the services
		//

		const services = [
			{
				lambdaFn: svcLambdas.collector,
				method: "POST",
				path: "fetch",
			},
		];

		new ApiGateway(this, stage, services);
	}
}
