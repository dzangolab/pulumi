import {
  getOrganization,
  getStack,
  StackReference,
  StackReferenceOutputDetails,
} from "@pulumi/pulumi";

export const getConfig = async () => {
  const organization = getOrganization();
  const stack = getStack();

  const resourcesStack = new StackReference(
    `${organization}/app-resources/${stack}`,
  );

  const secretArnOutput = await resourcesStack.getOutputDetails("secretArn");
  const secretArn = getValue<string>(secretArnOutput);

  const sesSmtpUsernameOutput =
    await resourcesStack.getOutputDetails("sesSmtpUsername");
  const sesSmtpUsername = getValue<string>(sesSmtpUsernameOutput);

  const usernameOutput = await resourcesStack.getOutputDetails("username");
  const username = getValue<string>(usernameOutput);

  return {
    name: `${organization}-${stack}`,
    secret: secretArn,
    sesSmtpUser: sesSmtpUsername,
    users: [username],
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
