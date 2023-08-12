import { interpolate } from "@pulumi/pulumi";

import { getConfig } from "./config";
/* eslint-disable-next-line node/no-unpublished-import */
import { ECRRepository } from "../../../src/aws/ecrRepository";

export = async () => {
  const config = await getConfig();

  const repo = new ECRRepository(config.name, {});

  return {
    arn: interpolate`${repo.arn}`,
    id: interpolate`${repo.id}`,
    roPolicyArn: interpolate`${repo.roPolicyArn}`,
    rwPolicyArn: interpolate`${repo.rwPolicyArn}`,
    tagsAll: interpolate`${repo.tagsAll}`,
  };
};
