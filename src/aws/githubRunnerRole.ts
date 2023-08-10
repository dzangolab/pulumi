import { Policy, Role } from "@pulumi/aws/iam";
import {
  ComponentResource,
  ComponentResourceOptions,
  Output,
} from "@pulumi/pulumi";

export interface GithubRunnerRoleArguments {
  awsAccountId: string;
  awsRegion: string;
  repo: string;
}

export class GithubRunnerRole extends ComponentResource {
  arn: Output<string>;
  createDate: Output<string>;
  id: Output<string>;
  policyArn: Output<string>;
  tagsAll: Output<{ [key: string]: string }>;
  uniqueId: Output<string>;

  constructor(
    name: string,
    args: GithubRunnerRoleArguments,
    opts?: ComponentResourceOptions,
  ) {
    super("dzangolab:pulumi:GithubRunnerRole", name, args, opts);

    const assumeRolePolicy = JSON.stringify({
      Version: "2012-10-17",
      Statement: [
        {
          Sid: "",
          Effect: "Allow",
          Principal: {
            Federated: `arn:aws:iam::${args.awsAccountId}:oidc-provider/token.actions.githubusercontent.com`,
          },
          Action: "sts:AssumeRoleWithWebIdentity",
          Condition: {
            StringEquals: {
              "token.actions.githubusercontent.com:aud": "sts.amazonaws.com",
            },
            StringLike: {
              "token.actions.githubusercontent.com:sub": `repo:${args.repo}:*`,
            },
          },
        },
      ],
    });

    const policy = new Policy(
      `${name}-policy`,
      {
        policy: JSON.stringify({
          Version: "2012-10-17",
          Statement: [
            {
              Action: [
                "ecr:UploadLayerPart",
                "ecr:PutImage",
                "ecr:InitiateLayerUpload",
                "ecr:GetDownloadUrlForLayer",
                "ecr:GetAuthorizationToken",
                "ecr:CompleteLayerUpload",
                "ecr:BatchGetImage",
                "ecr:BatchCheckLayerAvailability",
              ],
              Effect: "Allow",
              Resource: `arn:aws:ecr:${args.awsRegion}:${args.awsAccountId}:*`,
              Sid: "ECR",
            },
            {
              Action: "ecr:GetAuthorizationToken",
              Effect: "Allow",
              Resource: "*",
              Sid: "ecrAuthToken",
            },
          ],
        }),
      },
      {
        protect: opts?.protect,
        retainOnDelete: opts?.retainOnDelete,
      },
    );

    const role = new Role(
      name,
      {
        assumeRolePolicy,
        managedPolicyArns: [policy.arn],
      },
      opts,
    );

    this.arn = role.arn;
    this.createDate = role.createDate;
    this.id = role.id;
    this.policyArn = policy.arn;
    this.tagsAll = role.tagsAll;
    this.uniqueId = role.uniqueId;

    this.registerOutputs();
  }
}
