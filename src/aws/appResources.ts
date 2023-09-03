import { Eip } from "@pulumi/aws/ec2";
import {
  ComponentResource,
  ComponentResourceOptions,
  Output,
} from "@pulumi/pulumi";

import { S3Bucket } from "./s3Bucket";
import { Secret } from "./secret";
import { User } from "./user";

export interface AppResourcesArguments {
  bucketName?: string;
  bucketFolders?: string[];
  secretRecoveryWindowInDays?: number;
  sesSmtpUser?: boolean | string;
  usergroup?: string;
  username?: string;
}

export class AppResources extends ComponentResource {
  bucketArn: Output<string>;
  bucketPolicyArn: Output<string>;
  eip: Output<string>;
  secretArn: Output<string>;
  secretPolicyArn: Output<string>;
  sesSmtpUserArn: Output<string> | undefined;
  sesSmtpUsername: Output<string> | undefined;
  userArn: Output<string>;
  username: Output<string>;

  constructor(
    name: string,
    args: AppResourcesArguments,
    opts?: ComponentResourceOptions,
  ) {
    super("dzangolab:pulumi/aws:AppResources", name, args, opts);

    const bucket = new S3Bucket(
      args?.bucketName || name,
      {
        folders: args?.bucketFolders || ["backuops/postgresql"],
      },
      {
        ...opts,
        parent: this,
      },
    );

    const user = new User(
      args.username || name,
      {
        accessKey: false,
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

    if (args.sesSmtpUser) {
      const username =
        typeof args.sesSmtpUser === "string"
          ? args.sesSmtpUser
          : `${args.username || name}-ses`;

      const sesSmtpUser = new User(
        username,
        {
          accessKey: false,
          group: args?.usergroup,
          sesSmtpUser: true,
        },
        {
          parent: this,
          protect: opts?.protect,
          retainOnDelete: opts?.retainOnDelete,
        },
      );

      this.sesSmtpUserArn = sesSmtpUser.arn;
      this.sesSmtpUsername = sesSmtpUser.name;
    }

    const secret = new Secret(
      name,
      {
        recoveryWindowInDays: args.secretRecoveryWindowInDays,
      },
      {
        parent: this,
        protect: opts?.protect,
        retainOnDelete: opts?.retainOnDelete,
      },
    );

    const eip = new Eip(
      name,
      {},
      {
        parent: this,
        protect: opts?.protect,
        retainOnDelete: opts?.retainOnDelete,
      },
    );

    this.bucketArn = bucket.arn;
    this.bucketPolicyArn = bucket.policyArn;

    this.eip = eip.publicIp;

    this.secretArn = secret.arn;
    this.secretPolicyArn = secret.policyArn;

    this.userArn = user.arn;
    this.username = user.name;

    this.registerOutputs();
  }
}
