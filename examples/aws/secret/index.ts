import { interpolate } from "@pulumi/pulumi";

import { getConfig } from "./config";
/* eslint-disable-next-line node/no-unpublished-import */
import { AppSecret } from "../../../src/aws/appSecret";

export = async () => {
  const config = await getConfig();

  const secret = new AppSecret(config.name, {});

  return {
    secretArn: interpolate`${secret.arn}`,
    secretId: interpolate`${secret.id}`,
    policyArn: interpolate`${secret.policyArn}`,
  };
};
