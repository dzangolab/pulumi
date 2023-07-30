import { AppResources } from "./appResources";
import { AppUser } from "./appUser";
import { ECRRepository } from "./ecrRepository";
import { GithubRunnerRole } from "./githubRunnerRole";
import { GitlabRunnerAWSIAMUser } from "./gitlabRunnerAwsIamUser";
import { S3Bucket } from "./s3Bucket";
import { Secret } from "./secret";
import { SesSmtpUser } from "./sesSmtpUser";

export const aws = {
  AppResources,
  AppUser,
  ECRRepository,
  GithubRunnerRole,
  GitlabRunnerAWSIAMUser,
  S3Bucket,
  Secret,
  SesSmtpUser,
};
