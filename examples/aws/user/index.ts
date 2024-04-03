import { Policy } from "@pulumi/aws/iam";
import { interpolate } from "@pulumi/pulumi";

import { getConfig } from "./config";
/* eslint-disable-next-line n/no-unpublished-import */
import { User } from "../../../src/aws/user";

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

  const ec2Policy = JSON.stringify({
    Version: "2012-10-17",
    Statement: [
      {
        Action: ["ec2:Describe*"],
        Effect: "Allow",
        Resource: "*",
      },
    ],
  });

  const user = new User(config.name, {
    accessKey: config.accessKey,
    group: config.group,
    inlinePolicies: {
      ec2: ec2Policy,
    },
    policies: {
      admin: "arn:aws:iam::aws:policy/AdministratorAccess",
      ec2: policy.arn,
    },
  });

  return {
    accessKeyId: interpolate`${user.accessKeyId}`,
    arn: interpolate`${user.arn}`,
    forceDestroy: interpolate`${user.forceDestroy}`,
    id: interpolate`${user.id}`,
    name: interpolate`${user.name}`,
    path: interpolate`${user.path}`,
    permissionsBoundary: interpolate`${user.permissionsBoundary}`,
    secretAccessKey: interpolate`${user.secretAccessKey}`,
    sesSmtpuser: interpolate`${user.sesSmtpUser}`,
    tagsAll: interpolate`${user.tagsAll}`,
    uniqueId: interpolate`${user.uniqueId}`,
  };
};
