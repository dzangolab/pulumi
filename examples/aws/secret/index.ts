import { aws } from "@dzangolab/pulumi";
import { interpolate } from "@pulumi/pulumi";

import { getConfig } from "./config";

export = async () => {
  const config = await getConfig();

  const secret = new aws.Secret(config.name, {
    secrets: {
      "postgres-password": "XYZ",
      "postgres-root-password": "ABC",
    },
  });

  return {
    secretArn: interpolate`${secret.arn}`,
    secretId: interpolate`${secret.id}`,
    policyArn: interpolate`${secret.policyArn}`,
  };
};
