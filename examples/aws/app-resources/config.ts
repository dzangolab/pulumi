import { Config, getOrganization, getStack } from "@pulumi/pulumi";

export const getConfig = async () => {
  const organization = getOrganization();
  const stack = getStack();
  const stackConfig = new Config();

  return {
    name: `${organization}-${stack}`,
    usergroup: stackConfig.get("usergroup"),
    region: stackConfig.require("aws:region"),
  };
};
