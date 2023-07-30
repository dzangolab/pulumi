import { getRandomPasswordOutput } from "@pulumi/aws/secretsmanager";
import {
  all,
  ComponentResource,
  ComponentResourceOptions,
  Output,
} from "@pulumi/pulumi";

import { AppUser } from "./appUser";
import { S3Bucket } from "./s3Bucket";
import { Secret } from "./secret";

export interface AppResourcesArguments {
  passwordLength?: number;
  usergroup?: string;
  username?: string;
}

export class AppResources extends ComponentResource {
  accessKeyId: Output<string>;
  bucketArn: Output<string>;
  bucketPolicyArn: Output<string>;
  secretAccessKey: Output<string>;
  secretArn: Output<string>;
  secretPolicyArn: Output<string>;
  userArn: Output<string>;

  constructor(
    name: string,
    args: AppResourcesArguments,
    opts?: ComponentResourceOptions,
  ) {
    super("dzango:AppResources", name, args, opts);

    const bucket = new S3Bucket(
      name,
      {},
      {
        ...opts,
        parent: this,
      },
    );

    const user = new AppUser(
      args.username || name,
      {
        accessKey: true,
        consoleAccess: false,
        group: args?.usergroup,
        policies: [
          bucket.policyArn,
          "arn:aws:iam::aws:policy/AmazonEC2ContainerRegistryReadOnly",
        ],
      },
      {
        parent: this,
        protect: opts?.protect,
        retainOnDelete: opts?.retainOnDelete,
      },
    );

    const passwordLength = args.passwordLength || 24;

    const postgresRootPassword = getRandomPasswordOutput(
      {
        passwordLength: passwordLength,
      },
      {
        parent: user,
      },
    );

    const postgresPassword = getRandomPasswordOutput(
      {
        passwordLength: passwordLength,
      },
      {
        parent: user,
      },
    );

    const traefikDashboardPassword = getRandomPasswordOutput(
      {
        excludePunctuation: true,
        passwordLength: passwordLength,
      },
      {
        parent: user,
      },
    );

    const passwordObject = all([
      user.accessKeyId as unknown as string,
      user.secretAccessKey as unknown as string,
      postgresPassword,
      postgresRootPassword,
      traefikDashboardPassword,
    ]).apply(
      ([
        accessKeyId,
        secretAccessKey,
        postgresPassword,
        postgresRootPassword,
        traefikDashboardPassword,
      ]) => ({
        "aws-access_key-iid": accessKeyId,
        "aws-secret-access-key": secretAccessKey,
        "postgres-password": postgresPassword.randomPassword,
        "postgres-root-password": postgresRootPassword.randomPassword,
        "traefik-dashboard-password": traefikDashboardPassword.randomPassword,
      }),
    );

    const secret = new Secret(
      name,
      {
        secretString: passwordObject.apply((o) => JSON.stringify(o)),
      },
      {
        parent: this,
        protect: opts?.protect,
        retainOnDelete: opts?.retainOnDelete,
      },
    );

    this.accessKeyId = user.accessKeyId as Output<string>;
    this.secretAccessKey = user.secretAccessKey as Output<string>;

    this.bucketArn = bucket.arn;
    this.bucketPolicyArn = bucket.policyArn;

    this.secretArn = secret.arn;
    this.secretPolicyArn = secret.policyArn;

    this.userArn = user.arn;

    this.registerOutputs();
  }
}
