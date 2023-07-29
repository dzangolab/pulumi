import {
  AccessKey,
  User,
  UserArgs,
  UserGroupMembership,
  UserLoginProfile,
  UserPolicyAttachment,
} from "@pulumi/aws/iam";
import {
  ComponentResource,
  ComponentResourceOptions,
  Output,
} from "@pulumi/pulumi";

export interface AppUserArguments extends UserArgs {
  accessKey?: boolean;
  group?: string;
  consoleAccess?: boolean;
  pgpPublicKey?: string;
  policies: (string | Output<string>)[];
}

export class AppUser extends ComponentResource {
  accessKeyId?: Output<string>;
  arn: Output<string>;
  id: Output<string>;
  secretAccessKey?: Output<string>;
  tagsAll: Output<{ [key: string]: string }>;
  uniqueId: Output<string>;

  constructor(
    name: string,
    args: AppUserArguments,
    opts?: ComponentResourceOptions,
  ) {
    super("dzangolab:pulumi:AppUser", name, args, opts);

    const user = new User(name, args, {
      ...opts,
      parent: this,
    });

    if (args.group) {
      new UserGroupMembership(
        name,
        {
          groups: [args.group],
          user: user.name,
        },
        {
          parent: this,
          protect: opts?.protect,
          retainOnDelete: opts?.retainOnDelete,
        },
      );
    }

    if (args.policies) {
      for (let i = 0; i < args.policies.length; i++) {
        new UserPolicyAttachment(
          `${name}-${i}`,
          {
            policyArn: args.policies[i],
            user: user.name,
          },
          {
            parent: this,
            protect: opts?.protect,
            retainOnDelete: opts?.retainOnDelete,
          },
        );
      }
    }

    if (args.accessKey) {
      const accessKey = new AccessKey(
        name,
        {
          user: user.name,
        },
        {
          parent: this,
          protect: opts?.protect,
          retainOnDelete: opts?.retainOnDelete,
        },
      );

      this.accessKeyId = accessKey.id;
      this.secretAccessKey = accessKey.secret;
    }

    if (args.consoleAccess && args.pgpPublicKey) {
      new UserLoginProfile(
        name,
        {
          passwordResetRequired: true,
          pgpKey: args.pgpPublicKey,
          user: user.name,
        },
        {
          parent: this,
          protect: opts?.protect,
          retainOnDelete: opts?.retainOnDelete,
        },
      );
    }

    this.arn = user.arn;
    this.id = user.id;
    this.tagsAll = user.tagsAll;
    this.uniqueId = user.uniqueId;

    this.registerOutputs();
  }
}
