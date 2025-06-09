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

planilla <- "https://docs.google.com/spreadsheets/d/1tJTTk-VGRXyj-uLiYKc7zmIIFpk15voe53ncMpbl9cM/edit?usp=sharing"

Raw1 <- read_sheet(ss = planilla, sheet = "Poder_judicial")

######### TRANSFORMAR DATOS #########

# Camaras
Data1 <- Raw1 %>%
  mutate(Año = as.character(Año)) %>%
  filter(Cargo == "Camaras") %>%
  rename(Cantidad = "Frecuencia") %>%
  arrange(Año)

# Corte Superior de Justicia
Data2 <- Raw1 %>%
  mutate(Año = as.character(Año)) %>%
  filter(Cargo == "Corte Superior de Justicia") %>%
  rename(Cantidad = "Frecuencia") %>%
  arrange(Año)

# Juzgados
Data3 <- Raw1 %>%
  mutate(Año = as.character(Año)) %>%
  filter(Cargo == "Juzgados") %>%
  rename(Cantidad = "Frecuencia") %>%
  arrange(Año)

# Otros funcionarias/os
Data4 <- Raw1 %>%
  mutate(Año = as.character(Año)) %>%
  filter(Cargo == "Otros funcionarias/os") %>%
  rename(Cantidad = "Frecuencia") %>%
  arrange(Año)

# Personal administrativo
Data5 <- Raw1 %>%
  mutate(Año = as.character(Año)) %>%
  filter(Cargo == "Personal administrativo") %>%
  rename(Cantidad = "Frecuencia") %>%
  arrange(Año)

# Personal de servicio
Data6 <- Raw1 %>%
  mutate(Año = as.character(Año)) %>%
  filter(Cargo == "Personal de servicio") %>%
  rename(Cantidad = "Frecuencia") %>%
  arrange(Año)

# Secretarias
Data7 <- Raw1 %>%
  mutate(Año = as.character(Año)) %>%
  filter(Cargo == "Secretarias") %>%
  rename(Cantidad = "Frecuencia") %>%
  arrange(Año)


######### ESCRIBIR DATOS #########
write_json(toJSON(Data1), path = paste0(dir, "/json/poder_judicial_camaras.json"))
write_json(toJSON(Data2), path = paste0(dir, "/json/poder_judicial_corte.json"))
write_json(toJSON(Data3), path = paste0(dir, "/json/poder_judicial_juzgados.json"))
write_json(toJSON(Data4), path = paste0(dir, "/json/poder_judicial_otros_funcionarios.json"))
write_json(toJSON(Data5), path = paste0(dir, "/json/poder_judicial_personal_administrativo.json"))
write_json(toJSON(Data6), path = paste0(dir, "/json/poder_judicial_personal_servicio.json"))
write_json(toJSON(Data7), path = paste0(dir, "/json/poder_judicial_secretarias.json"))