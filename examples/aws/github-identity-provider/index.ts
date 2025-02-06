import { interpolate } from "@pulumi/pulumi";

import { getConfig } from "./config";
/* eslint-disable-next-line n/no-unpublished-import */
import { GithubIdentityProvider } from "../../../src/aws/githubIdentityProvider";

export = async () => {
  const config = await getConfig();

  const provider = new GithubIdentityProvider(config.name, {});

  return {
    arn: interpolate`${provider.arn}`,
    id: interpolate`${provider.id}`,
    tagsAll: interpolate`${provider.tagsAll}`,
  };
};
