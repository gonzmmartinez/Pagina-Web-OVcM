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

######### LEER DATOS #########
dir <- dirname(rstudioapi::getActiveDocumentContext()$path)

planilla <- "https://docs.google.com/spreadsheets/d/1_8JfsvUuQN7QX9wAtGexCCd8jrL3SJHbX36w_7q26mE/edit?usp=sharing"

Raw0 <- read_sheet(ss = planilla, sheet = "Matricula_por_genero")
Raw1 <- read_sheet(ss = planilla, sheet = "Docentes_en_actividad")

######### TRANSFORMAR DATOS #########

# Matriculas por genero
Data1 <- Raw0 %>%
  mutate(Año = as.character(Año)) %>%
  arrange(Año, Matricula_ord, Género)
totalData1 <- Raw0 %>%
  mutate(Año = as.character(Año)) %>%
  arrange(Año, Matricula_ord, Género) %>%
  group_by(Año, Matricula, Matricula_ord, Género) %>%
  summarise(Frecuencia = sum(Frecuencia)) %>%
  ungroup %>%
  mutate(Departamento = "TODOS")
Data1 <- rbind(Data1, totalData1)

# Docentes en actividad
Data2 <- Raw1 %>%
  mutate(Año = as.character(Año)) %>%
  arrange(Año, Departamento, Género)

######### ESCRIBIR DATOS #########
write_json(toJSON(Data1), path = paste0(dir, "/json/educacion_matriculas.json"))
write_json(toJSON(Data2), path = paste0(dir, "/json/educacion_docentes.json"))