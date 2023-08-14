# ECRRepository

Provisions an AWS ElasticContainerRegistry (ECR) repository.

## Resources created

| Resource | Type | Notes |
|----------|------|----------|
| Repository | [`aws.ecr.Repository`](https://www.pulumi.com/registry/packages/aws/api-docs/ecr/repository/#aws-ecr-repository) |  |
| Lifecycle policy | [`aws.ecr.LifecyclePolicy`](https://www.pulumi.com/registry/packages/aws/api-docs/ecr/lifecyclepolicy/#aws-ecr-lifecyclepolicy) |  (1)
| Read-only policy | [`aws.iam.Policy`](https://www.pulumi.com/registry/packages/aws/api-docs/iam/policy/#aws-iam-policy) | (2) |
| Read-write policy | [`aws.iam.Policy`](https://www.pulumi.com/registry/packages/aws/api-docs/iam/policy/#aws-iam-policy) | (3) |

### Notes

1. The lifecycle policy is designed to remove all untagged images 1 day after last used.
2. Allows read-only access to the repository.
3. Allows read-write access to the repository.

## Inputs

This component resource supports the [original `aws.ecr.Repository` inputs](https://www.pulumi.com/registry/packages/aws/api-docs/ecr/repository/#inputs).

## Outputs

This components provides the [original `aws.ecr.Repository` outputs](https://www.pulumi.com/registry/packages/aws/api-docs/ecr/repository/#outputs) with the addition of:

| output        | type     | comments                           |
|---------------|----------|------------------------------------|
| `roPolicyArn` | `string` | The arn of the read-only policy.   |
| `rwPolicyArn` | `string` | The arn of the read-write policy.  |

[&#10092; Home](../index.md)