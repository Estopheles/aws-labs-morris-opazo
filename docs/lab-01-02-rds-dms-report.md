# Laboratorio AWS: Creación de una Instancia RDS y Migración de Datos a Redshift con DMS

### Autor: Christhian Alberto Rodríguez García

## Introducción

Este laboratorio es parte de mi aprendizaje en AWS para profundizar en la gestión de bases de datos y migración de datos en la nube. El objetivo fue crear una **instancia de Amazon RDS** (Microsoft SQL Server) dentro de una **VPC**, configurar **Security Groups** y **Subnet Groups** para garantizar seguridad y alta disponibilidad, y migrar datos a **Amazon Redshift** usando **AWS Database Migration Service (DMS)**. Este proyecto me permitió aplicar conceptos clave de arquitectura en la nube, como la configuración de redes, permisos IAM y migración de datos entre motores de bases de datos. ¡Acompáñame en este paso a paso!

## Objetivo

Crear una instancia de base de datos **Amazon RDS** dentro de una **VPC** existente y migrar datos a **Amazon Redshift** utilizando **AWS DMS**. Los componentes clave incluyen:

- **Security Group**: Para controlar el acceso a la base de datos.
- **Subnet Group**: Para garantizar alta disponibilidad en múltiples zonas de disponibilidad.
- **Instancia RDS**: Configuración de una base de datos Microsoft SQL Server.
- **Migración con DMS**: Transferencia de datos desde RDS a Redshift.

El objetivo de este laboratorio es crear una **instancia de base de datos RDS** dentro de una **VPC** existente. Específicamente, nos enfocaremos en tres componentes clave para su correcta configuración:

- La creación de un **grupo de seguridad** para controlar el acceso a la base de datos.

- La creación de un **grupo de subredes** de base de datos para garantizar la alta disponibilidad.

- El lanzamiento final de la **instancia RDS**.

#### **Amazon RDS (Relational Database Service)**

Amazon RDS es un servicio gestionado de bases de datos relacionales. Esto significa que AWS se encarga de las tareas administrativas pesadas como la instalación del sistema operativo, la aplicación de parches, la gestión de copias de seguridad y la escalabilidad de la infraestructura. Así, tú puedes concentrarte únicamente en la administración de tu base de datos y tus aplicaciones.

#### **VPC (Virtual Private Cloud)**

Una VPC es una **red virtual aislada** que te permite lanzar recursos de AWS en un entorno lógico que tú defines. Imagina que es como tu propio centro de datos privado dentro de la nube de AWS. Dentro de la VPC, puedes crear **subredes** públicas y privadas, y controlar el tráfico de red de manera granular.

#### **Grupo de Seguridad (Security Group)**

Un grupo de seguridad actúa como un **firewall virtual** a nivel de instancia. Controla el tráfico de entrada y salida (inbound y outbound) de tus recursos. En este laboratorio, lo usarás para definir qué direcciones IP o qué otros grupos de seguridad pueden conectarse a tu instancia RDS.

#### **Grupo de Subredes de RDS (RDS Subnet Group)**

Este es un componente crucial para la alta disponibilidad. Un grupo de subredes de RDS es una colección de subredes en tu VPC que puedes designar para tus instancias de bases de datos. Cuando creas una instancia de base de datos dentro de este grupo, Amazon RDS la ubicará en una de las subredes de una zona de disponibilidad diferente. En caso de una falla en esa zona, RDS puede cambiar automáticamente a una instancia en otra subred, garantizando que tu base de datos siga estando disponible.

## Creación del Security Group para RDS

- Nombre del grupo de seguridad: RDS-SecurityGroup
- Descripción: (Puedes dejarla en blanco)
- VPC: Elige Lab-VPC.

![CreateSecurityGroup.png](/home/christhianrodriguez/Documents/AWS_Chris_labs_Morris_Opazo/Lab1/CreateSecurityGroup.png)

- Regla 1:
  - Tipo: Todo el tráfico
  - Origen: 0.0.0.0/0
- Regla 1:
  - Tipo: MSSQL
  - Protocolo: TCP
  - Rango de puertos: 1433 (se pondrá automáticamente)
  - Origen: 0.0.0.0/0

![ReglasDeEntrada.png](/home/christhianrodriguez/Documents/AWS_Chris_labs_Morris_Opazo/Lab1/ReglasDeEntrada.png)

## Creación del Subnet Group para RDS

- Name: RDS-SubnetGroup
- Description: (Opcional pero recomendable)
- VPC: Elige Lab-VPC.

![SubGroupRDS_Aurora.png](/home/christhianrodriguez/Documents/AWS_Chris_labs_Morris_Opazo/Lab1/SubGroupRDS_Aurora.png)

### Subreds

- Availability Zones: Elige us-east-1a y us-east-1b.
- Subnets: Elige tus dos subnets correspondientes a las zonas de disponibilidad seleccionadas.

![subred_rds_desubred.png](/home/christhianrodriguez/Documents/AWS_Chris_labs_Morris_Opazo/Lab1/subred_rds_desubred.png)

## Creación de la Instancia RDS

En la consola de aws, buscamos Aurora y RDS, seleccionamos "database"" y despues 'create database'

![image](https://raw.githubusercontent.com/sebasshb/Laboratorio-RDS/refs/heads/main/Captura1.png)

Para fines de laboratorio, usaremos Microsoft SQL Server.

- Choose a database creation method: Selecciona Standard create.
- Engine type: Selecciona Microsoft SQL Server.
- Database management type: Deja Amazon RDS tal cual como está.

![image](https://raw.githubusercontent.com/sebasshb/Laboratorio-RDS/refs/heads/main/Captura4.png)

A continuacion, agregare todos los pasos para crear esta base de datos de RDS...

![base3.png](/home/christhianrodriguez/Documents/AWS_Chris_labs_Morris_Opazo/Lab1/base3.png)

- DB instance identifier: lab-database
- Master username: Deja admin.
- Credentials Management: Pon Self Managed.
- Master password: ******** (Confirma la contraseña)

Aqui configuramos el almacenamiento y la conectividad que ocupara RDS

![base5.png](/home/christhianrodriguez/Documents/AWS_Chris_labs_Morris_Opazo/Lab1/base5.png)

### Subredes, Subgrupos y Security Groups

Punto clave aqui, usamos LA VPC que crearon por nosotros, y a continuacion la seleccionamos.

![base6.png](/home/christhianrodriguez/Documents/AWS_Chris_labs_Morris_Opazo/Lab1/base6.png)

![base7.png](/home/christhianrodriguez/Documents/AWS_Chris_labs_Morris_Opazo/Lab1/base7.png)

![base8.png](/home/christhianrodriguez/Documents/AWS_Chris_labs_Morris_Opazo/Lab1/base8.png)

- Compute resource: Deja la opción Don't connect to an EC2 compute resource.
- Virtual private cloud (VPC): Pon tu Lab-VPC.
- DB Subnet Group: Deja la que creamos antes (RDS-SubnetGroup).
- Public access: Habilita la opción (Yes).
- VPC security group (firewall): Elige Choose existing y selecciona el RDS-SecurityGroup que creamos.

Despues de configurar nuestra RDS seleccionamos 'Create' y con eso concluimos esta parte. Tendremos que esperar unos minutos para que la instancia quede activa, y podamos usarla. 

![base9.png](/home/christhianrodriguez/Documents/AWS_Chris_labs_Morris_Opazo/Lab1/base9.png)

![base11.png](/home/christhianrodriguez/Documents/AWS_Chris_labs_Morris_Opazo/Lab1/base11.png)

Con esto, hemos creado nuestra primera instancia RDS conectada a una VPC. ¡Qué emoción ver que la infraestructura que creamos ya está funcionando! Espero que esta guía te sea útil para tus propios proyectos en la nube

![diagramaAWS.png](/home/christhianrodriguez/Documents/AWS_Chris_labs_Morris_Opazo/Lab1/diagramaAWS.png)

# Migración de Datos AWS DMS

## Laboratorio 2 // Parte 2 del Laboratorio 1 // Inyección de datos en la instancia RDS

En este laboratorio, aprenderás a conectarte a tu instancia de RDS y a importar datos directamente usando **AWS CloudShell**. Este método es ideal cuando no tienes acceso a un cliente SQL externo o si necesitas una forma rápida y segura de administrar tu base de datos desde la consola de AWS.

Tanto tiempo escuchando de la CloudShell y es la primera vez que la ocupo, increible.

![Captura2.png](/home/christhianrodriguez/Documents/AWS_Chris_labs_Morris_Opazo/Lab2/Captura2.png)

## Instalación de sqlcmd en CloudShell

Se nos proporciona un SQL que debemo subir, pero antes, debemos instalar algunas cosas, a continuacion, se muestran:

### Preparación del entorno

Primero, sube el archivo `.sql` que contiene los datos a CloudShell.

1. En la consola de AWS, busca el logo de CloudShell (un icono de código) en la esquina superior derecha y haz clic en él.

2. Una vez en la terminal, verifica que el archivo `.sql` no exista.

3. En el menú **Actions** de CloudShell, selecciona **Upload File**.

4. Elige el archivo `worldurank.sql` que descargaste previamente.

5. Una vez cargado, verifica con el comando `ls` que el archivo esté en tu directorio.

### Instalación de `sqlcmd`

`sqlcmd` es una herramienta de línea de comandos de Microsoft que te permite ejecutar scripts y comandos SQL. Es la forma más sencilla de interactuar con nuestra base de datos RDS desde CloudShell.

1. **Añadir el repositorio de Microsoft:**
   
   Bash
   
   ```
   sudo curl https://packages.microsoft.com/config/rhel/7/prod.repo | sudo tee /etc/yum.repos.d/msprod.repo
   ```

2. **Instalar las herramientas y el controlador ODBC:**
   
   Bash
   
   ```
   sudo yum install -y mssql-tools msodbcsql17 
   ```
   
   Si se te pide aceptar los términos de la licencia, escribe `yes` y presiona Enter.

3. **Hacer `sqlcmd` permanente en futuras sesiones:**
   
   Bash
   
   ```
   echo 'export PATH="$PATH:/opt/mssql-tools/bin"' >> ~/.bashrc
   ```
   
   Este comando añade la ruta de `sqlcmd` a tu variable de entorno `PATH`, lo que significa que no tendrás que escribir la ruta completa cada vez que lo uses.

4. **Aplicar la configuración a la sesión actual:**
   
   Bash
   
   ```
   source ~/.bashrc
   ```
   
   Esto recarga tu perfil de shell, aplicando los cambios inmediatamente.

5. **Verificar la instalación (opcional):**
   
   Bash
   
   ```
   sqlcmd -?
   ```
   
   **Output esperado:** Verás información sobre la versión de la herramienta, confirmando que la instalación fue exitosa.
   
   ```
   Microsoft (R) SQL Server Command Line Tool Version 17.10.0001.1 Linux Copyright (C) 2017 Microsoft…
   ```

![MuestraCloudShell_FInal.png](/home/christhianrodriguez/Documents/AWS_Chris_labs_Morris_Opazo/Lab2/MuestraCloudShell_FInal.png)

---

## 2. Creación de la Base de Datos en RDS

Ahora que tenemos `sqlcmd` instalado, vamos a crear la base de datos `UniversityDB` en nuestra instancia RDS.

**Importante:** Antes de continuar, necesitas el **Endpoint** de tu instancia RDS. Puedes encontrarlo en la consola de **Amazon RDS** en los detalles de la instancia que creaste.

- **Comando para crear la base de datos:**
  
  Bash
  
  ```
  sqlcmd -S <RDS_ENDPOINT> -U admin -P "#LabDBase3!" -Q "CREATE DATABASE UniversityDB;"
  ```

- **Aclaración:** Reemplaza `<RDS_ENDPOINT>` con el endpoint real de tu instancia. La `-S` especifica el servidor, `-U` el usuario, `-P` la contraseña y `-Q` es un comando SQL a ejecutar.

---

## 3. Ejecución del Script SQL

Ahora, vamos a importar los datos del archivo `worldurank.sql` a la base de datos `UniversityDB` que acabas de crear.

- **Comando para ejecutar el script:**
  
  Bash
  
  ```
  sqlcmd -S <RDS_ENDPOINT> -U admin -P "#LabDBase3!" -d UniversityDB -i worldurank.sql
  ```

- **Aclaración:** La opción `-d` especifica la base de datos a la que te conectarás, y `-i` indica el archivo de entrada que contiene el script SQL.

- **Resultado esperado:** Si la importación es exitosa, verás un mensaje de "`(500 rows affected)`" o similar, confirmando que las filas de datos se insertaron correctamente.

---

## 4. Verificación de la Importación de Datos

Para asegurarte de que los datos están ahí, vamos a realizar una consulta simple a la tabla `UniversityScores` y mostrar las primeras 5 filas.

- **Comando para verificar:**
  
  Bash
  
  ```
  sqlcmd -S <RDS_ENDPOINT> -U admin -P "#LabDBase3!" -d UniversityDB -Q "SELECT TOP 5 * FROM UniversityScores;"
  ```

- **Aclaración:** El comando `-Q` ejecuta una consulta en la base de datos especificada.

- **Resultado esperado:** El output de la terminal te mostrará las primeras 5 filas de la tabla, con todas sus columnas, confirmando que la importación fue un éxito.

![catcloudshell.png](/home/christhianrodriguez/Documents/AWS_Chris_labs_Morris_Opazo/Lab2/catcloudshell.png)

## Preparación para la Instancia DMS

### Creación del Security Group

En la AWS Management Console:

1. Ve a EC2.

2. En el panel de navegación, selecciona Network & Security > Security Groups.

3. Haz clic en Create security group.

#### Configuración del Security Group:

- Inbound rules:
  
  - Regla 1 (por defecto):
    
    - Type: All traffic
    - Source: 0.0.0.0/0
  
  - Regla 2:
    
    - Type: RDP
    - Source: 0.0.0.0/0

![securitygroup1.png](/home/christhianrodriguez/Documents/AWS_Chris_labs_Morris_Opazo/Lab2/securitygroup1.png)

![image](https://raw.githubusercontent.com/sebasshb/LabDMSResources/refs/heads/main/Captura5.png)

## Configuración en DMS (Database Migration Service)

Segun nuestra guia para hacer este lab, debemos hacer una configuracion muy especifica, y asegurarno de hacerla.

![subnetgroups_dns.png](/home/christhianrodriguez/Documents/AWS_Chris_labs_Morris_Opazo/Lab2/subnetgroups_dns.png)

Despues de desactivar 'New navigation' seleccionamos subnet groups y continuamos con nuestro laboratorio.

### Creación del Subnet Group en DMS

1. En la página de DMS, ve a Subnet groups.

2. Haz clic en Create subnet group.

3. Name: dms-subnetgroup

4. VPC: Elige la Lab-VPC.

5. Add Subnets: Selecciona las 2 subnets de la Lab-VPC.

6. Agrega etiquetas (altamente recomendable) y haz clic en Create.

![NOSEPUEDE.png](/home/christhianrodriguez/Documents/AWS_Chris_labs_Morris_Opazo/Lab2/NOSEPUEDE.png)

### Creación de la Instancia de Replicación DMS

1. En la página de DMS, selecciona Replication instances y luego Create replication instance.

2. Name y Description: Especifica un nombre y descripción.

3. Instance class: Elige la clase de instancia dms.t3.small.

4. Engine version: Selecciona la versión 3.5.3 (para evitar errores con los motores de BD)

5. VPC: Elige Lab-VPC.

6. Publicly accessible: Habilita esta opción.

![replicationinstance.png](/home/christhianrodriguez/Documents/AWS_Chris_labs_Morris_Opazo/Lab2/replicationinstance.png)

- High Availability: Si es obligatorio, selecciona Dev or Test Single AZ.

- Replication subnet group: Selecciona el grupo de subredes creado (dms-subnetgroup).

- Availability zone: No preference, si es obligatorio elige cualquiera.

- VPC security group(s): Selecciona el Security Group creado anteriormente y quita el defaul

![iinstancereplication2.png](/home/christhianrodriguez/Documents/AWS_Chris_labs_Morris_Opazo/Lab2/iinstancereplication2.png)

Indica una etiqueta (altamente recomendable) y crea la instancia DMS.

![instancereplication3.png](/home/christhianrodriguez/Documents/AWS_Chris_labs_Morris_Opazo/Lab2/instancereplication3.png)

Y este es el resultado, he crerado una subnet group para DNS

![results.png](/home/christhianrodriguez/Documents/AWS_Chris_labs_Morris_Opazo/Lab2/results.png)

## Creación de Endpoints en DMS

### Endpoint 1: Origen (SQL Server en RDS)

1. En DMS, ve a Endpoints y haz clic en Create endpoint.

2. Endpoint type: Selecciona Source endpoint.

3. Endpoint identifier: lab-ep1 (o el nombre que prefieras).

4. Source engine: Microsoft SQL Server.

5. Marca la casilla Select RDS DB Instance y elige tu instancia RDS.

![endpoint.png](/home/christhianrodriguez/Documents/AWS_Chris_labs_Morris_Opazo/Lab2/endpoint.png)

Access to endpoint database: Selecciona Provide access information manually.

- Server name: Debería llenarse automáticamente con el endpoint de la RDS. Si no, ingrésalo manualmente.
- Port: 1433
- User name: admin
- Password: #LabDBase3!
- Database name: UniversityDB

![endpoint2.png](/home/christhianrodriguez/Documents/AWS_Chris_labs_Morris_Opazo/Lab2/endpoint2.png)

Con esto creamos el primer endpoint.

![endpint2.png](/home/christhianrodriguez/Documents/AWS_Chris_labs_Morris_Opazo/Lab2/endpint2.png)

## Creación de Roles de IAM para AWS Redshift

Cuando estudie para mi certificacion de AWS Cloud Practitioner siempre me llamo la atencion el nombre de Redshift, y hoy es el momento para usarlo!

1. Ve al servicio IAM en la AWS Management Console.

2. En el panel de navegación, selecciona Roles y haz clic en Create role.

3. Select trusted entity: Elige AWS service.

4. Use case: Selecciona Redshift.

5. Use case for Redshift: Selecciona Redshift - Customizable y haz clic en Next.

![Logo de Mi Proyecto](https://raw.githubusercontent.com/sebasshb/LabDMSResources/refs/heads/main/Captura13.png)

![Logo de Mi Proyecto](https://raw.githubusercontent.com/sebasshb/LabDMSResources/refs/heads/main/Captura13.png)
En este caso, tenemos que agregar todos los permisos para que redshift pueda trabajar sin problemas:

AmazonS3ReadOnlyAccess, AmazonDMSRedshiftS3Role, 
AmazonDMSVPCManagementRole, AmazonS3FullAccess, 
AWSMigrationHubDMSAccess.

![IAM_REDSHIFT.png](/home/christhianrodriguez/Documents/AWS_Chris_labs_Morris_Opazo/Lab2/IAM_REDSHIFT.png)

Agregamos el Rol, sumamente importante este punto.

![Logo de Mi Proyecto](https://raw.githubusercontent.com/sebasshb/LabDMSResources/refs/heads/main/Captura15.png)

Repetimos el mismo proceso para el el servicio DMS (PASO SUMAMENTE NECESARIO). Yo olvide hacer esto mientras hacie el lab, y fue un dolor de cabeza encontrar donde habia fallado... Esta es la politica 'AmazonDMSRedshiftS3Role'

![Logo de Mi Proyecto](https://raw.githubusercontent.com/sebasshb/LabDMSResources/refs/heads/main/Captura16.png)

## Configuración de AWS Redshift

### Creación del Cluster Subnet Group en Redshift

1. En el menú de la izquierda de Redshift, bajo Configurations, selecciona Subnet groups.

2. Haz clic en Create cluster subnet group.

3. Name: Deja el nombre por defecto o especifica uno (ej: redshift-lab-subnetgroup).

4. Description: lab subnet group.

VPC: Elige la Lab-VPC.

5. Subnets: Haz clic en Add all the subnets for this VPC.

6. Selecciona las subredes deseadas.

7. Crea el grupo de subredes.

![redshift1.png](/home/christhianrodriguez/Documents/AWS_Chris_labs_Morris_Opazo/Lab2/redshift1.png)

Creamos el cluster subnet group, que emocion, creando estas cosas y conectandolas, me siento emocionado.

### Creación del Cluster de Redshift

En la página de Redshift, haz clic en Create cluster.

Cluster configuration:

- Cluster identifier: lab-cluster.

Nodes:

- Elige la opción I'll choose

- Node type: ra3.large

- Number of nodes: 1

- Admin user name: awsuser

- Admin user password: Selecciona Manually add the admin password (o "Manual password") y pon la contraseña: #LabDBase3!

Network and security:

- Virtual private cloud (VPC): Elige Lab-VPC.

![redshift_clouster.png](/home/christhianrodriguez/Documents/AWS_Chris_labs_Morris_Opazo/Lab2/redshift_clouster.png)

Database configurations:

- Admin user name: awsuser

- Admin user password: Selecciona Manually add the admin password (o "Manual password") y pon la contraseña: #LabDBase3!

![clouster_redshift1.png](/home/christhianrodriguez/Documents/AWS_Chris_labs_Morris_Opazo/Lab2/clouster_redshift1.png)

- #### VPC security groups: Elige el security group para Redshift

- Cluster subnet group: Elige el grupo de subredes de cluster que creaste antes.

- Publicly accessible: Activa esta opción (Turn on).

Cluster Permissions:

En esta parte bajas a donde sale Associated IAM roles, y seleccionas 
en Actions la opción para asociar los roles de IAM que hemos creado para
 nuestro Cluster.

![redshift_security_vpc_lab.png](/home/christhianrodriguez/Documents/AWS_Chris_labs_Morris_Opazo/Lab2/redshift_security_vpc_lab.png)

Cluster Permissions: Hay que asegurarnos que los persmisos esten bien definidos o tendremos problemas. Usamos los roles de IAM para dar estos permisos.

![rolesRedShift4.png](/home/christhianrodriguez/Documents/AWS_Chris_labs_Morris_Opazo/Lab2/rolesRedShift4.png)

Crea el cluster.

## Creación del Endpoint 2 en DMS: Destino (Redshift)

1. Vuelve a DMS en la AWS Management Console.

2. Ve a Endpoints y haz clic en Create endpoint.

3. Endpoint type: Selecciona Target endpoint.

![dms_endpoint2.png](/home/christhianrodriguez/Documents/AWS_Chris_labs_Morris_Opazo/Lab2/dms_endpoint2.png)

Endpoint identifier: lab-ep2 (o el nombre que prefieras).

4. Target engine: Amazon Redshift.

5. Marca la casilla Select Redshift cluster y elige tu cluster lab-cluster.

Access to endpoint database: Selecciona Provide access information manually.

- Server name: Debería llenarse automáticamente con el endpoint del cluster de Redshift. Si no, ingrésalo manualmente.
- Port: 5439
- User name: awsuser
- Password: #LabDBase3!
- Database name: dev (esta es la base de datos por defecto que se crea en Redshift).

![dms_endpoint3.png](/home/christhianrodriguez/Documents/AWS_Chris_labs_Morris_Opazo/Lab2/dms_endpoint3.png)

Test endpoint connection:

- Selecciona tu instancia de replicación DMS.
- Haz clic en Run test. Verifica que la conexión sea exitosa. (Si 
  falla por error de red, verifica la regla del Security Group del cluster
   de Redshift).

![endpointDMS_Redshift.png](/home/christhianrodriguez/Documents/AWS_Chris_labs_Morris_Opazo/Lab2/endpointDMS_Redshift.png)

Crea el endpoint, asi debe quedar, un endpoint de entrada y otro de salida, conectadas al cluster que creamos.

![EndpointsFInal.png](/home/christhianrodriguez/Documents/AWS_Chris_labs_Morris_Opazo/Lab2/EndpointsFInal.png)

## Creación de la Tarea de Migración de Base de Datos en DMS

### Creando la Tarea de Migración de Datos (DMS)

Ahora que tienes tus *endpoints* de origen (RDS) y destino (Redshift) listos, el siguiente paso es configurar la tarea de migración que moverá los datos de un lado a otro. Es como darle las instrucciones a AWS para que haga el trabajo pesado por ti.

1. **Ve al panel de AWS DMS** y en el menú de la izquierda, selecciona **Database migration tasks**. Haz clic en el botón **Crear tarea (Create task)** para empezar.

2. **Configura los detalles de la tarea:**
   
   - **Identificador de la tarea:** Nombra tu tarea, por ejemplo, `lab-task`.
   
   - **Instancia de replicación:** Selecciona la instancia de DMS que creaste anteriormente.
   
   - **Endpoint de origen:** Elige tu base de datos de origen, que es el *endpoint* de RDS (llamado `lab-ep1 - RDS SQL Server`).
   
   - **Endpoint de destino:** Selecciona tu destino, que es el *endpoint* de Redshift (llamado `lab-ep2 - Redshift`).
   
   - **Tipo de migración:** Para este laboratorio, usaremos **Migrar datos existentes (Migrate existing data)**, ya que solo queremos copiar los datos que ya están en RDS hacia Redshift.

![migration_tasj.png](/home/christhianrodriguez/Documents/AWS_Chris_labs_Morris_Opazo/Lab2/migration_tasj.png)

### Definiendo el Mapeo de Tablas

Esta es la parte donde le dices a DMS exactamente qué tablas quieres migrar.

1. Baja hasta la sección **Mapeo de tablas (Table mappings)**.

2. Expande **Reglas de selección (Selection rules)** y haz clic en **Añadir nueva regla de selección**.

3. **Configura la regla:**
   
   - **Esquema:** Selecciona **Ingresar un esquema**.
   
   - **Nombre del esquema de origen:** Escribe `dbo`.
   
   - **Nombre de la tabla:** Usa el comodín `%` (esto le dice a DMS que incluya **todas las tablas** que estén dentro del esquema `dbo`).
   
   - **Acción:** Elige **Incluir (Include)**.

![taskmigration1.png](/home/christhianrodriguez/Documents/AWS_Chris_labs_Morris_Opazo/Lab2/taskmigration1.png)

Asegúrate de que la opción Turn on premigration assessment (o similar) 
NO esté activada, a menos que se indique lo contrario para el 
laboratorio.

![datatask_creating.png](/home/christhianrodriguez/Documents/AWS_Chris_labs_Morris_Opazo/Lab2/datatask_creating.png)

![Captura34.png](/home/christhianrodriguez/Documents/AWS_Chris_labs_Morris_Opazo/Lab2/Captura34.png)

### Iniciando la Migración y Monitoreo

Antes de iniciar, es una buena práctica verificar si se activa la evaluación previa, pero para este laboratorio, nos saltaremos ese paso.

1. Asegúrate de que la opción **Activar evaluación previa a la migración (Turn on premigration assessment)** **NO** esté marcada.

2. Haz clic en **Crear tarea (Create task)**. Ahora solo tienes que esperar a que DMS haga su magia.

Tu tarea pasará por diferentes estados. Podrás verlos en la página de **Database migration tasks**.

- `Creating`

- `Starting`

- `Running` (o `Full load in progress`)

- Finalmente, `Load complete`.

Una vez que llegue a este último estado, ¡la migración de datos estará completa!

![Logo de Mi Proyecto](https://raw.githubusercontent.com/sebasshb/LabDMSResources/refs/heads/main/Captura35.png)

# Laboratorio completado!

![image](https://raw.githubusercontent.com/sebasshb/LabDMSResources/refs/heads/main/LabDMSFinalArch.png)
