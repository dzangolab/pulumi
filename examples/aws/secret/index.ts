import { getRandomPassword } from "@pulumi/aws/secretsmanager";
import { all, interpolate } from "@pulumi/pulumi";

import { getConfig } from "./config";
/* eslint-disable-next-line node/no-unpublished-import */
import { Secret } from "../../../src/aws/secret";

export = async () => {
  const config = await getConfig();

  // Generate random password 1
  const password1 = getRandomPassword({
    passwordLength: 16,
  });

  // Generate random password 2
  const password2 = getRandomPassword({
    passwordLength: 16,
  });

  const passwordObject = all([password1, password2]).apply(
    ([password1, password2]) => ({
      "password-1": password1.randomPassword,
      "password-2": password2.randomPassword,
      "password-3": "s8PRVnwKKY3E",
    }),
  );

  const secret = new Secret(config.name, {
    recoveryWindowInDays: config.recoveryWindowInDays,
    secretString: passwordObject.apply((o) => JSON.stringify(o)),
  });

  return {
    secretArn: interpolate`${secret.arn}`,
    secretId: interpolate`${secret.id}`,
    policyArn: interpolate`${secret.policyArn}`,
  };
};
