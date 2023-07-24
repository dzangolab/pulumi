import { interpolate } from "@pulumi/pulumi";

import { getConfig } from "./config";
/* eslint-disable-next-line node/no-unpublished-import */
import { AppUser } from "../../../src/aws/appUser";

export = async () => {
  const config = await getConfig();

  const user = new AppUser(config.name, {
    accessKey: config.accessKey,
    group: config.group,
    policies: config.policies,
  });

  return {
    accessKeyId: interpolate`${user.accessKeyId}`,
    arn: interpolate`${user.arn}`,
    id: interpolate`${user.id}`,
    secretAccessKey: interpolate`${user.secretAccessKey}`,
    tagsAll: interpolate`${user.tagsAll}`,
    uniqueId: interpolate`${user.uniqueId}`,
  };
};
