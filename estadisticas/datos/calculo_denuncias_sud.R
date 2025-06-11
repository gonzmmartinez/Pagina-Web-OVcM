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

planilla <- "https://docs.google.com/spreadsheets/d/1mUMxGbv3x1hoVxWbTfAquSDR25YWnSDTL8T5MFkllvU/edit?usp=sharing"

Raw1 <- read_sheet(ss = planilla, sheet = "Denuncias_SUD")
Raw2 <- read_sheet(ss = planilla, sheet = "SUD_db_completa")

######### TRANSFORMAR DATOS #########
# Tipo de denuncias
Data1 <- Raw1 %>%
  mutate(Año = as.character(Año)) %>%
  group_by(Año, Tipo) %>%
  summarise(Cantidad = sum(Cantidad)) %>%
  arrange(Año) %>%
  ungroup %>%
  mutate(Tipo = case_when(Tipo == "Familiar" ~ "Violencia familiar",
                          Tipo == "Género" ~ "Violencia de género",
                          Tipo == "No penal" ~ "Violencia no penal"))

# Evolucion
Data2 <- Raw1 %>%
  mutate(Año = as.character(Año)) %>%
  group_by(Año, Mes, Mes_ord) %>%
  summarise(Cantidad = sum(Cantidad)) %>%
  arrange(Año, Mes_ord) %>%
  ungroup

# Por boca de denuncia
Data3 <- Raw1 %>%
  mutate(Año = as.character(Año)) %>%
  group_by(Año, Organismo) %>%
  summarise(Cantidad = sum(Cantidad)) %>%
  arrange(Año)

# Tasa de denuncia
Poblacion <- read_sheet(ss = planilla, sheet = "Poblacion") %>%
  mutate(Año = as.character(Año))
Data4 <- Raw2 %>%
  filter(Tipo %in% c("Género", "Familiar")) %>%
  mutate(Año = as.character(Año)) %>%
  group_by(Año, Departamento) %>%
  summarise(Cantidad = sum(Cantidad)) %>%
  ungroup %>%
  left_join(Poblacion, by = c("Año", "Departamento")) %>%
  rename(Cantidad = "Cantidad.x", Poblacion = "Cantidad.y") %>%
  mutate(Tasa_denuncias = (100 * Cantidad)/Poblacion) %>%
  arrange(desc(Tasa_denuncias))

######### ESCRIBIR DATOS #########
write_json(toJSON(Data1), path = paste0(dir, "/json/denuncias_sud_tipo.json"))
write_json(toJSON(Data2), path = paste0(dir, "/json/denuncias_sud_evolucion.json"))
write_json(toJSON(Data3), path = paste0(dir, "/json/denuncias_sud_boca.json"))
write_json(toJSON(Data4), path = paste0(dir, "/json/denuncias_sud_tasa_denuncias.json"))