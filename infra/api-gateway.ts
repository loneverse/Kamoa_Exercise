import * as cdk from "@aws-cdk/core";
import * as apigw from "@aws-cdk/aws-apigateway";
import * as lambda from "@aws-cdk/aws-lambda";
import * as cognito from "@aws-cdk/aws-cognito";

import { StageProps } from "./config";

//
//
//

interface Services {
	lambdaFn: lambda.Function;
	method: string;
	path: string;
}

export default class ApiGateway extends cdk.Construct {
	constructor(scope: cdk.Construct, stage: StageProps, services: Services[]) {
		super(scope, stage.id("apigw-integration"));

		const mainApi = apigw.RestApi.fromRestApiAttributes(
			this,
			stage.id("main-api"),
			{
				restApiId: cdk.Fn.importValue(
					`exp-kamoa-shared-infra-apiId-${stage.name}`,
				),
				rootResourceId: cdk.Fn.importValue(
					`exp-kamoa-shared-infra-apiRootResourceId-${stage.name}`,
				),
			},
		);

		const userPool = cognito.UserPool.fromUserPoolArn(
			this,
			"userpool",
			stage.userPoolArn,
		);

		const auth = new apigw.CognitoUserPoolsAuthorizer(
			this,
			"cognitoauthorizer-events",
			{
				cognitoUserPools: [userPool],
			},
		);

		const api = new apigw.Resource(this, stage.id("apigw-resource"), {
			parent: mainApi.root,
			pathPart: "service",
			defaultMethodOptions: {
				authorizationType: apigw.AuthorizationType.COGNITO,
				authorizer: auth,
			},
		});

		services.map((service) => {
			api.addResource(service.path).addMethod(
				service.method,
				new apigw.LambdaIntegration(service.lambdaFn),
			);
		});
	}
}
