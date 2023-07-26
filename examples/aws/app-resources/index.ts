import { interpolate } from "@pulumi/pulumi";

import { getConfig } from "./config";
import { AppResources } from "../../../src/aws/appResources";

export = async () => {
  const config = await getConfig();

  const resources = new AppResources(config.name, {
    region: config.region,
  });

  return {
    bucketArn: interpolate`${resources.bucketArn}`,
    secretArn: interpolate`${resources.secretArn}`,
    userArn: interpolate`${resources.userArn}`,
  };
};
