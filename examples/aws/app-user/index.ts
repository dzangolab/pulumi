import { aws } from "@dzangolab/pulumi";
import { interpolate } from "@pulumi/pulumi";

import { getConfig } from "./config";

export = async () => {
  const config = await getConfig();

  const user = new aws.AppUser(config.name, {
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
