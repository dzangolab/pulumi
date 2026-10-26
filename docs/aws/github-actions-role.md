# GithubActionsRole

## Resources created

| Resource | Type | Notes |
|----------|------|----------|
| Role | [`aws.iam.Role`](https://www.pulumi.com/registry/packages/aws/api-docs/iam/role/) | |

## Trust policy

The following trust policy is attached to the Role:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "",
      "Effect": "Allow",
      "Principal": {
        "Federated": "<githubIdentityProviderArn>"
      },
      "Action": "sts:AssumeRoleWithWebIdentity",
      "Condition": {
        "StringEquals": {
          "token.actions.githubusercontent.com:aud": "sts.amazonaws.com"
        },
        "StringLike": {
          "token.actions.githubusercontent.com:sub": [
            "repo:<githubRepos[0]>",
            "repo:<githubRepos[1]>"
          ]
        }
      }
    }
  ]
}
```

Each entry of `githubRepos` is prefixed with `repo:` and matched against the `sub` claim of the Github OIDC token, e.g. `repo:my-org/my-repo:ref:refs/heads/main`. The match is case-sensitive, and the role can be assumed if any entry matches.

An entry must therefore cover the claim's context as well as the repo, e.g.:

* `my-org/my-repo:*`: any branch, tag, environment or pull request of `my-org/my-repo`
* `my-org/my-repo:ref:refs/tags/*`: tags only
* `my-org/*`: any repo of `my-org`

If the organization or repo customizes its OIDC subject claim, use the format found in the token, e.g. `my-org@123/my-repo@456:*` when it includes the owner and repo ids.

## Inputs

| input                       | type       | Comments |
|-----------------------------|------------|----------|
| `githubIdentityProviderArn` | `string`   | The arn of the github identity provider |
| `githubRepos`               | `string[]` | The `sub` claim patterns, without the `repo:` prefix, allowed to assume the role (at least one) |
| `policyArns`                | `string[]` | The role's managed policies |

## Outputs

The resource provides all [original `aws.iam.Role` outputs](https://www.pulumi.com/registry/packages/aws/api-docs/iam/role/#outputs) except for `RoleLastUseds`.

[&#10092; Home](../index.md)