import { interpolate } from "@pulumi/pulumi";

import { getConfig } from "./config";
/* eslint-disable-next-line node/no-unpublished-import */
import { SesSmtpUser } from "../../../src/aws/sesSmtpUser";

export = async () => {
  const config = await getConfig();

  const user = new SesSmtpUser(config.name, {
    group: config.group,
  });

  return {
    accessKeyId: interpolate`${user.accessKeyId}`,
    arn: interpolate`${user.arn}`,
    forceDestroy: interpolate`${user.forceDestroy}`,
    id: interpolate`${user.id}`,
    name: interpolate`${user.name}`,
    path: interpolate`${user.path}`,
    permissionsBoundary: interpolate`${user.permissionsBoundary}`,
    secretAccessKey: interpolate`${user.secretAccessKey}`,
    tagsAll: interpolate`${user.tagsAll}`,
    uniqueId: interpolate`${user.uniqueId}`,
  };
};
