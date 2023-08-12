import {
  Config,
  getOrganization,
  getStack,
  Output,
  StackReference,
} from "@pulumi/pulumi";

export const getConfig = async () => {
  const organization = getOrganization();
  const stack = getStack();

  const stackConfig = new Config();

  const githubIdpStack = new StackReference(
    `${organization}/github-identity-provider/${stack}`,
  );

  const ecrStack = new StackReference(
    `${organization}/ecr-repository/${stack}`,
  );

  return {
    githubIdentityProviderArn: githubIdpStack.requireOutput(
      "arn",
    ) as Output<string>,
    githubRepos: stackConfig.getObject<string[]>("repos"),
    name: stackConfig.require("name"),
    policyArns: [ecrStack.requireOutput("rwPolicyArn") as Output<string>],
  };
};
