import { getRandomPasswordOutput } from "@pulumi/aws/secretsmanager";
import {
  all,
  ComponentResource,
  ComponentResourceOptions,
  Output,
} from "@pulumi/pulumi";

import { S3Bucket } from "./s3Bucket";
import { Secret } from "./secret";
import { User } from "./user";

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
  sesSmtpPassword: Output<string>;
  sesSmtpUsername: Output<string>;
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

    const user = new User(
      args.username || name,
      {
        accessKey: true,
        consoleAccess: false,
        group: args?.usergroup,
        policies: {
          s3: bucket.policyArn,
          ecr: "arn:aws:iam::aws:policy/AmazonEC2ContainerRegistryReadOnly",
        },
      },
      {
        parent: this,
        protect: opts?.protect,
        retainOnDelete: opts?.retainOnDelete,
      },
    );

    const sesSmtpUser = new User(
      `${args.username || name}-ses`,
      {
        group: args?.usergroup,
        sesSmtpUser: true,
      },
      {
        parent: this,
        protect: opts?.protect,
        retainOnDelete: opts?.retainOnDelete,
      },
    );

    const passwordLength = args.passwordLength || 24;

    const databasePassword = getRandomPasswordOutput(
      {
        passwordLength: passwordLength,
      },
      {
        parent: user,
      },
    );

    const databaseRootPassword = getRandomPasswordOutput(
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
      databasePassword,
      databaseRootPassword,
      traefikDashboardPassword,
      sesSmtpUser.accessKeyId as unknown as string,
      sesSmtpUser.secretAccessKey as unknown as string,
      user.accessKeyId as unknown as string,
      user.secretAccessKey as unknown as string,
    ]).apply(
      ([
        databasePassword,
        databaseRootPassword,
        traefikDashboardPassword,
        sesSmtpAccessKeyId,
        sesSmtpSecretAccessKey,
        accessKeyId,
        secretAccessKey,
      ]) => ({
        "aws-access_key-id": accessKeyId,
        "aws-secret-access-key": secretAccessKey,
        "database-password": databasePassword.randomPassword,
        "database-root-password": databaseRootPassword.randomPassword,
        "ses-smtp-username": sesSmtpAccessKeyId,
        "ses-smtp-password": sesSmtpSecretAccessKey,
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

    this.sesSmtpPassword = sesSmtpUser.secretAccessKey as Output<string>;
    this.sesSmtpUsername = sesSmtpUser.accessKeyId as Output<string>;

    this.userArn = user.arn;

    this.registerOutputs();
  }
}
