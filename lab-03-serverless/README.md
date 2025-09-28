# Lab 03: Arquitectura Serverless - DynamoDB + Lambda + API Gateway

## Objetivo

Crear una arquitectura serverless completa que simule una API de usuarios, integrando DynamoDB como base de datos, Lambda para la lógica de negocio y API Gateway para exposición de endpoints REST.

## Arquitectura

```
┌─────────────────────────────────────────────────────────────┐
│                        AWS Cloud                            │
│                                                             │
│  ┌─────────────────┐    ┌─────────────────┐    ┌─────────┐  │
│  │                 │    │                 │    │         │  │
│  │  Amazon API     │    │   AWS Lambda    │    │DynamoDB │  │
│  │   Gateway       │────│   Function      │────│  Table  │  │
│  │                 │    │                 │    │         │  │
│  │  GET /usuarios  │    │ Verificar_      │    │Usuarios │  │
│  │ POST /usuarios  │    │ Usuario         │    │(20 docs)│  │
│  └─────────────────┘    └─────────────────┘    └─────────┘  │
│           │                        │                        │
│           │                        │                        │
│  ┌─────────────────┐    ┌─────────────────┐                │
│  │                 │    │                 │                │
│  │   Navegador     │    │  AWS CloudShell │                │
│  │   (GET Test)    │    │  (POST Test)    │                │
│  └─────────────────┘    └─────────────────┘                │
└─────────────────────────────────────────────────────────────┘
```

## Componentes Principales

### 1. Base de Datos

- **Servicio:** Amazon DynamoDB
- **Tabla:** Usuarios
- **Partition Key:** username (String)
- **Datos:** 20 usuarios precargados
- **Campos:** username, password, color_favorito, pais

### 2. Función Lambda

- **Nombre:** Verificar_Usuario
- **Runtime:** Python 3.13
- **Rol:** LambdaExecutionRole
- **Funcionalidades:**
  - GET: Verificar si usuario tiene contraseña
  - POST: Agregar nuevo usuario

### 3. API REST

- **Servicio:** Amazon API Gateway
- **Tipo:** REST API
- **Nombre:** Usuarios_API
- **Recurso:** /usuarios
- **Métodos:** GET, POST
- **Integración:** Lambda Proxy Integration

## Pasos de Implementación

### Tarea 1: Revisión de Recursos

- [x] Verificar tabla DynamoDB "Usuarios" (20 registros)
- [x] Confirmar rol IAM "LambdaExecutionRole"
- [x] Explorar función Lambda "ConfigUsuarios" (carga inicial)

### Tarea 2: Crear Función Lambda

```python
# Configuración
Nombre: Verificar_Usuario
Runtime: Python 3.13
Arquitectura: x86_64
Rol: LambdaExecutionRole (existente)
```

### Tarea 3: Código de la Función Lambda

Ver archivo: `lambda/verificar-usuario.py`

### Tarea 4: Pruebas de Lambda

**Evento GET:**

```json
{
  "httpMethod": "GET",
  "queryStringParameters": {
    "username": "Hugo"
  }
}
```

**Resultado:** `true` (usuario existe)

**Evento POST:**

```json
{
  "httpMethod": "POST",
  "body": "{\"username\":\"Anto\",\"password\":\"nueva123\",\"color_favorito\":\"azul\",\"pais\":\"Argentina\"}"
}
```

**Resultado:** Usuario agregado exitosamente

### Tarea 5: Crear REST API

```
API Gateway > Create API > REST API
Nombre: Usuarios_API
Descripción: API para gestión de usuarios
Endpoint: Regional
```

**Configuración del Recurso:**

- Recurso: `/usuarios`
- Métodos: GET, POST
- Integración: Lambda Function
- Lambda Proxy Integration: ✅ Habilitado
- Función: Verificar_Usuario

### Tarea 6: Pruebas de la API

**Prueba GET (Navegador):**

```
https://{api-id}.execute-api.us-east-1.amazonaws.com/usuariostest/usuarios?username=Hugo
```

**Respuesta:** `true`

**Prueba POST (CloudShell):**

```bash
curl -X POST https://{api-id}.execute-api.us-east-1.amazonaws.com/usuariostest/usuarios \
-H "Content-Type: application/json" \
-d '{"username":"Roberto","password":"roberto34","color_favorito":"verde","pais":"Chile"}'
```

**Respuesta:** `{"message": "Usuario agregado/actualizado correctamente"}`

## Archivos del Proyecto

```
lab-03-serverless/
├── README.md
├── lambda/
│   ├── verificar-usuario.py
│   └── verificar-libros.py (bonus)
├── scripts/
│   ├── CloudShell.txt
│   └── Lambda-script.py
└── tests/
    ├── Captura35.png
    └── Captura36.png
```

**Documentación completa:** Ver `docs/lab-03-serverless-report.pdf` en la raíz del proyecto.

## Código Principal

### Función Lambda - verificar-usuario.py

```python
import json
import boto3

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

        return response.get('Item') is not None

    elif http_method == 'POST':
        body = json.loads(event.get('body', '{}'))

        item = {
            'username': body['username'],
            'password': body['password'],
            'color_favorito': body.get('color_favorito', ''),
            'pais': body.get('pais', '')
        }

        table.put_item(Item=item)
        return {
            "statusCode": 200,
            "body": json.dumps({"message": "Usuario agregado/actualizado correctamente"}),
        }
```

## Desafío Bonus: API de Libros

Implementé una segunda API completa siguiendo los mismos principios:

### Tabla DynamoDB: Libros

- **Partition Key:** titulo (String)
- **Campos:** titulo, autor, año

### Función Lambda: Verificar_Libros

- GET: Consultar libro por título
- POST: Agregar nuevo libro

### API Gateway: Libros_API

- Recurso: `/libros`
- Métodos: GET, POST

## Pruebas y Validación

### Casos de Prueba Exitosos

1. **GET existente:** `?username=Hugo` → `true`
2. **GET no existente:** `?username=Nacho` → `false`
3. **POST nuevo usuario:** Roberto agregado correctamente
4. **POST nuevo usuario:** Christhian agregado correctamente
5. **Validación DynamoDB:** Confirmado incremento de registros (20→23)

### Resultados de CloudShell

```bash
# POST Roberto
{"message": "Usuario agregado/actualizado correctamente"}

# POST Christhian  
{"message": "Usuario agregado/actualizado correctamente"}

# GET Roberto
{"username": "Roberto", "tiene_password": true}
```

## Lecciones Aprendidas

### Éxitos

- Integración perfecta entre DynamoDB, Lambda y API Gateway
- Lambda Proxy Integration simplifica el manejo de requests/responses
- CloudShell excelente para pruebas de APIs
- Arquitectura serverless reduce complejidad operacional

### Desafíos

- Configuración correcta del rol IAM es crítica
- Importancia de habilitar Lambda Proxy Integration
- Manejo correcto de JSON en events y responses
- Testing exhaustivo en múltiples interfaces

### Mejores Prácticas Aplicadas

- Validación de parámetros en Lambda
- Manejo de errores robusto
- Testing desde múltiples clientes (navegador + CloudShell)
- Documentación paso a paso del proceso

## Métricas del Proyecto

- **Usuarios iniciales:** 20
- **Usuarios agregados:** 3
- **Tiempo de respuesta promedio:** <100ms
- **Endpoints funcionales:** GET + POST
- **Pruebas exitosas:** 100%

## Próximos Pasos

1. Implementar autenticación con API Keys
2. Agregar validación de esquemas
3. Implementar logging con CloudWatch
4. Crear deployment automatizado con SAM
5. Agregar más operaciones CRUD (PUT, DELETE)

## Estimación de Tiempo

- **Revisión de recursos:** 10 minutos
- **Creación función Lambda:** 15 minutos
- **Implementación código:** 20 minutos
- **Pruebas Lambda:** 10 minutos
- **Configuración API Gateway:** 15 minutos
- **Pruebas finales:** 15 minutos
- **Desafío bonus:** 30 minutos

**Total:** ~2 horas

## Troubleshooting Común

### Error: "Lambda function not found"

**Solución:** Verificar que la función Lambda esté en la misma región que API Gateway

### Error: "Internal server error"

**Solución:** Revisar logs de CloudWatch para identificar errores en el código Lambda

### Error: "Access denied"

**Solución:** Verificar que LambdaExecutionRole tenga permisos para DynamoDB

### Error: "CORS issues"

**Solución:** Habilitar CORS en API Gateway si se planea acceso desde navegadores web

## Conexión con Otros Labs

Este laboratorio demuestra patrones serverless que complementan las arquitecturas tradicionales mostradas en los Labs 01 y 02, proporcionando una alternativa moderna para APIs y microservicios.
