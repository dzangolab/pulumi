import { LifecyclePolicy, Repository, RepositoryArgs } from "@pulumi/aws/ecr";
import { ComponentResource, ComponentResourceOptions } from "@pulumi/pulumi";

export class ECRRepository extends ComponentResource {
  policy: LifecyclePolicy;
  repo: Repository;

  constructor(
    name: string,
    args: RepositoryArgs,
    opts?: ComponentResourceOptions,
  ) {
    super("dzangolab:ECRRepository", name, args, opts);

    this.repo = new Repository(
      name,
      {
        name,
        ...args,
      },
      opts,
    );

    this.policy = new LifecyclePolicy(name, {
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
    });

    this.registerOutputs({
      id: this.repo.id,
      name: this.repo.name,
    });
  }
}
