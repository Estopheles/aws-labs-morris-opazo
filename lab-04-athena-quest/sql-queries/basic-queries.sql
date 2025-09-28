-- Lab 4 Athena Quest: Consultas Básicas del Laboratorio
-- Estas son las 6 consultas principales del workshop

-- Asegurarse de usar la base de datos correcta
USE librosdb;

-- 1. ¿Cuáles son todos los libros en la base de datos?
SELECT * FROM tablalibros;

-- 2. ¿Qué libros escribió "Dean Koontz"?
SELECT * 
FROM tablalibros
WHERE autor = 'Dean Koontz';

-- 3. ¿Qué libros fueron publicados después del año 2000?
SELECT * 
FROM tablalibros
WHERE year > 2000;

-- 4. ¿Cuáles son todos los autores únicos que hay en la base de datos?
SELECT DISTINCT autor 
FROM tablalibros;

-- 5. ¿Cuáles son los libros ordenados desde el más antiguo al más reciente?
SELECT * 
FROM tablalibros
ORDER BY year ASC;

-- 6. ¿Qué libros fueron publicados en el año 1999?
SELECT libro, year
FROM tablalibros
WHERE year = 1999;
