import { Config } from "@pulumi/pulumi";

export const getConfig = async () => {
  const stackConfig = new Config();

  return {
    description: stackConfig.require("description"),
    environment: stackConfig.require("environment"),
    name: stackConfig.get("name"),
    region: stackConfig.require("region"),
    volumeSize: stackConfig.requireNumber("volumeSize"),
  };
};
