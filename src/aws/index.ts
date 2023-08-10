import { AppResources } from "./appResources";
import { ECRRepository } from "./ecrRepository";
import { GithubIdentityProvider } from "./githubIdentityProvider";
import { GithubRunnerRole } from "./githubRunnerRole";
import { GitlabRunnerAWSIAMUser } from "./gitlabRunnerAwsIamUser";
import { S3Bucket } from "./s3Bucket";
import { Secret } from "./secret";
import { User } from "./user";

export const aws = {
  AppResources,
  ECRRepository,
  GithubIdentityProvider,
  GithubRunnerRole,
  GitlabRunnerAWSIAMUser,
  S3Bucket,
  Secret,
  User,
};
