import boto3

from django.conf import settings


class S3BotoClient:
    s3 = boto3.session.Session().client(
        service_name="s3",
        aws_access_key_id=settings.STORJ_CONFIG["access_key"],
        aws_secret_access_key=settings.STORJ_CONFIG["secret_key"],
        endpoint_url=settings.STORJ_CONFIG["url"],
    )