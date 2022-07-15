import * as cdk from "@aws-cdk/core";
import * as lambda from "@aws-cdk/aws-lambda";

import { StageProps } from "../config";

import ServiceLamnda from "./service";

export interface LambdaMap {
	readonly service: lambda.Function;
	readonly [key: string]: lambda.Function;
}

export default (
	scope: cdk.Construct,
	stage: StageProps,
	envs: Record<string, string>,
): LambdaMap => ({
	service: new ServiceLamnda(scope, stage, envs).fn,
});
