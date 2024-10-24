import { S3Client } from "@aws-sdk/client-s3";
import { Environment } from "@core/environment";

export const s3 = new S3Client({
  region: Environment.get("AWS_DEFAULT_REGION"),
});
