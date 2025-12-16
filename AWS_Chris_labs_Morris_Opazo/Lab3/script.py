POST

curl -X POST https://48n2q7a763.execute-api.us-east-1.amazonaws.com/usuariotest/Usuarios \
  -H "Content-Type: application/json" \
  -d '{"username":"Christhian", "país":"Mexico", "color_favorito":"verde", "password":"Noa123"}'
  
GET

curl -X GET \
  "https://48n2q7a763.execute-api.us-east-1.amazonaws.com/usuariotest/Usuarios?username=Roberto"

---
DESAFIO
---


-Post

curl -X POST "https://ku9hnhicdj.execute-api.us-east-1.amazonaws.com/libros-stage/Libros" \
-H "Content-Type: application/json" \
-d '{
  "titulo": "El Principito",
  "autor": "Antoine de Saint-Exupéry",
  "anio": 1943
}'

-GET


