# Secret

Provisions an [aws.secretsmanager.Secret](https://www.pulumi.com/registry/packages/aws/api-docs/secretsmanager/secret/#aws-secretsmanager-secret).

## Resources created

| Resource | Type | Notes |
|----------|------|----------|
| Secret | [`aws.secretsmanager.Secret`](https://www.pulumi.com/registry/packages/aws/api-docs/secretsmanager/secret/#aws-secretsmanager-secret) |  |
| Read-write policy | [`aws.iam.Policy`](https://www.pulumi.com/registry/packages/aws/api-docs/iam/policy/#aws-iam-policy) | (1) |
| SecretVersion | [`aws.secretsmanager.SecretVersion`](https://www.pulumi.com/registry/packages/aws/api-docs/secretsmanager/secretversion/#aws-secretsmanager-secretversion) | (2) |

### Notes

1. Allows read-write access to the secret.
2. SecretVersion is created of the `secretString` input is present.


## Inputs

This component resource supports the [original `aws.secretsmanager.Secret` inputs](https://www.pulumi.com/registry/packages/aws/api-docs/secretsmanager/secret/#inputs) with the addition of:

| input
|----------------|---------------------------|----------------------|
| `secretString` | `string | Output<string>` | Optional. The secret string to store in the secret. |

## Outputs

This components provides the [original `aws.secretsmanager.Secret` outputs](https://www.pulumi.com/registry/packages/aws/api-docs/secretsmanager/secret/#outputs) with the addition of::

| output      | type     | comments                           |
|-------------|----------|------------------------------------|
| `policyArn` | `string` | The arn of the read-write policy. |


[&#10092; Home](../index.md)