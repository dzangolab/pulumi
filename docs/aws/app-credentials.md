# AppCredentials

Provisions a set of credentials for an app.

## Resources created

| Resource | Type | Notes |
|----------|------|----------|
| SecretVersion | [`aws.ecr.secretsmanager.SecretVersion`](https://www.pulumi.com/registry/packages/aws/api-docs/secretsmanager/secretversion/#aws-secretsmanager-secretversion) | (1) |
| RandomPassword | [`pulumi.random.RandomPassword`](https://www.pulumi.com/registry/packages/random/api-docs/randompassword/#random-randompassword) |  (2)
| AccessKey | [`aws.iam.AccessKey`](https://www.pulumi.com/registry/packages/aws/api-docs/iam/accesskey/#aws-iam-accesskey) | (3) |
| AccessKey for SES SMTP user | [`aws.iam.AccessKey`](https://www.pulumi.com/registry/packages/aws/api-docs/iam/accesskey/#aws-iam-accesskey) | (4) |

### Notes

1. The `SecretVersion` created is attached to the `aws.secretsmanager.Secret` identified by its name via the `secret` input argument. 
2. One `RandomPassword` is generated for each entry in the `passwords` input argument.
3. One `AccessKey` is generated for each entry in the `users` input argument.
4. An SES-compatible `AccessKey` is created for the SES SMTP user.

### Secret string

The secret string will be a stringified JSON object in the form of:

```json
{
    "<passwords[0]>": "<pulumi.random.RandomPassword.result>",
    "<passwords[1]>": "<pulumi.random.RandomPassword.result>",
    ...
    "aws-access-key-id": "<aws.iam.AccessKey.id>",
    "aws-secret-access-key": "<aws.iam.AccessKey.secretAccessKey>",
    "ses-smtp-username": "<aws.iam.Accesskey.id>",
    "ses-smtp-password": "<aws.iam.AccessKey.sesSmtpPasswordV4>"
}
```

## Inputs

| input                       | type       | Comments | Notes |
|-----------------------------|------------|----------|-------|
| `additionalPasswords` | `string[]` | Optional. Names of additional passwords to generate | (1) |
| `passwordLength`      | `number`   | Optional. The length of the passwords to generate. defaults to 24 |  |
| `passwords`           | `string[]` | Optional. The names of the passwords to generate | (1) |
| `secret`              | `string`   | The name or arn of the secret to which this secret version should be associated |  |
| `sesSmtpUser`         | `string`   | Optional. The name of the SES SMTP user for which an `AccessKey` should be created |  |
| `user`                | `string`   | Optional. The name of the AWS IAM user for which an `AccessKey` should be created |  |

### Passwords

1 password will be generated for each password name defined in the combination of the `passwords` and `additionalPasswords` input arguments.

Both arguments are optional. 

If `passwords` is not defined, the following default password names will be used:

* `database-password`
* `database-root-password`
* `traefik-dashboard-password`

If `passwords` is defined, it overrides the default password list. 

By leaving `passwords` undefined and defining `additionalPasswords` you can combine the default password list with your own.

## Outputs

| output      | type     | comments                             |
|-------------|----------|--------------------------------------|
| `arn`       | `string` | The arn of the secret version.       |
| `id`        | `string` | The id of the secret version.        |
| `versionId` | `string` | The versionId of the secret version. |

[&#10092; Home](../index.md)