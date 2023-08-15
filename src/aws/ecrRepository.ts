import { LifecyclePolicy, Repository, RepositoryArgs } from "@pulumi/aws/ecr";
import { Policy } from "@pulumi/aws/iam";
import {
  ComponentResource,
  ComponentResourceOptions,
  jsonStringify,
  Output,
} from "@pulumi/pulumi";

export interface ECRRepositoryArguments extends RepositoryArgs {
  provisionPolicies: boolean;
}

export class ECRRepository extends ComponentResource {
  arn: Output<string>;
  id: Output<string>;
  registryId: Output<string>;
  repositoryUrl: Output<string>;
  roPolicyArn?: Output<string>;
  rwPolicyArn?: Output<string>;
  tagsAll: Output<{ [key: string]: string }>;

  constructor(
    name: string,
    args: ECRRepositoryArguments,
    opts?: ComponentResourceOptions,
  ) {
    super("dzangolab:pulumi/aws:ECRRepository", name, args, opts);

    const repo = new Repository(name, args, opts);

    new LifecyclePolicy(
      name,
      {
        repository: repo.name,
        policy: `{
          "rules": [
              {
                  "rulePriority": 1,
                  "description": "Expire untagged images older than 1 day",
                  "selection": {
                      "tagStatus": "untagged",
                      "countType": "sinceImagePushed",
                      "countUnit": "days",
                      "countNumber": 1
                  },
                  "action": {
                      "type": "expire"
                  }
              }
          ]
      }`,
      },
      {
        dependsOn: repo,
        parent: this,
        protect: opts?.protect,
        retainOnDelete: opts?.retainOnDelete,
      },
    );

    this.arn = repo.arn;
    this.id = repo.id;
    this.registryId = repo.registryId;
    this.repositoryUrl = repo.repositoryUrl;
    this.tagsAll = repo.tagsAll;

    if (args.provisionPolicies) {
      const roPolicy = new Policy(
        `${name.replaceAll("/", "-")}-read-only`,
        {
          policy: jsonStringify({
            Version: "2012-10-17",
            Statement: [
              {
                Action: [
                  "ecr:GetAuthorizationToken",
                  "ecr:BatchCheckLayerAvailability",
                  "ecr:GetDownloadUrlForLayer",
                  "ecr:GetRepositoryPolicy",
                  "ecr:DescribeRepositories",
                  "ecr:ListImages",
                  "ecr:DescribeImages",
                  "ecr:BatchGetImage",
                  "ecr:GetLifecyclePolicy",
                  "ecr:GetLifecyclePolicyPreview",
                  "ecr:ListTagsForResource",
                  "ecr:DescribeImageScanFindings",
                ],
                Effect: "Allow",
                Resource: repo.arn,
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
          dependsOn: repo,
          parent: repo,
          protect: opts?.protect,
          retainOnDelete: opts?.retainOnDelete,
        },
      );

      const rwPolicy = new Policy(
        `${name.replaceAll("/", "-")}-read-write`,
        {
          policy: jsonStringify({
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
                Resource: repo.arn,
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
          parent: repo,
          protect: opts?.protect,
          retainOnDelete: opts?.retainOnDelete,
        },
      );

      this.roPolicyArn = roPolicy.arn;
      this.rwPolicyArn = rwPolicy.arn;
    }

    this.registerOutputs();
  }
}
