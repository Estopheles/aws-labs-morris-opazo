import json
import boto3

# Configurar el cliente de DynamoDB
dynamodb = boto3.resource('dynamodb', region_name='us-east-1')
table = dynamodb.Table('Usuarios')

def lambda_handler(event, context):
    http_method = event.get('httpMethod', '')
    
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
        
        # Retornar True si el usuario existe, False si no
        return response.get('Item') is not None

    elif http_method == 'POST':
        try:
            body = json.loads(event.get('body', '{}'))
        except json.JSONDecodeError:
            return {
                "statusCode": 400,
                "body": json.dumps({"error": "Body JSON inválido"}),
            }
        
        # Validar que se proporcionen los campos requeridos
        if not body.get('username') or not body.get('password'):
            return {
                "statusCode": 400,
                "body": json.dumps({"error": "Se requieren username y password"}),
            }
        
        item = {
            'username': body['username'],
            'password': body['password'],
            'color_favorito': body.get('color_favorito', ''),
            'pais': body.get('pais', '')
        }
        
        try:
            table.put_item(Item=item)
        except Exception as e:
            return {
                "statusCode": 500,
                "body": json.dumps({"error": f"Error insertando en DynamoDB: {str(e)}"}),
            }
        
        return {
            "statusCode": 200,
            "body": json.dumps({"message": "Usuario agregado/actualizado correctamente"}),
        }
    
    else:
        return {
            "statusCode": 405,
            "body": json.dumps({"error": "Método HTTP no permitido"}),
        }
