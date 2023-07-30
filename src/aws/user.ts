import {
  AccessKey,
  User as IAMUser,
  UserArgs,
  UserGroupMembership,
  UserLoginProfile,
  UserPolicy,
  UserPolicyAttachment,
} from "@pulumi/aws/iam";
import {
  ComponentResource,
  ComponentResourceOptions,
  Output,
} from "@pulumi/pulumi";

export interface UserArguments extends UserArgs {
  accessKey?: boolean;
  group?: string;
  consoleAccess?: boolean;
  inlinePolicies?: { [key: string]: string | Output<string> };
  pgpPublicKey?: string;
  policies?: { [key: string]: string | Output<string> };
  sesSmtpUser?: boolean;
}

export class User extends ComponentResource {
  accessKeyId?: Output<string>;
  arn: Output<string>;
  forceDestroy: Output<boolean | undefined>;
  id: Output<string>;
  name: Output<string>;
  path: Output<string | undefined>;
  permissionsBoundary: Output<string | undefined>;
  secretAccessKey?: Output<string>;
  sesSmtpUser: boolean;
  tagsAll: Output<{ [key: string]: string }>;
  uniqueId: Output<string>;

  constructor(
    name: string,
    args: UserArguments,
    opts?: ComponentResourceOptions,
  ) {
    super("dzangolab:pulumi:User", name, args, opts);

    const user = new IAMUser(name, args, {
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

    if (args.sesSmtpUser) {
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
    }

    if (args.inlinePolicies && !args.sesSmtpUser) {
      for (const policy in args.inlinePolicies) {
        new UserPolicy(
          policy,
          {
            user: user.name,
            policy: args.inlinePolicies[policy],
          },
          {
            parent: user,
            protect: opts?.protect,
            retainOnDelete: opts?.retainOnDelete,
          },
        );
      }
    }

    if (args.policies && !args.sesSmtpUser) {
      for (const policy in args.policies) {
        new UserPolicyAttachment(
          policy,
          {
            policyArn: args.policies[policy],
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

    if (args.accessKey || args.sesSmtpUser) {
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
      this.secretAccessKey = args.sesSmtpUser
        ? accessKey.sesSmtpPasswordV4
        : accessKey.secret;
    }

    if (args.consoleAccess && args.pgpPublicKey && !args.sesSmtpUser) {
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
    this.forceDestroy = user.forceDestroy;
    this.id = user.id;
    this.name = user.name;
    this.path = user.path;
    this.permissionsBoundary = user.permissionsBoundary;
    this.sesSmtpUser = !!args.sesSmtpUser;
    this.tagsAll = user.tagsAll;
    this.uniqueId = user.uniqueId;

    this.registerOutputs();
  }
}
