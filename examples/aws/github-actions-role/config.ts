import {
  Config,
  getOrganization,
  getStack,
  StackReference,
  StackReferenceOutputDetails,
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

  const githubIdentityProviderOutput = await githubIdpStack.getOutputDetails(
    "arn",
  );
  const githubIdentityProviderArn = getValue<string>(
    githubIdentityProviderOutput,
  );

  const rwPolicyArnOutput = await ecrStack.getOutputDetails("rwPolicyArn");
  const rwPolicyArn = getValue<string>(rwPolicyArnOutput);

  return {
    githubIdentityProviderArn: githubIdentityProviderArn,
    githubRepos: stackConfig.getObject<string[]>("repos"),
    name: stackConfig.require("name"),
    policyArns: [rwPolicyArn],
  };
};

function getValue<T>(input: StackReferenceOutputDetails, defaultValue?: T): T {
  console.log(input);

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
