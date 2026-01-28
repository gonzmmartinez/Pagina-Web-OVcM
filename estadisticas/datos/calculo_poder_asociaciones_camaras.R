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

planilla <- "https://docs.google.com/spreadsheets/d/1r96KsH-kOhn7eGEpRGd25XFsCrjVLpGtlqLKnMJBoG8/edit?usp=sharing"

Raw1 <- read_sheet(ss = planilla, sheet = "Asociaciones")
Raw2 <- read_sheet(ss = planilla, sheet = "Cámaras")

######### TRANSFORMAR DATOS #########

# Asociaciones
Data1 <- Raw1 %>%
  pivot_longer(
    cols = -Nombre,
    names_to = "Año",
    values_to = "Género") %>%
  mutate(Año = as.integer(Año)) %>%
  na.omit() %>%
  group_by(Año, Género) %>%
  summarise(Cantidad = n()) %>%
  ungroup %>%
  mutate(Género = ifelse(Género == "Varón", "Varones", "Mujeres"))

# Cámaras
Data2 <- Raw2 %>%
  pivot_longer(
    cols = -Nombre,
    names_to = "Año",
    values_to = "Género") %>%
  mutate(Año = as.integer(Año)) %>%
  na.omit() %>%
  group_by(Año, Género) %>%
  summarise(Cantidad = n()) %>%
  ungroup %>%
  mutate(Género = ifelse(Género == "Varón", "Varones", "Mujeres"))


######### ACTUALIZACIÓN #########
actualizacion <- paste0("Última actualización de los datos de esta sección: ", format(Sys.Date(), "%d/%m/%Y"))
writeLines(actualizacion, paste0(dir, "/json/actualizacion_poder_asociaciones_camaras.txt"))

######### ESCRIBIR DATOS #########
write_json(toJSON(Data1), path = paste0(dir, "/json/poder_asociaciones.json"))
write_json(toJSON(Data2), path = paste0(dir, "/json/poder_camaras.json"))