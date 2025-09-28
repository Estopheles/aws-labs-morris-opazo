import json
import boto3

# Configurar el cliente de DynamoDB
dynamodb = boto3.resource('dynamodb', region_name='us-east-1')
table = dynamodb.Table('Libros')

def lambda_handler(event, context):
    http_method = event.get('httpMethod', '')
    
    if http_method == 'GET':
        titulo = event.get('queryStringParameters', {}).get('titulo')
        if not titulo:
            return {
                "statusCode": 400,
                "body": json.dumps({"error": "Se requiere el parámetro 'titulo'"}),
            }
        
        try:
            response = table.get_item(Key={'titulo': titulo})
        except Exception as e:
            return {
                "statusCode": 500,
                "body": json.dumps({"error": f"Error accediendo a DynamoDB: {str(e)}"}),
            }
        
        if 'Item' in response:
            return {
                "statusCode": 200,
                "body": json.dumps({
                    "existe": True,
                    "libro": response['Item']
                }),
            }
        else:
            return {
                "statusCode": 200,
                "body": json.dumps({
                    "existe": False,
                    "mensaje": f"El libro '{titulo}' no existe en la base de datos"
                }),
            }

    elif http_method == 'POST':
        try:
            body = json.loads(event.get('body', '{}'))
        except json.JSONDecodeError:
            return {
                "statusCode": 400,
                "body": json.dumps({"error": "Body JSON inválido"}),
            }
        
        # Validar que se proporcionen los campos requeridos
        if not body.get('titulo') or not body.get('autor'):
            return {
                "statusCode": 400,
                "body": json.dumps({"error": "Se requieren titulo y autor"}),
            }
        
        item = {
            'titulo': body['titulo'],
            'autor': body['autor'],
            'año': body.get('año', 0)
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
            "body": json.dumps({"message": "Libro agregado con éxito"}),
        }
    
    else:
        return {
            "statusCode": 405,
            "body": json.dumps({"error": "Método HTTP no permitido"}),
        }
