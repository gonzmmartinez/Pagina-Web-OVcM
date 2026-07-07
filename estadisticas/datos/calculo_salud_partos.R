# Limpiar todo
rm(list = ls())

# Funciones
`%ni%` <- Negate(`%in%`)

# Librerias
library(jsonlite)
library(dplyr)
library(stringr)
library(readr)
library(googlesheets4)
library(janitor)
library(tidyr)

######### LEER DATOS #########
dir <- dirname(rstudioapi::getActiveDocumentContext()$path)

planilla <- "https://docs.google.com/spreadsheets/d/1Zq5ghQLxkpWY3munP3AS-qdx0PmcRzQ2oTW6f1nePZ4/edit?usp=sharing"

Raw1 <- read_sheet(ss = planilla, sheet = "Cesareas_partos")
Raw2 <- read_sheet(ss = planilla, sheet = "Cesareas_partos_edad")

######### DEPARTAMENTOS #########

Departamentos <- c("Anta", "Cachi", "Cafayate", "Capital", "Cerrillos", "Chicoana",
                   "General Güemes", "General José de San Martín", "Guachipas",
                   "Iruya", "La Caldera", "La Candelaria", "La Poma", "La Viña",
                   "Los Andes", "Metán", "Molinos", "Orán", "Rivadavia",
                   "Rosario de la Frontera", "Rosario de Lerma", "San Carlos",
                   "Santa Victoria")

Tipos <- c("Parto espontáneo de vértice", "Cesárea",
           "Parto con fórceps", "Extracción con presentación de nalgas")

Rangos_etarios <- c("10-14 años", "15-19 años", "20-49 años", "50-64 años", "65 años o más")

######### TRANSFORMAR DATOS #########

# Cesáreas y partos por departamento
Data1 <- Raw1 %>%
  mutate(Año = as.character(Año)) %>%
  group_by(Año, Departamento) %>%
  summarise(Cantidad = sum(Cantidad), .groups = "drop") %>%
  complete(Año, Departamento = Departamentos,
           fill = list(Cantidad = 0)) %>%
  mutate(Departamento_ord = match(Departamento, Departamentos)) %>%
  arrange(Año, Departamento_ord)

# Cesáreas y partos por tipo de parto
Data2 <- Raw1 %>%
  mutate(Año = as.character(Año)) %>%
  group_by(Año, Tipo) %>%
  summarise(Cantidad = sum(Cantidad), .groups = "drop") %>%
  complete(Año, Tipo = Tipos, fill = list(Cantidad = 0)) %>%
  mutate(Tipo_ord = match(Tipo, Tipos)) %>%
  arrange(Año, Tipo_ord)

# Cesáreas y partos por edades agrupadas
Data3 <- Raw2 %>%
  mutate(Año = as.character(Año)) %>%
  group_by(Año, Rango_etario) %>%
  summarise(Cantidad = sum(Cantidad), .groups = "drop") %>%
  complete(Año, Rango_etario = Rangos_etarios, fill = list(Cantidad = 0)) %>%
  mutate(Rango_ord = match(Rango_etario, Rangos_etarios)) %>%
  arrange(Año, Rango_ord)

######### ACTUALIZACIÓN #########
actualizacion <- paste0("Última actualización de los datos de esta sección: ", format(Sys.Date(), "%d/%m/%Y"))
writeLines(actualizacion, paste0(dir, "/json/actualizacion_salud_partos.txt"))

######### ESCRIBIR DATOS #########
write_json(toJSON(Data1), path = paste0(dir, "/json/salud_partos_departamento.json"))
write_json(toJSON(Data2), path = paste0(dir, "/json/salud_partos_tipo.json"))
write_json(toJSON(Data3), path = paste0(dir, "/json/salud_partos_edad.json"))