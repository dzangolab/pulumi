import { Secret, SecretVersion } from "@pulumi/aws/secretsmanager";
import { interpolate } from "@pulumi/pulumi";

export = async () => {
  const secret = new Secret("test", {
    name: "test",
    recoveryWindowInDays: 0,
  });

  const version = new SecretVersion("test", {
    secretId: "test",
    secretString: "secret password",
  });

  return {
    secretArn: interpolate`${secret.arn}`,
    secretId: interpolate`${secret.id}`,
    versionArn: interpolate`${version.arn}`,
  };
};
