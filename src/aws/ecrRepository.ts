import { LifecyclePolicy, Repository, RepositoryArgs } from "@pulumi/aws/ecr";
import { ComponentResource, ComponentResourceOptions } from "@pulumi/pulumi";

export class ECRRepository extends ComponentResource {
  private repo: Repository;

  constructor(
    name: string,
    args: RepositoryArgs,
    opts?: ComponentResourceOptions,
  ) {
    super("dzangolab:pulumi:ECRRepository", name, args, opts);

    this.repo = new Repository(
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
        repository: this.repo.name,
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
      },
    );

    this.registerOutputs({
      arn: this.repo.arn,
      id: this.repo.id,
      registryId: this.repo.registryId,
      repositoryUrl: this.repo.repositoryUrl,
      tagsAll: this.repo.tagsAll,
    });
  }
}
