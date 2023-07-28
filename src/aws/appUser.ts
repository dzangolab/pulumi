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

    const user = new User(name, args, opts);

    if (args.group) {
      new UserGroupMembership(name, {
        groups: [args.group],
        user: user.name,
      });
    }

    if (args.policies) {
      for (let i = 0; i < args.policies.length; i++) {
        const policy = args.policies[i];

        const slug =
          typeof policy === "string"
            ? policy.split("/")[1]
            : policy.apply((policy) => policy.split("/")[1]);

        new UserPolicyAttachment(`${name}-${slug}`, {
          policyArn: policy,
          user: user.name,
        });
      }
    }

    if (args.accessKey) {
      const accessKey = new AccessKey(name, {
        user: user.name,
      });

      this.accessKeyId = accessKey.id;
      this.secretAccessKey = accessKey.secret;
    }

    if (args.consoleAccess && args.pgpPublicKey) {
      new UserLoginProfile(name, {
        passwordResetRequired: true,
        pgpKey: args.pgpPublicKey,
        user: user.name,
      });
    }

    this.arn = user.arn;
    this.id = user.id;
    this.tagsAll = user.tagsAll;
    this.uniqueId = user.uniqueId;

    this.registerOutputs();
  }
}
