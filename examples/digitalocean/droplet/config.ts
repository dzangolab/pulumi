import { Config, StackReferenceOutputDetails } from "@pulumi/pulumi";

export const getConfig = async () => {
  const stackConfig = new Config();

  return {
    image: stackConfig.require("image"),
    name: stackConfig.require("name"),
    projectId: stackConfig.get("projectId"),
    region: stackConfig.require("region"),
    size: stackConfig.require("size"),
    sshKeyNames: stackConfig.requireObject<string[]>("sshKeyNames"),
    userDataTemplate: stackConfig.require("userDataTemplate"),
    users: [
      {
        username: "dzangolab",
        groups: "sudo, docker",
        publicKeys: stackConfig.requireObject<string[]>("publicKeys"),
      },
    ],
    vpcUuid: stackConfig.get("vpcUuid"),
  };
};

function getValue<T>(input: StackReferenceOutputDetails, defaultValue?: T): T {
  if (input && input.value) {
    return <T>input.value!;
  }

  if (input && input.secretValue) {
    return <T>input.secretValue!;
  }

  if (!defaultValue) {
    throw new Error("A value is required");
  }

  return defaultValue;
}
