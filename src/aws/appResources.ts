import {
  getRandomPassword,
  getRandomPasswordOutput,
  SecretVersion,
} from "@pulumi/aws/secretsmanager";
import {
  all,
  ComponentResource,
  ComponentResourceOptions,
  interpolate,
  Output,
} from "@pulumi/pulumi";

import { AppUser } from "./appUser";
import { S3Bucket } from "./s3Bucket";
import { Secret } from "./secret";

export interface AppResourcesArguments {
  passwordLength?: number;
  region: string;
  usergroup?: string;
  username?: string;
}

export class AppResources extends ComponentResource {
  bucketArn: Output<string>;
  secretArn: Output<string>;
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

    const secret = new Secret(
      name,
      {
        secrets: {},
      },
      {
        ...opts,
        parent: this,
      },
    );

    const bucketPolicyArn = bucket.policyArn.apply((arn) => arn);

    const user = new AppUser(args.username || name, {
      accessKey: true,
      consoleAccess: false,
      group: args?.usergroup,
      policies: [bucketPolicyArn],
    });

    /*
    const passwordLength = args.passwordLength || 24;
    
    const postgresRootPassword = getRandomPasswordOutput(
      {
        passwordLength: passwordLength,
      },
      {
        parent: secret,
      },
    );
    
    const postgresPassword = getRandomPasswordOutput(
      {
        passwordLength: passwordLength,
      },
      {
        parent: secret,
      },
    );
    
    const traefikDashboardPassword = getRandomPasswordOutput(
      {
        excludePunctuation: true,
        passwordLength: passwordLength,
      },
      {
        parent: secret,
      },
    );
    
    new SecretVersion(name, {
      secretId: secret.id,
      secretString: all([
        postgresPassword.randomPassword,
        postgresRootPassword.randomPassword,
        traefikDashboardPassword.randomPassword,
        user?.secretAccessKey,
      ]).apply(
        ([postgresPassword, postgresRootPassword, traefikDashboardPassword, secretAccessKey]) =>
          JSON.stringify({
            "aws-secret-access-key": secretAccessKey as string,
            "postgres-password": postgresPassword as string,
            "postgres-root-password": postgresRootPassword as string,
            "traefik-dashboard-password":
              traefikDashboardPassword as string,
          }),
      ),
    });
    */

    this.bucketArn = bucket.arn;
    this.bucketPolicyArn = bucket.policyArn;

    this.secretArn = secret.arn;
    this.secretPolicyArn = secret.policyArn;

    this.userArn = user.arn;

    this.registerOutputs();
  }
}
