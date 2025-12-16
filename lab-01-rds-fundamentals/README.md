# 🗄️ Lab 01: RDS Fundamentals - Crear Instancia RDS

[![AWS RDS](https://img.shields.io/badge/AWS-RDS-orange.svg)](https://aws.amazon.com/rds/)
[![SQL Server](https://img.shields.io/badge/Database-SQL%20Server-blue.svg)](https://www.microsoft.com/sql-server/)
[![Difficulty](https://img.shields.io/badge/Difficulty-Beginner-green.svg)](#)
[![Duration](https://img.shields.io/badge/Duration-45%20min-yellow.svg)](#)

> 🎯 **Objetivo:** Crear una instancia Amazon RDS (Microsoft SQL Server) dentro de una VPC existente, configurando los componentes de red y seguridad necesarios para una base de datos funcional y segura.

## 📋 Tabla de Contenidos

- [Arquitectura del Lab](#-arquitectura-del-lab)
- [Prerrequisitos](#-prerrequisitos)
- [Componentes a Crear](#-componentes-a-crear)
- [Pasos de Implementación](#-pasos-de-implementación)
- [Verificación](#-verificación)
- [Troubleshooting](#-troubleshooting)
- [Próximo Lab](#-próximo-lab)

## 🏗️ Arquitectura del Lab

```
┌─────────────────────────────────────────────────────────────┐
│                    Lab-VPC (Existente)                      │
│                                                             │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │                RDS Subnet Group                         │ │
│  │  ┌─────────────────┐    ┌─────────────────┐            │ │
│  │  │   AZ us-east-1a │    │   AZ us-east-1b │            │ │
│  │  │  Public-Subnet  │    │  Public-Subnet  │            │ │
│  │  │                 │    │                 │            │ │
│  │  │                 │    │  ┌───────────┐  │            │ │
│  │  │                 │    │  │ lab-      │  │            │ │
│  │  │                 │    │  │ database  │  │            │ │
│  │  │                 │    │  │ (SQL      │  │            │ │
│  │  │                 │    │  │ Server)   │  │            │ │
│  │  │                 │    │  └───────────┘  │            │ │
│  │  └─────────────────┘    └─────────────────┘            │ │
│  └─────────────────────────────────────────────────────────┘ │
│                                                             │
│         Security Group: RDS-SecurityGroup                  │ │
│         Rules: MSSQL (1433) + All Traffic                  │ │
└─────────────────────────────────────────────────────────────┘
```

## ✅ Prerrequisitos

- **VPC Existente:** Lab-VPC ya configurada por CloudFormation
- **Subnets:** Al menos 2 subnets en diferentes AZ
- **Route Tables:** Configuradas para acceso a internet
- **Internet Gateway:** Conectado a la VPC

## 🔧 Componentes a Crear

### 1. Security Group para RDS

**Nombre:** `RDS-SecurityGroup`

**Reglas de Entrada:**

- **Regla 1:** Todo el tráfico desde 0.0.0.0/0
- **Regla 2:** MSSQL (Puerto 1433) desde 0.0.0.0/0

### 2. RDS Subnet Group

**Nombre:** `RDS-SubnetGroup`

- **VPC:** Lab-VPC
- **Availability Zones:** us-east-1a y us-east-1b
- **Subnets:** 2 subnets correspondientes a las AZ seleccionadas

### 3. Instancia RDS

**Configuración Principal:**

- **Identificador:** lab-database
- **Motor:** Microsoft SQL Server Express Edition
- **Plantilla:** Free Tier
- **Usuario:** admin
- **Contraseña:** #LabDBase3!

## 🚀 Pasos de Implementación

### Paso 1: Crear Security Group

1. Ir a **VPC** → **Security Groups**
2. Crear nuevo Security Group:
   - Nombre: `RDS-SecurityGroup`
   - VPC: `Lab-VPC`
3. Configurar reglas de entrada:
   - Tipo: Todo el tráfico, Origen: 0.0.0.0/0
   - Tipo: MSSQL, Puerto: 1433, Origen: 0.0.0.0/0

### Paso 2: Crear RDS Subnet Group

1. Ir a **RDS** → **Subnet Groups**
2. Crear DB Subnet Group:
   - Name: `RDS-SubnetGroup`
   - VPC: `Lab-VPC`
   - Availability Zones: us-east-1a, us-east-1b
   - Subnets: Seleccionar las 2 subnets correspondientes

### Paso 3: Crear Instancia RDS

1. Ir a **RDS** → **Databases** → **Create Database**
2. **Método de creación:** Standard create
3. **Engine:** Microsoft SQL Server
4. **Edición:** SQL Server Express Edition (por defecto)
5. **Template:** Free Tier
6. **Settings:**
   - DB instance identifier: `lab-database`
   - Master username: `admin`
   - Credentials Management: Self Managed
   - Master password: `#LabDBase3!`
7. **Instance configuration:**
   - DB instance class: `db.t3.micro`
   - Storage type: General Purpose SSD (gp2)
8. **Connectivity:**
   - Compute resource: Don't connect to EC2
   - VPC: `Lab-VPC`
   - DB Subnet Group: `RDS-SubnetGroup`
   - Public access: **Yes**
   - VPC security group: `RDS-SecurityGroup`
   - Availability Zone: `us-east-1b`

## ✅ Verificación

1. Esperar que el estado cambie a **Available** (~5-10 minutos)
2. Verificar el endpoint en los detalles de la instancia
3. Confirmar configuración de VPC, subnet group y security group

## 📁 Archivos del Proyecto

```
lab-01-rds-fundamentals/
├── README.md
├── docs/
│   ├── diagramaAWS.png
│   └── LabRDSArch.png
└── screenshots/
    ├── 01-security-group-creation/
    │   └── CreateSecurityGroup.png
    ├── 02-subnet-group-setup/
    │   ├── ReglasDeEntrada.png
    │   ├── SubGroupRDS_Aurora.png
    │   └── subred_rds_desubred.png
    └── 03-rds-instance-creation/
        ├── base10.png
        ├── base11.png
        ├── base12.png
        ├── base2.png
        ├── base3.png
        ├── base4.png
        ├── base5.png
        ├── base6.png
        ├── base7.png
        ├── base8.png
        ├── base9.png
        ├── BaseDeDatos1.png
        └── exitobasededatos.png
```

**Documentación completa:** Ver `docs/lab-01-02-rds-dms-report.pdf` en la raíz del proyecto.

## ⚙️ Configuraciones Específicas

### Security Group Rules

```json
{
  "SecurityGroupRules": [
    {
      "Type": "All traffic",
      "Protocol": "All",
      "Port": "All",
      "Source": "0.0.0.0/0"
    },
    {
      "Type": "MSSQL",
      "Protocol": "TCP", 
      "Port": "1433",
      "Source": "0.0.0.0/0"
    }
  ]
}
```

### RDS Instance Parameters

- **Engine Version:** Por defecto (la más reciente)
- **DB Instance Class:** db.t3.micro (Free Tier)
- **Allocated Storage:** 20 GB (por defecto)
- **Storage Type:** gp2 (General Purpose SSD)
- **Multi-AZ:** No (Free Tier)
- **Backup Retention:** 7 días (por defecto)

## 🎯 Resultados Esperados

### Instancia RDS Creada

- **Estado:** Available
- **Endpoint:** Generado automáticamente
- **Puerto:** 1433
- **VPC:** Lab-VPC
- **Subnet Group:** RDS-SubnetGroup
- **Security Group:** RDS-SecurityGroup

### Conectividad Verificada

- Acceso público habilitado
- Security Group permite tráfico en puerto 1433
- Instancia ubicada en Availability Zone us-east-1b

## 🔧 Troubleshooting Común

### Error: "DB subnet group doesn't meet AZ coverage requirement"

**Solución:** Verificar que el subnet group incluya subnets de al menos 2 AZ diferentes

### Error: "Cannot create DB instance in VPC"

**Solución:** Confirmar que las subnets están correctamente configuradas y tienen acceso a internet

### Error: "Security group rules not working"

**Solución:** Verificar que las reglas de entrada estén configuradas correctamente y aplicadas al security group correcto

## 📚 Lecciones Aprendidas

### Conceptos Clave

- **VPC:** Aislamiento de red para recursos AWS
- **Subnet Groups:** Distribución de RDS en múltiples AZ para alta disponibilidad
- **Security Groups:** Firewall a nivel de instancia
- **Free Tier:** Limitaciones y beneficios para aprendizaje

### Mejores Prácticas Aplicadas

- Uso de múltiples Availability Zones
- Configuración de acceso público controlado
- Naming conventions consistentes
- Documentación de configuraciones

### Preparación para Labs Siguientes

Esta instancia RDS será utilizada en **Lab 02: DMS Migration** como fuente para la migración a Amazon Redshift.

## 💻 Comandos Útiles

### AWS CLI para Verificación

```bash
# Listar instancias RDS
aws rds describe-db-instances --query 'DBInstances[*].[DBInstanceIdentifier,DBInstanceStatus]'

# Verificar Security Groups
aws ec2 describe-security-groups --group-names RDS-SecurityGroup

# Listar Subnet Groups
aws rds describe-db-subnet-groups --db-subnet-group-name RDS-SubnetGroup
```

## ⏱️ Estimación de Tiempo

- **Preparación:** 5 minutos
- **Creación Security Group:** 5 minutos
- **Creación Subnet Group:** 5 minutos
- **Creación RDS Instance:** 10 minutos
- **Tiempo de provisioning:** 10-15 minutos
- **Verificación:** 5 minutos

**Total:** ~45 minutos

## ➡️ Próximo Lab

Una vez completado este laboratorio, la instancia RDS estará lista para ser utilizada como fuente de datos en el **Lab 02: Migración de Datos con DMS**, donde migraremos esta base de datos a Amazon Redshift.
