# Política de Seguridad

## Versiones Soportadas

| Versión | Soportada          |
| ------- | ------------------ |
| 1.0.x   | :white_check_mark: |

## Reportar una Vulnerabilidad

Si descubres una vulnerabilidad de seguridad en este proyecto, por favor repórtala de manera responsable:

### Proceso de Reporte

1. **NO** abras un issue público para vulnerabilidades de seguridad
2. Envía un email detallado describiendo la vulnerabilidad
3. Incluye pasos para reproducir el problema
4. Proporciona cualquier información adicional que pueda ser útil

### Qué Incluir

- Descripción detallada de la vulnerabilidad
- Pasos para reproducir el problema
- Versiones afectadas
- Impacto potencial
- Cualquier mitigación temporal que conozcas

### Tiempo de Respuesta

- Confirmaremos la recepción de tu reporte dentro de 48 horas
- Proporcionaremos una evaluación inicial dentro de 7 días
- Te mantendremos informado sobre el progreso de la corrección

## Mejores Prácticas de Seguridad

### Para Usuarios de los Labs

1. **Credenciales AWS:**
   - Nunca hardcodees credenciales en el código
   - Usa IAM roles cuando sea posible
   - Rota regularmente las access keys

2. **Recursos AWS:**
   - Siempre elimina recursos después de completar los labs
   - Revisa los Security Groups para acceso mínimo necesario
   - Usa encryption en reposo y en tránsito

3. **Datos Sensibles:**
   - No incluyas información personal real en los ejercicios
   - Usa datos de prueba ficticios
   - Revisa logs antes de compartir screenshots

### Para Contribuidores

1. **Código:**
   - Revisa el código para credenciales hardcodeadas
   - Usa variables de entorno para configuración sensible
   - Implementa validación de entrada apropiada

2. **Documentación:**
   - Redacta información sensible en screenshots
   - Usa placeholders para datos reales
   - Incluye advertencias de seguridad cuando sea necesario

## Recursos de Seguridad AWS

- [AWS Security Best Practices](https://aws.amazon.com/architecture/security-identity-compliance/)
- [AWS IAM Best Practices](https://docs.aws.amazon.com/IAM/latest/UserGuide/best-practices.html)
- [AWS Security Documentation](https://docs.aws.amazon.com/security/)

## Contacto

Para reportes de seguridad o preguntas relacionadas, contacta al mantenedor del proyecto.