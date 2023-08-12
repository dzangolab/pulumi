import { interpolate, Output } from "@pulumi/pulumi";

import { getConfig } from "./config";
/* eslint-disable-next-line node/no-unpublished-import */
import { GithubActionsRole } from "../../../src/aws/githubActionsRole";

export = async () => {
  const config = await getConfig();

  console.log(config);

  const role = new GithubActionsRole(config.name, {
    githubIdentityProviderArn: config.githubIdentityProviderArn,
    githubRepos: config.githubRepos as string[],
    policyArns: config.policyArns,
  });

  return {
    arn: interpolate`${role.arn}`,
    createDate: interpolate`${role.createDate}`,
    id: interpolate`${role.id}`,
  };
};
