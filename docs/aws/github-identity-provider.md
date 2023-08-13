# GithubIdentityProvider

Provisions an AWS IAM identity provider for github.

## Resources created

| Resource | Type | Notes |
|----------|------|----------|
| Identity provider | [aws.iam.OpenIdConnectProvider](https://www.pulumi.com/registry/packages/aws/api-docs/iam/openidconnectprovider/#aws-iam-openidconnectprovider) | (1) |

### Notes

1. An AWS IAM identity provider for github. The following settings are used:

| Setting           | Value                                        |
| ------------------|----------------------------------------------|
| `clientIdLists`   | ["sts.amazonaws.com"]                        |
| `thumbprintLists` | ["1c58a3a8518e8759bf075b76b750d4f2df264fcd"] |
| `url`             | https://token.actions.githubusercontent.com  |

## Inputs

| input  | type                        | comments                                      |
|--------|-----------------------------|-----------------------------------------------|
| `tags` | `{ [key: string]: string }` | Optional. Tags to associate to this resource. |

## Outputs

All [outputs](https://www.pulumi.com/registry/packages/aws/api-docs/iam/openidconnectprovider/#outputs) from the original `aws.iam.OpenIdConnectProvider` resource.

[&#10092; Home](../index.md)