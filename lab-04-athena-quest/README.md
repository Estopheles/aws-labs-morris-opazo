# Lab 04: Athena Quest - Análisis de Datos con S3 y Athena

## Objetivo

Aprender a usar Amazon S3 como data lake y Amazon Athena para realizar consultas SQL que permitan explorar y analizar información, creando un flujo completo de almacenamiento y análisis de datos sin servidores.

## Arquitectura del Lab

```
┌─────────────────────────────────────────────────────────────┐
│                        AWS Cloud                            │
│                                                             │
│  ┌─────────────────┐                          ┌───────────┐ │
│  │   Estudiante    │                          │           │ │
│  │                 │    1. Upload CSV         │ Amazon S3 │ │
│  │ ┌─────────────┐ │───────────────────────▶  │  Bucket   │ │
│  │ │libros_lab.csv││                          │   datos   │ │
│  │ └─────────────┘ │                          │           │ │
│  └─────────────────┘                          └─────┬─────┘ │
│                                                     │       │
│                                                     ▼       │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │                 Amazon Athena                           │ │
│  │              Query Editor (Trino SQL)                   │ │
│  │                                                         │ │
│  │  CREATE TABLE tablalibros                              │ │
│  │  SELECT * FROM tablalibros WHERE autor = 'Dean Koontz' │ │
│  └───────────────────────┬─────────────────────────────────┘ │
│                              │                               │
│                              ▼                               │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │                   Amazon S3                             │ │
│  │               Bucket resultados                         │ │
│  │           (Query Results Storage)                       │ │
│  └─────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

## Conceptos Fundamentales

### Amazon S3 (Simple Storage Service)

- Servicio de almacenamiento de objetos escalable y seguro
- Los buckets deben tener nombres únicos globalmente
- Configuración por defecto bloquea acceso público
- Ideal para data lakes y almacenamiento de archivos

### Amazon Athena

- Servicio de consultas que permite analizar datos en S3 usando SQL
- Serverless: sin servidores que configurar o administrar
- Utiliza motor Trino SQL para consultas rápidas
- Los resultados se almacenan automáticamente en S3

## Datos del Laboratorio

### Archivo: libros_laboratorio.csv

**Fuente:** [workshop-mo.s3.us-east-1.amazonaws.com/libros_laboratorio.csv](https://workshop-mo.s3.us-east-1.amazonaws.com/libros_laboratorio.csv)

**Estructura:**

- `autor` (string): Nombre del autor
- `libro` (string): Título del libro
- `year` (int): Año de publicación

**Contenido:** Base de datos de libros con información de múltiples autores y décadas

## Pasos de Implementación

### Tarea 1: Preparar los Datos

1. **Descargar archivo de datos**
   - Obtener `libros_laboratorio.csv` del workshop
   - Revisar estructura y contenido del archivo

### Tarea 2: Crear Bucket S3 para Datos

1. **Ir a Amazon S3**
2. **Crear nuevo bucket:**
   - Nombre único (ej: `mi-bucket-datos-libros-[iniciales]`)
   - Región: us-east-1
   - Configuración: Por defecto (acceso público bloqueado)

### Tarea 2.1: Cargar Datos al Bucket

1. **Abrir el bucket creado**
2. **Seleccionar "Cargar"**
3. **Agregar archivos:** Subir `libros_laboratorio.csv`
4. **Completar la carga**

### Tarea 3: Crear Bucket para Resultados de Athena

1. **Crear segundo bucket S3:**
   - Nombre único (ej: `mi-bucket-resultados-athena-[iniciales]`)
   - Mismo proceso que el bucket anterior
   - Propósito: Almacenar resultados de consultas Athena

### Tarea 4: Configurar Athena

1. **Ir a Amazon Athena**
2. **Seleccionar "Iniciar el editor de consultas"**
3. **Verificar:** Opción "Consulte sus datos con Trino SQL" seleccionada
4. **Configurar ubicación de resultados:**
   - Ir a configuración
   - Establecer bucket de resultados: `s3://mi-bucket-resultados-athena-[iniciales]/`

### Tarea 5: Crear Tabla en Athena

1. **Crear base de datos:**
   
   ```sql
   CREATE DATABASE librosdb;
   ```

2. **Seleccionar "Datos del bucket S3"**

3. **Configuración de tabla:**
   
   - Nombre tabla: `tablalibros`
   - Base de datos: `librosdb`
   - Seleccionar bucket de datos
   - Formato: CSV
   - Tipo de tabla: Apache Hive (por defecto)

4. **Definir columnas:**
   
   ```
   autor string, libro string, year int
   ```

5. **Crear tabla** y verificar vista previa

### Tarea 6: Realizar Consultas SQL

## Consultas del Laboratorio

### 1. Ver todos los libros

```sql
SELECT * FROM tablalibros;
```

### 2. Libros de Dean Koontz

```sql
SELECT * 
FROM tablalibros
WHERE autor = 'Dean Koontz';
```

### 3. Libros después del año 2000

```sql
SELECT * 
FROM tablalibros
WHERE year > 2000;
```

### 4. Autores únicos

```sql
SELECT DISTINCT autor 
FROM tablalibros;
```

### 5. Libros ordenados cronológicamente

```sql
SELECT * 
FROM tablalibros
ORDER BY year ASC;
```

### 6. Libros de 1999

```sql
SELECT libro, year
FROM tablalibros
WHERE year = 1999;
```

## Archivos del Proyecto

```
lab-04-athena-quest/
├── README.md
├── docs/
│   ├── Arquitectura Athena.png
│   └── Laboratorio Serverless (DynamoDB - Lambda - API Gateway) AWS.pdf
├── data/
│   └── libros_laboratorio.csv
├── screenshots/
│   ├── 2025-09-05 19.33.01 us-east-1.console.aws.amazon.com 8025f0809b73.png
│   ├── 2025-09-05 19.34.09 us-east-1.console.aws.amazon.com 7cdad714f979.png
│   ├── autorlibros.png
│   ├── paso2Athena.png
│   ├── paso3Athena.png
│   ├── paso4Athena.png
│   ├── paso5Athena.png
│   ├── paso7Athena.png
│   ├── pasoAthena6.png
│   ├── Screenshot From 2025-09-05 19-18-18.png
│   ├── Screenshot From 2025-09-05 19-25-59.png
│   ├── Screenshot From 2025-09-05 19-27-41.png
│   └── Screenshot From 2025-09-05 19-29-05.png
└── sql-queries/
    ├── advanced-queries.sql
    ├── basic-queries.sql
    ├── create-database.sql
    └── create-table.sql
```

**Documentación adicional:** Ver `docs/` en la raíz del proyecto para reportes detallados.

## Video Guía

**Enlace:** [workshopde-videos-lab.s3.us-east-1.amazonaws.com/lab_athena.mp4](https://workshopde-videos-lab.s3.us-east-1.amazonaws.com/lab_athena.mp4)

## Configuraciones Técnicas

### Configuración de Athena

- **Motor de consultas:** Trino SQL
- **Formato de datos:** CSV
- **SerDe:** LazySimpleSerDe
- **Delimitador:** Coma (,)
- **Ubicación de resultados:** S3 bucket dedicado

### Permisos Requeridos

- **S3:** Lectura del bucket de datos
- **S3:** Escritura en bucket de resultados
- **Athena:** Permisos de ejecución de consultas

## Resultados Esperados

### Datos Procesados

- Tabla `tablalibros` creada exitosamente
- Datos CSV importados y accesibles
- Consultas ejecutándose sin errores

### Consultas Funcionales

- 6 consultas básicas del laboratorio funcionando
- Resultados coherentes y precisos
- Datos almacenados en bucket de resultados

### Análisis Completado

- Identificación de autores únicos
- Análisis temporal de publicaciones
- Filtrado por criterios específicos

## Troubleshooting Común

### Error: "Table not found"

**Solución:** Verificar que la base de datos esté seleccionada y la tabla creada correctamente

### Error: "Access denied to S3"

**Solución:** Confirmar permisos de Athena para acceder al bucket de datos

### Error: "Query results location not set"

**Solución:** Configurar ubicación de resultados en settings de Athena

### Error: "SerDe error"

**Solución:** Verificar formato CSV y configuración de delimitadores

## Comandos de Limpieza

```sql
-- Eliminar tabla (ejecutar primero)
DROP TABLE tablalibros;

-- Eliminar base de datos (ejecutar después)
DROP DATABASE librosdb;
```

**Nota:** Siempre eliminar tablas antes que la base de datos.

## Lecciones Aprendidas

### Conceptos de Data Lake

- S3 como almacenamiento central de datos
- Separación de datos fuente y resultados
- Escalabilidad sin gestión de infraestructura

### Análisis Serverless

- SQL sobre datos almacenados sin ETL tradicional
- Consultas ad-hoc rápidas y flexibles
- Pago por consulta ejecutada

### Mejores Prácticas

- Naming conventions para buckets
- Organización de archivos en S3
- Configuración de permisos apropiados
- Documentación de consultas realizadas

## Casos de Uso Extendidos

### Análisis Potenciales

1. **Tendencias temporales:** Publicaciones por década
2. **Productividad de autores:** Libros por autor
3. **Análisis de contenido:** Búsquedas en títulos
4. **Estadísticas descriptivas:** Años promedio, rangos

### Expansiones Posibles

- Agregar más datasets de libros
- Combinar con datos de ventas
- Análisis de géneros literarios
- Integración con Amazon QuickSight para visualización

## Estimación de Tiempo

- **Preparación y descarga:** 5 minutos
- **Configuración S3:** 10 minutos
- **Configuración Athena:** 10 minutos
- **Creación de tabla:** 10 minutos
- **Ejecución de consultas:** 15 minutos
- **Análisis y documentación:** 10 minutos

**Total:** ~60 minutos

## Conexión con Otros Labs

Este laboratorio complementa los conocimientos adquiridos en:

- **Lab 01-02:** Gestión de bases de datos relacionales
- **Lab 03:** Arquitecturas serverless y APIs
- **Conjunto:** Ecosistema completo de datos en AWS
