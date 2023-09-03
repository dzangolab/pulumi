import { Config } from "@pulumi/pulumi";

export const getConfig = async () => {
  const stackConfig = new Config();

  return {
    bucket: stackConfig.require("name"),
    folders: stackConfig.getObject<string[]>("folders"),
  };
};
