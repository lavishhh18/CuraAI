import boto3

s3 = boto3.client(
    "s3",
    region_name="eu-north-1"
)

s3.upload_file(
    "AmazonML.pdf",
    "test.pdf"
)

print("Uploaded!")