import { Config } from "@pulumi/pulumi";

export const getConfig = async () => {
  const stackConfig = new Config();

  return {
    name: stackConfig.require("name"),
    recoveryWindowInDays: stackConfig.getNumber("recoveryWindowInDays"),
  };
};
