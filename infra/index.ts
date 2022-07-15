import "source-map-support/register";
import * as cdk from "@aws-cdk/core";

import Stack from "./stack";

import { Stages, stages, aws } from "./config";

//
//
//

(() => {
	const { region, account } = aws;

	const stage = (process.env.STAGE as keyof typeof Stages) || Stages.Dev;

	process.stdout.write("=============================\n");
	process.stdout.write(`ENV/STAGE: stage}\n`);
	process.stdout.write(`AWS_ACCOUNT_ID: ${account}\n`);
	process.stdout.write(`AWS_REGION: ${region}\n`);
	process.stdout.write("=============================\n");

	try {
		const app = new cdk.App();

		const stageConfig = stages[stage as Stages];

		new Stack(app, { ...stageConfig });

		app.synth();
	} catch (error) {
		process.stdout.write(JSON.stringify(error));
	}
})();
