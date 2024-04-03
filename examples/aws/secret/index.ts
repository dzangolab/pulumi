import { getRandomPasswordOutput } from "@pulumi/aws/secretsmanager";
import { interpolate, jsonStringify } from "@pulumi/pulumi";
import { RandomPassword } from "@pulumi/random";

import { getConfig } from "./config";
/* eslint-disable-next-line n/no-unpublished-import */
import { Secret } from "../../../src/aws/secret";

export = async () => {
  const config = await getConfig();

  // Generate random password 1
  const password1 = getRandomPasswordOutput({
    passwordLength: 16,
  });

  // Generate random password 2
  const password2 = new RandomPassword("password2", {
    length: 24,
  });

  const passwordObject = jsonStringify({
    "password-1": password1.randomPassword,
    "password-2": password2.result,
    "password-3": "s8PRVnwKKY3E",
  });

  const secret = new Secret(config.name, {
    recoveryWindowInDays: config.recoveryWindowInDays,
    secretString: passwordObject,
  });

  return {
    secretArn: interpolate`${secret.arn}`,
    secretId: interpolate`${secret.id}`,
    policyArn: interpolate`${secret.policyArn}`,
  };
};
