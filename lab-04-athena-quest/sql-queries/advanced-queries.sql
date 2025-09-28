-- Lab 4 Athena Quest: Consultas Avanzadas Adicionales
-- Consultas más complejas para exploración adicional de datos

-- Usar la base de datos correcta
USE librosdb;

-- 7. Contar el total de libros en la base de datos
SELECT COUNT(*) as total_libros 
FROM tablalibros;

-- 8. Contar libros por autor (Top 10 autores más prolíficos)
SELECT autor, COUNT(*) as numero_libros
FROM tablalibros 
GROUP BY autor
ORDER BY numero_libros DESC
LIMIT 10;

-- 9. Análisis por década de publicación
SELECT 
  CASE 
    WHEN year < 1900 THEN 'Antes de 1900'
    WHEN year BETWEEN 1900 AND 1950 THEN '1900-1950'
    WHEN year BETWEEN 1951 AND 2000 THEN '1951-2000'
    WHEN year > 2000 THEN 'Después de 2000'
    ELSE 'Año desconocido'
  END as periodo,
  COUNT(*) as cantidad_libros
FROM tablalibros 
GROUP BY 
  CASE 
    WHEN year < 1900 THEN 'Antes de 1900'
    WHEN year BETWEEN 1900 AND 1950 THEN '1900-1950'
    WHEN year BETWEEN 1951 AND 2000 THEN '1951-2000'
    WHEN year > 2000 THEN 'Después de 2000'
    ELSE 'Año desconocido'
  END
ORDER BY cantidad_libros DESC;

-- 10. Buscar libros que contengan palabras específicas en el título
SELECT autor, libro, year 
FROM tablalibros 
WHERE LOWER(libro) LIKE '%love%'
   OR LOWER(libro) LIKE '%life%'
   OR LOWER(libro) LIKE '%world%';

-- 11. Estadísticas del año de publicación
SELECT 
  MIN(year) as año_mas_antiguo,
  MAX(year) as año_mas_reciente,
  AVG(year) as año_promedio,
  COUNT(DISTINCT year) as años_únicos
FROM tablalibros
WHERE year IS NOT NULL;

-- 12. Libros por siglo
SELECT 
  FLOOR(year/100)*100 as siglo,
  COUNT(*) as libros_por_siglo
FROM tablalibros 
WHERE year IS NOT NULL 
  AND year > 1000  -- Filtrar años inválidos
GROUP BY FLOOR(year/100)*100
ORDER BY siglo;

-- 13. Autores con más de un libro
SELECT autor, COUNT(*) as total_libros
FROM tablalibros 
GROUP BY autor
HAVING COUNT(*) > 1
ORDER BY total_libros DESC;

-- 14. Distribución de libros por primera letra del título
SELECT 
  UPPER(SUBSTRING(libro, 1, 1)) as primera_letra,
  COUNT(*) as cantidad_libros
FROM tablalibros 
GROUP BY UPPER(SUBSTRING(libro, 1, 1))
ORDER BY primera_letra;

-- 15. Libros más recientes por autor (último libro de cada autor)
SELECT autor, libro, year
FROM (
  SELECT autor, libro, year,
         ROW_NUMBER() OVER (PARTITION BY autor ORDER BY year DESC) as rn
  FROM tablalibros
) ranked
WHERE rn = 1
ORDER BY year DESC;

-- Comandos de mantenimiento (usar con precaución)
-- Para eliminar la tabla:
-- DROP TABLE tablalibros;

-- Para eliminar la base de datos:
-- DROP DATABASE librosdb;
