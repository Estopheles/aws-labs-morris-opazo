# AWS Labs - Morris & Opazo

Este repositorio contiene una colección de 4 laboratorios prácticos de AWS desarrollados siguiendo las metodologías de Morris & Opazo, enfocados en servicios fundamentales de la nube.

## 📋 Laboratorios Incluidos

### Lab 01: RDS Fundamentals

**Directorio:** `lab-01-rds-fundamentals/`

- **Objetivo:** Crear una instancia Amazon RDS (Microsoft SQL Server) dentro de una VPC
- **Servicios:** Amazon RDS, VPC, Security Groups, Subnet Groups
- **Destacado:** Configuración completa de red, seguridad y alta disponibilidad
- **Duración:** ~45 minutos

### Lab 02: DMS Migration

**Directorio:** `lab-02-dms-migration/`

- **Objetivo:** Migrar datos de RDS a Amazon Redshift usando AWS DMS
- **Servicios:** AWS DMS, Amazon Redshift, IAM Roles, CloudShell
- **Destacado:** Migración entre motores de BD diferentes, configuración de endpoints
- **Prerequisito:** Lab 01 completado

### Lab 03: Serverless Architecture

**Directorio:** `lab-03-serverless/`

- **Objetivo:** Crear una API serverless completa para gestión de usuarios
- **Servicios:** DynamoDB, Lambda, API Gateway
- **Destacado:** Métodos GET/POST, validación desde navegador y CloudShell
- **Bonus:** API adicional para gestión de libros

### Lab 04: Athena Quest

**Directorio:** `lab-04-athena-quest/`

- **Objetivo:** Análisis de datos usando S3 y Athena
- **Servicios:** Amazon S3, Amazon Athena
- **Destacado:** Consultas SQL sobre archivos CSV, creación de tablas
- **Duración:** ~60 minutos

## 🛠️ Tecnologías Utilizadas

- **Bases de Datos:** Amazon RDS (SQL Server), Amazon DynamoDB, Amazon Redshift
- **Compute:** AWS Lambda
- **APIs:** Amazon API Gateway
- **Storage:** Amazon S3
- **Analytics:** Amazon Athena
- **Migration:** AWS Database Migration Service (DMS)
- **Networking:** VPC, Security Groups, Subnet Groups
- **Tools:** AWS CloudShell

## 📁 Estructura del Proyecto

```
aws-labs-morris-opazo/
├── README.md                           # Este archivo
├── lab-01-rds-fundamentals/           # RDS y configuración de BD
├── lab-02-dms-migration/              # Migración con DMS  
├── lab-03-serverless/                 # Arquitectura serverless
└── lab-04-athena-quest/               # Analytics con Athena
```

## 🚀 Cómo Usar Este Repositorio

1. **Clona el repositorio**:
   
   ```bash
   git clone https://github.com/TU_USUARIO/aws-labs-morris-opazo.git
   ```

2. **Sigue el orden recomendado**:
   
   - Lab 01 → Lab 02 (secuencial)
   - Lab 03 y Lab 04 (independientes)

3. **Navega a cada laboratorio**:
   
   ```bash
   cd lab-01-rds-fundamentals
   ```

4. **Sigue el README específico** de cada lab para instrucciones detalladas

## 📖 Documentación

Cada laboratorio incluye:

- ✅ README específico con instrucciones paso a paso
- 🖼️ Screenshots del proceso completo
- 📊 Diagramas de arquitectura
- 💾 Scripts y código fuente
- 🧪 Casos de prueba y validación

**Documentación adicional:**

- 📄 Reportes detallados en PDF disponibles en la carpeta `docs/`
- 🎥 Referencias a videos guía cuando están disponibles

## 📝 Aprendizajes Clave

1. **Fundamentos RDS:** Configuración de bases de datos relacionales en la nube
2. **Migración de Datos:** Uso de DMS para migrar entre diferentes motores de BD
3. **Arquitecturas Serverless:** Integración Lambda + DynamoDB + API Gateway
4. **Análisis de Datos:** Uso de Athena para consultas SQL sobre datos en S3
5. **Networking AWS:** Configuración de VPC, subredes y grupos de seguridad
6. **IAM y Permisos:** Gestión de roles y políticas para servicios AWS

## 🎯 Casos de Uso Prácticos

- **Migración de aplicaciones legacy** a la nube
- **APIs REST serverless** para aplicaciones modernas
- **Data Lake y análisis** de grandes volúmenes de datos
- **Arquitecturas híbridas** con diferentes servicios de AWS

## ⚡ Consejos Importantes

- **Región:** Todos los labs están configurados para `us-east-1`
- **Costos:** Cada lab incluye instrucciones de cleanup para evitar costos
- **Prerequisites:** Verificar que tienes acceso a los servicios AWS necesarios
- **Orden:** Los Labs 01 y 02 deben realizarse secuencialmente

## 👨‍💻 Autor

**Christhian Alberto Rodríguez García**  
Laboratorios realizados como parte del programa de capacitación AWS de Morris & Opazo

## 📊 Estadísticas del Proyecto

- 🔢 **4 laboratorios** completos
- 📁 **24 directorios** organizados
- 📄 **92 archivos** documentados
- ⏱️ **~3 horas** de contenido práctico

---

*Este repositorio documenta el proceso de aprendizaje práctico de servicios AWS, incluyendo tanto éxitos como desafíos encontrados durante la implementación.*
