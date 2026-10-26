import { Role } from "@pulumi/aws/iam";
import {
  ComponentResource,
  ComponentResourceOptions,
  Input,
  jsonStringify,
  Output,
} from "@pulumi/pulumi";

export interface GithubActionsRoleArguments {
  githubIdentityProviderArn: Input<string>;
  githubRepos: string[];
  policyArns: Input<string>[];
}

export class GithubActionsRole extends ComponentResource {
  arn: Output<string>;
  createDate: Output<string>;
  id: Output<string>;
  tagsAll: Output<{ [key: string]: string }>;
  uniqueId: Output<string>;

  constructor(
    name: string,
    args: GithubActionsRoleArguments,
    opts?: ComponentResourceOptions,
  ) {
    super("dzangolab:pulumi/aws:GithubActionsRole", name, args, opts);

    if (args.githubRepos.length === 0) {
      throw new Error("At least one github repo is required");
    }

    const assumeRolePolicy = jsonStringify({
      Version: "2012-10-17",
      Statement: [
        {
          Sid: "",
          Effect: "Allow",
          Principal: {
            Federated: args.githubIdentityProviderArn,
          },
          Action: "sts:AssumeRoleWithWebIdentity",
          Condition: {
            StringEquals: {
              "token.actions.githubusercontent.com:aud": "sts.amazonaws.com",
            },
            StringLike: {
              "token.actions.githubusercontent.com:sub": args.githubRepos.map(
                (repository) => `repo:${repository}`,
              ),
            },
          },
        },
      ],
    });

    const role = new Role(
      name,
      {
        assumeRolePolicy,
        managedPolicyArns: args.policyArns,
      },
      opts,
    );

    this.arn = role.arn;
    this.createDate = role.createDate;
    this.id = role.id;
    this.tagsAll = role.tagsAll;
    this.uniqueId = role.uniqueId;

    this.registerOutputs();
  }
}
