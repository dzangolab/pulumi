import { Config } from "@pulumi/pulumi";

export const getConfig = async () => {
  const stackConfig = new Config();

  return {
    ecrArns: stackConfig.requireObject<string[]>("ecrArns"),
    name: stackConfig.require("name"),
    repos: stackConfig.requireObject<string[]>("repos"),
  };
};
