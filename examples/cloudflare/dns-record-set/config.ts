import { Config } from "@pulumi/pulumi";

export const getConfig = async () => {
  const stackConfig = new Config();

  return {
    aliases: stackConfig.requireObject<string[]>("aliases"),
    domain: stackConfig.require("domain"),
    host: stackConfig.require("host"),
    ip: stackConfig.require("ip"),
    subDomain: stackConfig.get("subDomain"),
  };
};
