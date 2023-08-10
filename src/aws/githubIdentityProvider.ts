import { OpenIdConnectProvider, Policy, Role } from "@pulumi/aws/iam";
import {
  ComponentResource,
  ComponentResourceOptions,
  Output,
} from "@pulumi/pulumi";

export interface GithubIdentityProviderArguments {
  ecrArns: string[];
  repos: string[];
  tags?: { [key: string]: string };
}

export class GithubIdentityProvider extends ComponentResource {
  arn: Output<string>;
  id: Output<string>;
  roleArn: Output<string>;
  tagsAll: Output<{ [key: string]: string }>;

  constructor(
    name: string,
    args: GithubIdentityProviderArguments,
    opts?: ComponentResourceOptions,
  ) {
    super("dzangolab:pulumi:GithubIdentityProvider", name, args, opts);

    const provider = new OpenIdConnectProvider(
      name,
      {
        clientIdLists: ["sts.amazonaws.com"],
        thumbprintLists: ["1c58a3a8518e8759bf075b76b750d4f2df264fcd"],
        tags: args.tags,
        url: "https://token.actions.githubusercontent.com",
      },
      {
        parent: this,
        protect: opts?.protect,
        retainOnDelete: opts?.retainOnDelete,
      },
    );

    const assumeRolePolicy = provider.arn.apply((arn) =>
      JSON.stringify({
        Version: "2012-10-17",
        Statement: [
          {
            Sid: "",
            Effect: "Allow",
            Principal: {
              Federated: arn,
            },
            Action: "sts:AssumeRoleWithWebIdentity",
            Condition: {
              StringEquals: {
                "token.actions.githubusercontent.com:aud": "sts.amazonaws.com",
              },
              StringLike: {
                "token.actions.githubusercontent.com:sub": `repo:${args.repos[0]}`,
              },
            },
          },
        ],
      }),
    );

    const policy = new Policy(
      name,
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
              Resource: args.ecrArns[0],
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
        dependsOn: provider,
        parent: provider,
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
      {
        dependsOn: provider,
        parent: provider,
        protect: opts?.protect,
        retainOnDelete: opts?.retainOnDelete,
      },
    );

    this.arn = provider.arn;
    this.id = provider.id;
    this.roleArn = role.arn;
    this.tagsAll = provider.tagsAll;

    this.registerOutputs();
  }
}
