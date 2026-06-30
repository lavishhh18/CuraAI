import boto3

dynamodb = boto3.resource(
    "dynamodb",
    region_name="eu-north-1"
)

table = dynamodb.Table("CuraAI")

response = table.get_item(
    Key={
        "userId": "2"
    }
)

print(response)
print(response.get("Item"))