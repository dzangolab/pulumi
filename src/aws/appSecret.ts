import { Policy } from "@pulumi/aws/iam";
import {
  getRandomPasswordOutput,
  Secret,
  SecretArgs,
  SecretVersion,
} from "@pulumi/aws/secretsmanager";
import {
  all,
  ComponentResource,
  ComponentResourceOptions,
  Output,
} from "@pulumi/pulumi";

export interface AppSecretArguments extends SecretArgs {
  passwordLength?: number;
}

export class AppSecret extends ComponentResource {
  arn: Output<string>;
  id: Output<string>;
  policyArn: Output<string>;
  tagsAll: Output<{ [key: string]: string }>;

  constructor(
    name: string,
    args: AppSecretArguments,
    opts?: ComponentResourceOptions,
  ) {
    super("dzangolab:pulumi:AppSecret", name, args, opts);

    const secret = new Secret(name, args, {
      ...opts,
      parent: this,
    });

    const policy = new Policy(
      `${name}-secret-read-write`,
      {
        path: "/",
        description: `Read/write access to secret ${name}`,
        policy: secret.arn.apply((arn) =>
          JSON.stringify({
            Version: "2012-10-17",
            Statement: [
              {
                Action: ["secretsmanager:GetSecretValue"],
                Effect: "Allow",
                Resource: arn,
              },
            ],
          }),
        ),
      },
      {
        dependsOn: secret,
        parent: secret,
      },
    );

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
        postgresPassword,
        postgresRootPassword,
        traefikDashboardPassword,
      ]).apply(
        ([postgresPassword, postgresRootPassword, traefikDashboardPassword]) =>
          JSON.stringify({
            "postgres-password": postgresPassword.randomPassword,
            "postgres-root-password": postgresRootPassword.randomPassword,
            "traefik-dashboard-password":
              traefikDashboardPassword.randomPassword,
          }),
      ),
    });

    this.arn = secret.arn;
    this.id = secret.id;
    this.policyArn = policy.arn;
    this.tagsAll = secret.tagsAll;

    this.registerOutputs();
  }
}
