import * as aws from "@pulumi/aws";
import * as gitlab from "@pulumi/gitlab";
import { ComponentResource, ComponentResourceOptions } from "@pulumi/pulumi";

export interface GitlabRunnerUserOptions {
    forceDestroy?: boolean,
    gitlabGroupName: string;
    groupName: string;
    name?: string;
    path?: string;
    permissionsBoundary?: string;
    tags?: { [key: string]: string };
};

export class GitlabRunnerUser extends ComponentResource {
    accessKey: aws.iam.AccessKey;
    runner: aws.iam.User;

    constructor(name: string, args: GitlabRunnerUserOptions, opts?: ComponentResourceOptions) {
        super("dzango:gitlabRunnerUser", name, args, opts);

        this.runner = new aws.iam.User(
            name,
            {
                forceDestroy: args.forceDestroy,
                name: args.name,
                path: args.path,
                permissionsBoundary: args.permissionsBoundary,
                tags: args.tags
            },
            opts
        );

        new aws.iam.UserGroupMembership(
            `${name}-${args.groupName}`,
            {
                groups: [args.groupName],
                user: this.runner.name,
            },
            {
                parent: this,
                protect: opts?.protect,
                retainOnDelete: opts?.retainOnDelete,
            }
        );

        new aws.iam.UserPolicyAttachment(
            `${name}-ecr-power-user`,
            {
                policyArn: "arn:aws:iam::aws:policy/AmazonEC2ContainerRegistryPowerUser",
                user: this.runner.name,
            },
            {
                parent: this,
                protect: opts?.protect,
                retainOnDelete: opts?.retainOnDelete,
            }
        );

        this.accessKey = new aws.iam.AccessKey(
            `${name}-access-key`,
            {
                user: this.runner.name,
            },
            {
                additionalSecretOutputs: ["secret"],
                parent: this,
                protect: opts?.protect,
                retainOnDelete: opts?.retainOnDelete,
            }
        );

        // Get the Gitlab Group
        const gitlabGroup = gitlab.Group.get(args.gitlabGroupName, args.gitlabGroupName);

        // Add the secret access key to the Gitlab group as a GroupVariable
        const secretAccessKeyVariable = new gitlab.GroupVariable(
            `${args.gitlabGroupName}-secret-access-key`,
            {
                environmentScope: "*",
                group: gitlabGroup.id,
                key: "AWS_SECRET_ACCESS_KEY",
                masked: true,
                "protected": true,
                raw: true,
                value: this.accessKey.secret,
            },
            {
                parent: this,
                protect: opts?.protect,
                retainOnDelete: opts?.retainOnDelete,
            }
        );

        // Add the access key id to the Gitlab group as a GroupVariable
        const accessKeyIdVariable = new gitlab.GroupVariable(
            `${args.gitlabGroupName}-access-key-id`,
            {
                environmentScope: "*",
                group: gitlabGroup.id,
                key: "AWS_ACCESS_KEY_ID",
                masked: false,
                "protected": false,
                raw: true,
                value: this.accessKey.id,
            },
            {
                parent: this,
                protect: opts?.protect,
                retainOnDelete: opts?.retainOnDelete,
            }
        );

        this.registerOutputs({
            accessKeyId: this.accessKey.id,
            id: this.runner.id,
            name: this.runner.name,
        })
    }
}
