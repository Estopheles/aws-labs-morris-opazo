# Lab 02: DMS Migration - RDS to Redshift

## Objetivo

Migrar datos de Amazon RDS (SQL Server) a Amazon Redshift utilizando AWS Database Migration Service (DMS), configurando todos los componentes necesarios para una migración exitosa.

## Prerrequisitos

- **Lab 01 completado:** Instancia RDS funcionando con datos cargados
- **VPC:** Lab-VPC configurada
- **Datos:** Tabla UniversityScores en la base de datos UniversityDB

## Arquitectura del Lab

```
┌─────────────────────────────────────────────────────────────┐
│                        AWS Cloud                            │
│                                                             │
│  ┌─────────────────┐    ┌─────────────────┐    ┌─────────┐  │
│  │   Source RDS    │    │   DMS Instance  │    │ Target  │  │
│  │  (SQL Server)   │────│   Replication   │────│Redshift │  │
│  │                 │    │                 │    │Cluster  │  │
│  │ UniversityDB    │    │   Endpoints:    │    │  dev    │  │
│  │ UniversityScores│    │   - lab-ep1     │    │database │  │
│  │                 │    │   - lab-ep2     │    │         │  │
│  └─────────────────┘    └─────────────────┘    └─────────┘  │
│                                                             │
│                    VPC: Lab-VPC                            │
│               Security Groups + IAM Roles                  │
└─────────────────────────────────────────────────────────────┘
```

## Componentes Principales

### 1. Preparación de Datos (CloudShell)

- Instalación de sqlcmd en CloudShell
- Carga de datos con script worldurank.sql
- Verificación de datos en RDS

### 2. Configuración DMS

- Security Group para DMS
- Subnet Group para DMS
- Instancia de Replicación DMS

### 3. Configuración Redshift

- Creación de IAM Roles
- Cluster Subnet Group
- Cluster Redshift

### 4. Endpoints y Migración

- Endpoint origen (RDS)
- Endpoint destino (Redshift)
- Tarea de migración

## Pasos de Implementación

### Fase 1: Preparación de Datos en CloudShell

1. **Subir archivo SQL a CloudShell**
   
   - Usar Actions → Upload File
   - Subir worldurank.sql

2. **Instalar sqlcmd**
   
   ```bash
   sudo curl https://packages.microsoft.com/config/rhel/7/prod.repo | sudo tee /etc/yum.repos.d/msprod.repo
   sudo yum install -y mssql-tools msodbcsql17
   echo 'export PATH="$PATH:/opt/mssql-tools/bin"' >> ~/.bashrc
   source ~/.bashrc
   ```

3. **Crear base de datos y cargar datos**
   
   ```bash
   sqlcmd -S <RDS_ENDPOINT> -U admin -P "#LabDBase3!" -Q "CREATE DATABASE UniversityDB;"
   sqlcmd -S <RDS_ENDPOINT> -U admin -P "#LabDBase3!" -d UniversityDB -i worldurank.sql
   ```

4. **Verificar datos**
   
   ```bash
   sqlcmd -S <RDS_ENDPOINT> -U admin -P "#LabDBase3!" -d UniversityDB -Q "SELECT TOP 5 * FROM UniversityScores;"
   ```

### Fase 2: Configuración DMS

1. **Crear Security Group para DMS**
   
   - Nombre: DMS-SecurityGroup
   - Reglas: All traffic (0.0.0.0/0) + RDP (0.0.0.0/0)

2. **Crear DMS Subnet Group**
   
   - Nombre: dms-subnetgroup
   - VPC: Lab-VPC
   - Subnets: Seleccionar las 2 subnets disponibles

3. **Crear Instancia de Replicación**
   
   - Nombre: dms-labtest
   - Instance class: dms.t3.small
   - Engine version: 3.5.3
   - VPC: Lab-VPC
   - Publicly accessible: Yes
   - Subnet group: dms-subnetgroup

### Fase 3: Configuración IAM y Redshift

1. **Crear Roles IAM**
   
   - **Para Redshift:** myRedshiftRole
     - Políticas: AmazonS3ReadOnlyAccess, AmazonDMSRedshiftS3Role, AmazonDMSVPCManagementRole, AmazonS3FullAccess, AWSMigrationHubDMSAccess
   - **Para DMS:** myDMSRole
     - Política: AmazonDMSRedshiftS3Role

2. **Crear Redshift Cluster Subnet Group**
   
   - Nombre: redshift-lab-subnetgroup
   - VPC: Lab-VPC
   - Subnets: Agregar todas las subnets de la VPC

3. **Crear Cluster Redshift**
   
   - Identifier: lab-cluster
   - Node type: ra3.large
   - Number of nodes: 1
   - Admin user: awsuser
   - Password: #LabDBase3!
   - VPC: Lab-VPC
   - Publicly accessible: Yes
   - Associated IAM roles: myRedshiftRole

### Fase 4: Endpoints y Migración

1. **Crear Endpoint Origen (RDS)**
   
   - Identifier: lab-ep1
   - Source engine: Microsoft SQL Server
   - Server name: <RDS_ENDPOINT>
   - Port: 1433
   - Username: admin
   - Password: #LabDBase3!
   - Database: UniversityDB

2. **Crear Endpoint Destino (Redshift)**
   
   - Identifier: lab-ep2
   - Target engine: Amazon Redshift
   - Server name: <REDSHIFT_ENDPOINT>
   - Port: 5439
   - Username: awsuser
   - Password: #LabDBase3!
   - Database: dev

3. **Crear Tarea de Migración**
   
   - Task identifier: lab-task
   - Replication instance: dms-labtest
   - Source endpoint: lab-ep1
   - Target endpoint: lab-ep2
   - Migration type: Migrate existing data
   - Schema: dbo
   - Table name: % (todas las tablas)

## Archivos del Proyecto

```
lab-02-dms-migration/
├── README.md
├── docs/
│   ├── LabDMSFinalArch.png
│   └── LabDMSTemplateArch.png
├── cloudshell-commands/
│   └── Scripts-CloudShell/
│       └── ScripstsCloudShell.txt
├── sql-scripts/
│   └── Script-SQL/
│       └── worldurank.sql
└── screenshots/
    ├── add_subnets.png
    ├── associate_dms_role_cluster.png
    ├── Captura2.png
    ├── Captura34.png
    ├── catcloudshell.png
    ├── clouster_redshift1.png
    ├── datatask_creating.png
    ├── dms_endpoint2.png
    ├── dms_endpoint3.png
    ├── dms_off.png
    ├── endpoint.png
    ├── endpoint2.png
    ├── endpint2.png
    ├── endpointDMS_Redshift.png
    ├── EndpointsFInal.png
    ├── IAM_REDSHIFT.png
    ├── iam_rol.png
    ├── iinstancereplication2.png
    ├── instancereplication01.png
    ├── instancereplication3.png
    ├── migration_tasj.png
    ├── MuestraCloudShell_FInal.png
    ├── NOSEPUEDE.png
    ├── redshift1.png
    ├── redshift_clouster.png
    ├── redshift_security_vpc_lab.png
    ├── replicationinstance.png
    ├── results.png
    ├── rolesRedShift4.png
    ├── securitygroup1.png
    ├── sifunciono!.png
    ├── subnetgroups_dns.png
    ├── taskmigration1.png
    └── turnof_data_task.png
```

**Documentación completa:** Ver `docs/lab-01-02-rds-dms-report.pdf` en la raíz del proyecto.

## Configuraciones Específicas

### DMS Replication Instance

- **Instance Class:** dms.t3.small
- **Engine Version:** 3.5.3 (recomendada para evitar errores)
- **VPC:** Lab-VPC
- **Multi-AZ:** No (para laboratorio)

### Redshift Cluster

- **Node Type:** ra3.large
- **Cluster Type:** Single-node
- **Database:** dev (por defecto)
- **Encryption:** AWS managed key

### Table Mapping Rules

```json
{
  "rules": [
    {
      "rule-type": "selection",
      "rule-id": "1",
      "rule-name": "1",
      "object-locator": {
        "schema-name": "dbo",
        "table-name": "%"
      },
      "rule-action": "include"
    }
  ]
}
```

## Resultados Esperados

### Migración Exitosa

- Estado de tarea: "Load complete"
- Datos migrados: Tabla UniversityScores
- Registros: 500 filas aproximadamente
- Verificación: Consulta en Redshift Query Editor

### Verificación Final

```sql
-- En Redshift Query Editor
SELECT * FROM public.universityscores LIMIT 10;
SELECT COUNT(*) FROM public.universityscores;
```

## Troubleshooting Común

### Error: "Endpoint connection failed"

**Solución:** Verificar Security Groups y que los endpoints tengan acceso a la VPC

### Error: "IAM role not associated"

**Solución:** Asegurar que los roles IAM están correctamente asociados al cluster Redshift

### Error: "DMS version compatibility"

**Solución:** Usar engine version 3.5.3 para mejor compatibilidad

### Error: "Table mapping failed"

**Solución:** Verificar que el esquema "dbo" existe y contiene las tablas

## Lecciones Aprendidas

### Conceptos Clave

- **DMS:** Servicio gestionado para migración de bases de datos
- **Replication Instance:** Instancia que ejecuta las tareas de migración
- **Endpoints:** Conexiones a bases de datos origen y destino
- **Table Mapping:** Configuración de qué datos migrar

### Mejores Prácticas

- Usar versiones estables de DMS engine
- Configurar correctamente IAM roles antes de crear recursos
- Verificar conectividad de endpoints antes de crear tareas
- Monitorear el progreso de migración en tiempo real

### Preparación para Labs Siguientes

Los datos migrados en Redshift pueden ser utilizados para análisis adicionales o como fuente para otros servicios de AWS.

## Comandos de Cleanup

```bash
# Detener tarea de migración
# Eliminar endpoints
# Eliminar instancia de replicación
# Eliminar cluster Redshift
# Eliminar roles IAM (opcional)
```

## Estimación de Tiempo

- **Preparación datos:** 20 minutos
- **Configuración DMS:** 15 minutos
- **Configuración IAM/Redshift:** 20 minutos
- **Endpoints y migración:** 15 minutos
- **Tiempo de migración:** 10-15 minutos
- **Verificación:** 10 minutos

**Total:** ~90-95 minutos

## Conexión con Otros Labs

Este laboratorio completa la migración de datos iniciada en **Lab 01** y prepara el entorno para análisis avanzados que podrían realizarse en laboratorios adicionales.
