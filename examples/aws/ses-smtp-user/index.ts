import { interpolate } from "@pulumi/pulumi";

import { getConfig } from "./config";
/* eslint-disable-next-line n/no-unpublished-import */
import { User } from "../../../src/aws/user";

export = async () => {
  const config = await getConfig();

  const user = new User(config.name, {
    group: config.group,
    sesSmtpUser: true,
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
    sesSmtpuser: interpolate`${user.sesSmtpUser}`,
    tagsAll: interpolate`${user.tagsAll}`,
    uniqueId: interpolate`${user.uniqueId}`,
  };
};
