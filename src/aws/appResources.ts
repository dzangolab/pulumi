import { getRandomPasswordOutput } from "@pulumi/aws/secretsmanager";
import {
  all,
  ComponentResource,
  ComponentResourceOptions,
  Output,
} from "@pulumi/pulumi";
import { RandomPassword } from "@pulumi/random";

import { S3Bucket } from "./s3Bucket";
import { Secret } from "./secret";
import { User } from "./user";

export interface AppResourcesArguments {
  database?: string,
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

    const database = args.database || "postgres";
    const passwordLength = args.passwordLength || 24;

    const databasePassword = new RandomPassword(
      `${name}-${database}-password`,
      {
        length: passwordLength,
      },
      {
        parent: user,
        protect: opts?.protect,
        retainOnDelete: opts?.retainOnDelete,
      },
    );

    const databaseRootPassword = new RandomPassword(
      `${name}-${database}-root-password`,
      {
        length: passwordLength,
      },
      {
        parent: user,
        protect: opts?.protect,
        retainOnDelete: opts?.retainOnDelete,
      },
    );

    const traefikDashboardPassword = new RandomPassword(
      `${name}-traefik-dashboard-password`,
      {
        length: passwordLength,
      },
      {
        parent: user,
      },
    );

    const passwordObject = all([
      databasePassword.result,
      databaseRootPassword.result,
      traefikDashboardPassword.result,
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
      ]) => {
        let passwordObject: { [key: string]: string | Output<string> } = {
          "aws-access_key-id": accessKeyId,
          "aws-secret-access-key": secretAccessKey,
          "ses-smtp-username": sesSmtpAccessKeyId,
          "ses-smtp-password": sesSmtpSecretAccessKey,
          "traefik-dashboard-password": traefikDashboardPassword,
        };

        passwordObject[`${database}-password`] = databasePassword;
        passwordObject[`${database}-root-password`] = databaseRootPassword;

        return passwordObject;
      },
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
