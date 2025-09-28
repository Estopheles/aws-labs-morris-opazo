import json
import boto3

dynamodb = boto3.resource('dynamodb', region_name='us-east-1')
table = dynamodb.Table('Usuarios')

def lambda_handler(event, context):
    http_method = event.get('httpMethod', '')  # GET o POST
    
    if http_method == 'GET':
        username = event.get('queryStringParameters', {}).get('username')
        if not username:
            return {
                "statusCode": 400,
                "body": json.dumps({"error": "Se requiere el parámetro 'username'"}), 
            }
        try:
            response = table.get_item(Key={'username': username})
        except Exception as e:
            return {
                "statusCode": 500,
                "body": json.dumps({"error": f"Error accediendo a DynamoDB: {str(e)}"}),
            }
        if 'Item' in response:
            user = response['Item']
            tiene_password = 'password' in user and user['password']
            return {
                "statusCode": 200,
                "body": json.dumps({
                    "username": username,
                    "tiene_password": bool(tiene_password),
                }),
            }
        else:
            return {
                "statusCode": 404,
                "body": json.dumps({"error": "Usuario no encontrado"}),
            }

    elif http_method == 'POST':
        try:
            data = json.loads(event.get('body', '{}'))
            username = data.get('username')
            if not username:
                return {
                    "statusCode": 400,
                    "body": json.dumps({"error": "Se requiere el campo 'username'"}),
                }

            # Guarda todos los campos recibidos
            table.put_item(Item=data)

            return {
                "statusCode": 200,
                "body": json.dumps({"message": "Usuario agregado/actualizado correctamente"}),
            }
        except Exception as e:
            return {
                "statusCode": 500,
                "body": json.dumps({"error": f"Error agregando usuario: {str(e)}"}),
            }

    else:
        return {
            "statusCode": 405,
            "body": json.dumps({"error": "Método HTTP no soportado"}),
        }

