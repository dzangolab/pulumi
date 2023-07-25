import { interpolate } from "@pulumi/pulumi";

import { getConfig } from "./config";
/* eslint-disable-next-line node/no-unpublished-import */
import { Secret } from "../../../src/aws/secret";

export = async () => {
  const config = await getConfig();

  const secret = new Secret(config.name, {
    secrets: {
      "postgres- password": "XYZ",
      "postgres-root-password": "ABC",
    },
  });

  return {
    secretArn: interpolate`${secret.arn}`,
    secretId: interpolate`${secret.id}`,
    policyArn: interpolate`${secret.policyArn}`,
  };
};
