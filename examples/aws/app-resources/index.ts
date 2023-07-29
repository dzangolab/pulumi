import { interpolate } from "@pulumi/pulumi";

import { getConfig } from "./config";
/* eslint-disable-next-line node/no-unpublished-import */
import { AppResources } from "../../../src/aws/appResources";

export = async () => {
  const config = await getConfig();

  const resources = new AppResources(config.name, {});

  return {
    accessKeyId: interpolate`${resources.accessKeyId}`,
    bucketArn: interpolate`${resources.bucketArn}`,
    bucketPolicyArn: interpolate`${resources.bucketPolicyArn}`,
    secretAccessKey: interpolate`${resources.secretAccessKey}`,
    secretArn: interpolate`${resources.secretArn}`,
    secretPolicyArn: interpolate`${resources.secretPolicyArn}`,
    userArn: interpolate`${resources.userArn}`,
  };
};
