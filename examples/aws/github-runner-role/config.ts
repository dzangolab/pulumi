import { Config } from "@pulumi/pulumi";

export const getConfig = async () => {
  const stackConfig = new Config();

  return {
    awsAccountId: stackConfig.require("awsAccountId"),
    awsRegion: stackConfig.require("awsRegion"),
    name: stackConfig.require("name"),
    repo: stackConfig.require("repo"),
  };
};
