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

planilla <- "https://docs.google.com/spreadsheets/d/1F1A1fl2G8Xfk5TtkKqwDOJ16_tAQ3Pgsdb4WjoojGF4/edit?usp=sharing"

Raw1 <- read_sheet(ss = planilla, sheet = "Poder_ejecutivo")

######### TRANSFORMAR DATOS #########

# Gobernador
Data1 <- Raw1 %>%
  mutate(Año = as.character(Año)) %>%
  filter(Cargo == "Gobernador") %>%
  rename(Cantidad = "Frecuencia") %>%
  arrange(Año)


# Vicegobernador
Data2 <- Raw1 %>%
  mutate(Año = as.character(Año)) %>%
  filter(Cargo == "Vicegobernador") %>%
  rename(Cantidad = "Frecuencia") %>%
  arrange(Año)


# Ministerios
Data3 <- Raw1 %>%
  mutate(Año = as.character(Año)) %>%
  filter(Cargo == "Ministerios") %>%
  rename(Cantidad = "Frecuencia") %>%
  arrange(Año)


# Intendencias
Data4 <- Raw1 %>%
  mutate(Año = as.character(Año)) %>%
  filter(Cargo == "Intendencias") %>%
  rename(Cantidad = "Frecuencia") %>%
  arrange(Año)


# Secretarias
Data5 <- Raw1 %>%
  mutate(Año = as.character(Año)) %>%
  filter(Cargo == "Secretarias") %>%
  rename(Cantidad = "Frecuencia") %>%
  arrange(Año)

######### ESCRIBIR DATOS #########
write_json(toJSON(Data1), path = paste0(dir, "/json/poder_ejecutivo_gobernador.json"))
write_json(toJSON(Data2), path = paste0(dir, "/json/poder_ejecutivo_vicegobernador.json"))
write_json(toJSON(Data3), path = paste0(dir, "/json/poder_ejecutivo_ministerios.json"))
write_json(toJSON(Data4), path = paste0(dir, "/json/poder_ejecutivo_intendencias.json"))
write_json(toJSON(Data5), path = paste0(dir, "/json/poder_ejecutivo_secretarias.json"))