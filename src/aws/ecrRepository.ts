import { LifecyclePolicy, Repository, RepositoryArgs } from "@pulumi/aws/ecr";
import {
  ComponentResource,
  ComponentResourceOptions,
  Output,
} from "@pulumi/pulumi";

export class ECRRepository extends ComponentResource {
  arn: Output<string>;
  id: Output<string>;
  registryId: Output<string>;
  repositoryUrl: Output<string>;
  tagsAll: Output<{ [key: string]: string }>;

  constructor(
    name: string,
    args: RepositoryArgs,
    opts?: ComponentResourceOptions,
  ) {
    super("dzangolab:pulumi:ECRRepository", name, args, opts);

    const repo = new Repository(
      name,
      {
        name,
        ...args,
      },
      opts,
    );

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
        ...opts,
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

    this.registerOutputs();
  }
}
