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

planilla <- "https://docs.google.com/spreadsheets/d/1Sq9mUf9ArL3Rf3QrMNWyVCWBPDud0B1DChOiU_TJaNk/edit?usp=sharing"

Raw1 <- read_sheet(ss = planilla, sheet = "Mortalidad_materna")

######### TRANSFORMAR DATOS #########

# Mortalidad materna por rango etario
Data1 <- Raw1 %>%
  mutate(Año = as.character(Año)) %>%
  group_by(Año, Rango_etario, Ord_rango_etario) %>%
  summarise(Cantidad = sum(Cantidad)) %>%
  ungroup %>%
  arrange(Año, Ord_rango_etario)

######### ESCRIBIR DATOS #########
write_json(toJSON(Data1), path = paste0(dir, "/json/salud_mm.json"))