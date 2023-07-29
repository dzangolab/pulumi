import { interpolate } from "@pulumi/pulumi";

import { getConfig } from "./config";
/* eslint-disable-next-line node/no-unpublished-import */
import { GithubRunnerRole } from "../../../src/aws/githubRunnerRole";

export = async () => {
  const config = await getConfig();

  const role = new GithubRunnerRole(config.name, {
    awsAccountId: config.awsAccountId,
    awsRegion: config.awsRegion,
    repo: config.repo,
  });

  return {
    arn: interpolate`${role.arn}`,
    createDate: interpolate`${role.createDate}`,
    id: interpolate`${role.id}`,
    policyArn: interpolate`${role.policyArn}`,
  };
};
