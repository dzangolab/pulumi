import { Config, getOrganization, getStack } from "@pulumi/pulumi";

export const getConfig = async () => {
  const organization = getOrganization();
  const stack = getStack();
  const stackConfig = new Config();

  return {
    name: `${organization}-${stack}`,
    recoveryWindowInDays: stackConfig.get("recoveryWindowInDays"),
    sesSmtpUser: stackConfig.getBoolean("sesSmtpUser"),
    usergroup: stackConfig.get("usergroup"),
  };
};
