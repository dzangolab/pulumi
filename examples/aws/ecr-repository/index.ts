import { interpolate } from "@pulumi/pulumi";

import { getConfig } from "./config";
/* eslint-disable-next-line n/no-unpublished-import */
import { ECRRepository } from "../../../src/aws/ecrRepository";

export = async () => {
  const config = await getConfig();

  const repository = new ECRRepository(config.name, {});

  return {
    arn: interpolate`${repository.arn}`,
    id: interpolate`${repository.id}`,
    roPolicyArn: interpolate`${repository.roPolicyArn}`,
    rwPolicyArn: interpolate`${repository.rwPolicyArn}`,
    tagsAll: interpolate`${repository.tagsAll}`,
  };
};
