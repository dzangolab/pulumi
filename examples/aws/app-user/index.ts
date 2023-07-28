import { aws } from "@dzangolab/pulumi";
import { Policy } from "@pulumi/aws/iam";
import { interpolate } from "@pulumi/pulumi";

import { getConfig } from "./config";

export = async () => {
  const config = await getConfig();

  const policy = new Policy("policy", {
    path: "/",
    description: "My test policy",
    policy: JSON.stringify({
      Version: "2012-10-17",
      Statement: [
        {
          Action: ["ec2:Describe*"],
          Effect: "Allow",
          Resource: "*",
        },
      ],
    }),
  });

  const user = new aws.AppUser(config.name, {
    accessKey: config.accessKey,
    group: config.group,
    policies: ["arn:aws:iam::aws:policy/AdministratorAccess", policy.arn],
  });

  return {
    accessKeyId: interpolate`${user.accessKeyId}`,
    arn: interpolate`${user.arn}`,
    id: interpolate`${user.id}`,
    secretAccessKey: interpolate`${user.secretAccessKey}`,
    tagsAll: interpolate`${user.tagsAll}`,
    uniqueId: interpolate`${user.uniqueId}`,
  };
};
