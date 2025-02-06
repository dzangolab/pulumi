import { interpolate } from "@pulumi/pulumi";

import { getConfig } from "./config";
/* eslint-disable-next-line n/no-unpublished-import */
import { AppResources } from "../../../src/aws/appResources";

export = async () => {
  const config = await getConfig();

  const resources = new AppResources(config.name, config);

  return {
    bucketArn: interpolate`${resources.bucketArn}`,
    bucketPolicyArn: interpolate`${resources.bucketPolicyArn}`,
    eip: interpolate`${resources.eip}`,
    secretArn: interpolate`${resources.secretArn}`,
    secretPolicyArn: interpolate`${resources.secretPolicyArn}`,
    sesSmtpUserArn: interpolate`${resources.sesSmtpUserArn}`,
    sesSmtpUsername: interpolate`${resources.sesSmtpUsername}`,
    userArn: interpolate`${resources.userArn}`,
    username: interpolate`${resources.username}`,
  };
};
