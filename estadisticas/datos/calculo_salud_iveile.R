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

planilla <- "https://docs.google.com/spreadsheets/d/1nnUI0CDjmjEg9KYtft80CXVX9QX0ub4N3l9-ttiULV8/edit?usp=sharing"

Raw1 <- read_sheet(ss = planilla, sheet = "IVE/ILE_mes")
Raw2 <- read_sheet(ss = planilla, sheet = "IVE/ILE_edad")
Raw3 <- read_sheet(ss = planilla, sheet = "IVE/ILE_semanas")

######### TRANSFORMAR DATOS #########

# IVE por mes
Data1 <- Raw1 %>%
  mutate(Año = as.character(Año)) %>%
  filter(Tipo == "IVE") %>%
  group_by(Año, Mes, Mes_ord) %>%
  summarise(Cantidad = sum(Cantidad)) %>%
  ungroup %>%
  arrange(Año, Mes_ord)

# IVE por edad de la persona gestante
Data2 <- Raw2 %>%
  mutate(Año = as.character(Año)) %>%
  filter(Tipo == "IVE") %>%
  group_by(Año, Rango_etario_pg, Ord_rango_etario) %>%
  summarise(Cantidad = sum(Cantidad)) %>%
  ungroup %>%
  arrange(Año, Ord_rango_etario)

# IVE por semanas de gestación
Data3 <- Raw3 %>%
  mutate(Año = as.character(Año)) %>%
  filter(Tipo == "IVE") %>%
  group_by(Año, Semanas, Semanas_ord) %>%
  summarise(Cantidad = sum(Cantidad)) %>%
  ungroup %>%
  arrange(Año, Semanas_ord) %>%
  mutate(Semanas = as.character(Semanas))

# IVE por mes
Data4 <- Raw1 %>%
  mutate(Año = as.character(Año)) %>%
  filter(Tipo == "ILE") %>%
  group_by(Año, Mes, Mes_ord) %>%
  summarise(Cantidad = sum(Cantidad)) %>%
  ungroup %>%
  arrange(Año, Mes_ord)

# IVE por edad de la persona gestante
Data5 <- Raw2 %>%
  mutate(Año = as.character(Año)) %>%
  filter(Tipo == "ILE") %>%
  group_by(Año, Rango_etario_pg, Ord_rango_etario) %>%
  summarise(Cantidad = sum(Cantidad)) %>%
  ungroup %>%
  arrange(Año, Ord_rango_etario)

# IVE por semanas de gestación
Data6 <- Raw3 %>%
  mutate(Año = as.character(Año)) %>%
  filter(Tipo == "ILE") %>%
  group_by(Año, Semanas, Semanas_ord) %>%
  summarise(Cantidad = sum(Cantidad)) %>%
  ungroup %>%
  arrange(Año, Semanas_ord) %>%
  mutate(Semanas = as.character(Semanas))

######### ESCRIBIR DATOS #########
write_json(toJSON(Data1), path = paste0(dir, "/json/salud_ive.json"))
write_json(toJSON(Data2), path = paste0(dir, "/json/salud_ive_edad.json"))
write_json(toJSON(Data3), path = paste0(dir, "/json/salud_ive_semanas.json"))
write_json(toJSON(Data4), path = paste0(dir, "/json/salud_ile.json"))
write_json(toJSON(Data5), path = paste0(dir, "/json/salud_ile_edad.json"))
write_json(toJSON(Data6), path = paste0(dir, "/json/salud_ile_semanas.json"))