import { UserPolicy } from "@pulumi/aws/iam";
import {
  ComponentResource,
  ComponentResourceOptions,
  Output,
} from "@pulumi/pulumi";

import { AppUser } from "./appUser";

export interface SesSmtpUserArguments {
  group?: string;
}

export class SesSmtpUser extends ComponentResource {
  accessKeyId: Output<string>;
  arn: Output<string>;
  forceDestroy: Output<boolean | undefined>;
  id: Output<string>;
  name: Output<string>;
  path: Output<string | undefined>;
  permissionsBoundary: Output<string | undefined>;
  secretAccessKey: Output<string>;
  tagsAll: Output<{ [key: string]: string }>;
  uniqueId: Output<string>;

  constructor(
    name: string,
    args: SesSmtpUserArguments,
    opts?: ComponentResourceOptions,
  ) {
    super("dzangolab:pulumi:SesSmtpUser", name, args, opts);

    const user = new AppUser(
      name,
      {
        ...args,
        accessKey: true,
        group: args.group,
        policies: [],
      },
      {
        ...opts,
        parent: this,
      },
    );

    new UserPolicy(
      "AmazonSesSendingAccess",
      {
        user: user.name,
        policy: JSON.stringify({
          Version: "2012-10-17",
          Statement: [
            {
              Effect: "Allow",
              Action: "ses:SendRawEmail",
              Resource: "*",
            },
          ],
        }),
      },
      {
        parent: user,
        protect: opts?.protect,
        retainOnDelete: opts?.retainOnDelete,
      },
    );

    this.accessKeyId = user.accessKeyId as Output<string>;
    this.arn = user.arn;
    this.forceDestroy = user.forceDestroy;
    this.id = user.id;
    this.name = user.name;
    this.path = user.path;
    this.permissionsBoundary = user.permissionsBoundary;
    this.secretAccessKey = user.sesSmtpPassword as Output<string>;
    this.tagsAll = user.tagsAll;
    this.uniqueId = user.uniqueId;

    this.registerOutputs();
  }
}
