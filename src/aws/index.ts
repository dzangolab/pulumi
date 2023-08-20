import { AppCredentials } from "./appCredentials";
import { AppResources } from "./appResources";
import { ECRRepository } from "./ecrRepository";
import { GithubActionsRole } from "./githubActionsRole";
import { GithubIdentityProvider } from "./githubIdentityProvider";
import { GitlabRunnerAWSIAMUser } from "./gitlabRunnerAwsIamUser";
import { S3Bucket } from "./s3Bucket";
import { Secret } from "./secret";
import { User } from "./user";

export const aws = {
  AppCredentials,
  AppResources,
  ECRRepository,
  GithubActionsRole,
  GithubIdentityProvider,
  GitlabRunnerAWSIAMUser,
  S3Bucket,
  Secret,
  User,
};
