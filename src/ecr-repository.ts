import {
    LifecyclePolicy,
    Repository
} from "@pulumi/aws/ecr";
import { ComponentResource, ComponentResourceOptions } from "@pulumi/pulumi";

export interface ECRRepositoryOptions {
    name: string;
}

export class ECRRepository extends ComponentResource {
    policy: LifecyclePolicy;
    repo: Repository;

    constructor(
        name: string,
        args: ECRRepositoryOptions,
        opts?: ComponentResourceOptions
    ) {
        super("dzangolab:ECRRepository", name, args, opts);

        this.repo = new Repository(
            name,
            {
                name: name
            },
            opts
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
            }
        );


        this.registerOutputs({
            id: this.repo.id,
            name: this.repo.name,
        });
    }
}
