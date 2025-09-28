-- Lab 4 Athena Quest: Crear Tabla de Libros
-- Este archivo crea la tabla externa que apunta a los datos en S3

-- Usar la base de datos creada
USE librosdb;

-- Crear tabla externa apuntando a los datos CSV en S3
CREATE EXTERNAL TABLE `tablalibros` (
  `autor` string COMMENT 'Nombre del autor del libro',
  `libro` string COMMENT 'Título del libro',
  `year` int COMMENT 'Año de publicación del libro'
)
ROW FORMAT SERDE 'org.apache.hadoop.hive.serde2.lazy.LazySimpleSerDe'
WITH SERDEPROPERTIES (
  'serialization.format' = ',',
  'field.delim' = ','
) 
LOCATION 's3://[tu-bucket-de-datos]/'
TBLPROPERTIES (
  'classification' = 'csv',
  'skip.header.line.count' = '1'
);

-- Nota: Reemplazar [tu-bucket-de-datos] con el nombre real del bucket S3
-- donde subiste el archivo libros_laboratorio.csv
