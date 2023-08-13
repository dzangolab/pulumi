import {
  ComponentResource,
  ComponentResourceOptions,
  jsonStringify,
  Output,
} from "@pulumi/pulumi";
import { RandomPassword } from "@pulumi/random";

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
    super("dzangolab:pulumi/aws:AppResources", name, args, opts);

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

    const databasePassword = new RandomPassword(
      `${name}-database-password`,
      {
        length: passwordLength,
      },
      {
        parent: this,
        protect: opts?.protect,
        retainOnDelete: opts?.retainOnDelete,
      },
    );

    const databaseRootPassword = new RandomPassword(
      `${name}-database-root-password`,
      {
        length: passwordLength,
      },
      {
        parent: this,
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
        parent: this,
      },
    );

    const secretString = jsonStringify({
      "aws-access-key-id": user.accessKeyId,
      "aws-secret-access-key": user.secretAccessKey,
      "database-password": databasePassword.result,
      "database-root-password": databaseRootPassword.result,
      "ses-smtp-username": sesSmtpUser.accessKeyId,
      "ses-smtp-password": sesSmtpUser.secretAccessKey,
      "traefik-dashboard-password": traefikDashboardPassword.result,
    });

    const secret = new Secret(
      name,
      {
        secretString,
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
