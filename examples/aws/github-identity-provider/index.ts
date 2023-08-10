import { interpolate } from "@pulumi/pulumi";

import { getConfig } from "./config";
/* eslint-disable-next-line node/no-unpublished-import */
import { GithubIdentityProvider } from "../../../src/aws/githubIdentityProvider";

export = async () => {
  const config = await getConfig();

  const provider = new GithubIdentityProvider(config.name, {
    ecrArns: config.ecrArns,
    repos: config.repos,
  });

  return {
    arn: interpolate`${provider.arn}`,
    id: interpolate`${provider.id}`,
    tagsAll: interpolate`${provider.tagsAll}`,
  };
};
