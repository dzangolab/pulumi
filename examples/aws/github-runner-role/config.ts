import { Config } from "@pulumi/pulumi";

export const getConfig = async () => {
  const stackConfig = new Config();
  const awsStackConfig = new Config("aws");

  return {
    awsAccountId: stackConfig.require("awsAccountId"),
    awsRegion: awsStackConfig.require("region"),
    name: stackConfig.require("name"),
    repo: stackConfig.require("repo"),
  };
};
