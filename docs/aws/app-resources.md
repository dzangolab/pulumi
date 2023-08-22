# AppResources

Provisions a collection of resources required to deploy and run an app.

## Resources created

| Resource | Type | Notes |
|----------|------|----------|
| S3 bucket | [`aws.s3.Bucket`](https://www.pulumi.com/registry/packages/aws/api-docs/s3/bucket/#aws-s3-bucket) | (1) |
| Read-write bucket policy | [`aws.iam.Policy`](https://www.pulumi.com/registry/packages/aws/api-docs/s3/bucket/#aws-s3-bucket) | (1) |
| User | [`aws.iam.User`](https://www.pulumi.com/registry/packages/aws/api-docs/iam/user/#aws-iam-user) |  (2)
| SES SMTP User | [`aws.iam.User`](https://www.pulumi.com/registry/packages/aws/api-docs/iam/user/#aws-iam-user) | (3) |
| Secret | [`aws.secretsmanager.Secret`](https://www.pulumi.com/registry/packages/aws/api-docs/secretsmanager/secret/#aws-secretsmanager-secret) | (4) |

### Notes

1. The S3 bucket is used for storing various artifacts such as database backups, public web assets, etc. in addition, a read/write IAM policy on this bucket is generated.
2. The IAM user is expected to (1) pull the app's docker images, and (2) copy files to the S3 bucket (among other things). This user is granted the Bucket policy created as per above.
3. The SES SMTP user is responsible for sending emails via SES. 
4. Empty secret. A secret version is expected to be added via the [AppCredentials](./app-credentials.md) component resource.

## Inputs

| input                        | type       | Comments | Notes |
|------------------------------|------------|----------|-------|
| `secretRecoveryWindowInDays` | `number` | Optional. Recovery window foir the secret created by the component resource. This value can be 0 to force deletion without recovery or range from 7 to 30 days. The default value is 30. |  |
| `sesSmtpUser`                | `boolean \| string`   | Optional. | (1) |
| `usergroup`                  | `string` | Optional. The name of the group for the user to be created by this component resource |  |
| `username`                   | `string` | The name of the user to be created. | |

### Notes

1. If `undefined` or `falsy`, no SES SMTP user will be created. If true, a SES SMTP user will be created with a default name equal to the name of the user suffixed with `ses`. If a string, a SES SMTP user will be created with the argument value as its name. You are responsible for ensuring its validity and unicity.

## Outputs

| output            | type     | comments                       |
|-------------------|----------|--------------------------------|
| `bucketArn`       | `string` | The arn of the bucket.         |
| `bucketPolicyArn` | `string` | The arn of the bucket policy.  |
| `secretArn`       | `string` | The arn of the secret.         |
| `secretPolicyArn` | `string` | The arn of the secret policy.  |
| `sesSmtpUserArn`  | `string` | The arn of the SES SMTP user.  |
| `sesSmtpUsername` | `string` | The name of the SES SMTP user. |
| `userArn`         | `string` | The arn of the IAM user.       |
| `username`        | `string` | The name of the IAM user.      |

[&#10092; Home](../index.md)