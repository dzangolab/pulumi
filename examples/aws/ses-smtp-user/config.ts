import { Config } from "@pulumi/pulumi";

export const getConfig = async () => {
  const stackConfig = new Config();

  return {
    group: stackConfig.get("group"),
    name: stackConfig.require("name"),
  };
};
