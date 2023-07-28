import { aws } from "@dzangolab/pulumi";
import { interpolate } from "@pulumi/pulumi";

import { getConfig } from "./config";

export = async () => {
  const config = await getConfig();

  const role = new aws.GithubRunnerRole(config.name, {
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
