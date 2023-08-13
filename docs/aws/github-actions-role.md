# GithubActionsRole

## Resources created

| Resource | Type | Notes |
|----------|------|----------|
| Role | [`aws.iam.Role`](https://www.pulumi.com/registry/packages/aws/api-docs/ecr/repository/#aws-ecr-repository) | (|

## Trust policy

The following trust policy is attached to the Role:

```json

      Version: "2012-10-17",
      Statement: [
        {
          Sid: "",
          Effect: "Allow",
          Principal: {
            Federated: args.githubIdentityProviderArn,
          },
          Action: "sts:AssumeRoleWithWebIdentity",
          Condition: {
            StringEquals: {
              "token.actions.githubusercontent.com:aud": "sts.amazonaws.com",
            },
            StringLike: {
              "token.actions.githubusercontent.com:sub": `repo:${args.githubRepos[0]}`,
            },
          },
        },
      ],
    });
```

## Inputs

| input                       | type       | Comments |
|-----------------------------|------------|----------|
| `githubIdentityProviderArn` | `string`   | The arn of the github identity provider |
| `githubRepos`               | `string[]` | A collection of github repos tobe included  in the trust policy |
| `policyArns`                | `string[]` | Therole's managed policies |

## Outputs

The resource provides all [original `aws.iam.Role` outputs](https://www.pulumi.com/registry/packages/aws/api-docs/iam/role/#outputs) except for `RoleLastUseds`.