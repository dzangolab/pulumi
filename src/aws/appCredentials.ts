import { AccessKey } from "@pulumi/aws/iam";
import { SecretVersion } from "@pulumi/aws/secretsmanager";
import {
  ComponentResource,
  ComponentResourceOptions,
  jsonStringify,
  Output,
} from "@pulumi/pulumi";
import { RandomPassword } from "@pulumi/random";

export interface AppCredentialsArguments {
  additionalPasswords?: string[];
  passwordLength?: number;
  passwords?: string[];
  secret: string;
  sesSmtpUser?: string;
  users: string[];
}

export class AppCredentials extends ComponentResource {
  arn: Output<string>;
  id: Output<string>;
  versionId: Output<string>;

  constructor(
    name: string,
    args: AppCredentialsArguments,
    opts?: ComponentResourceOptions,
  ) {
    super("dzangolab:pulumi/aws:AppResources", name, args, opts);

    const passwordLength = args.passwordLength || 24;

    const passwordObject: { [key: string]: Output<string> } = {};

    const defaultPasswords = [
      "database-password",
      "database-root-password",
      "traefik-dashboard-password",
    ];

    const passwords = [
      ...(args.passwords || defaultPasswords),
      ...(args.additionalPasswords || []),
    ];

    for (const suffix of passwords) {
      const password = new RandomPassword(
        `${name}-${suffix}`,
        {
          length: passwordLength,
        },
        {
          parent: this,
          protect: opts?.protect,
          retainOnDelete: opts?.retainOnDelete,
        },
      );

      passwordObject[suffix] = password.result;
    }

    for (const username of args.users) {
      const accessKey = new AccessKey(
        `${name}-${username}`,
        {
          user: username,
        },
        {
          parent: this,
          protect: opts?.protect,
          retainOnDelete: opts?.retainOnDelete,
        },
      );

      passwordObject[`${username}-access-key-id`] = accessKey.id;
      passwordObject[`${username}-secret-access-key`] = accessKey.secret;
    }

    if (args.sesSmtpUser) {
      const accessKey = new AccessKey(
        `${name}-ses`,
        {
          user: args.sesSmtpUser,
        },
        {
          parent: this,
          protect: opts?.protect,
          retainOnDelete: opts?.retainOnDelete,
        },
      );

      passwordObject["ses-smtp-username"] = accessKey.id;
      passwordObject["ses-smtp-password"] = accessKey.sesSmtpPasswordV4;
    }

    const version = new SecretVersion(
      name,
      {
        secretId: args.secret,
        secretString: jsonStringify(passwordObject),
      },
      {
        parent: this,
        protect: opts?.protect,
        retainOnDelete: opts?.retainOnDelete,
      },
    );

    this.arn = version.arn;
    this.id = version.id;
    this.versionId = version.versionId;

    this.registerOutputs();
  }
}
