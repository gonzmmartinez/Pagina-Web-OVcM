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
library(lubridate)

######### LEER DATOS #########
dir <- dirname(rstudioapi::getActiveDocumentContext()$path)

planilla <- "https://docs.google.com/spreadsheets/d/1nnUI0CDjmjEg9KYtft80CXVX9QX0ub4N3l9-ttiULV8/edit?usp=sharing"

Raw1 <- read_sheet(ss = planilla, sheet = "IVE/ILE_mes")
Raw2 <- read_sheet(ss = planilla, sheet = "IVE/ILE_edad")
Raw3 <- read_sheet(ss = planilla, sheet = "IVE/ILE_semanas")

######### DICCIONARIO #########
meses <- c("Enero", "Febrero", "Marzo", "Abril",
           "Mayo", "Junio", "Julio", "Agosto",
           "Septiembre", "Octubre", "Noviembre", "Diciembre")

rango_pg <- c("10-15 años", "16-20 años", "21-25 años", "26-30 años", "31-35 años",
              "36-40 años", "41-45 años", "46-50 años", "Sin dato")

semanas <- c(as.character(3:32), "Sin dato")

######### TRANSFORMAR DATOS #########

# IVE/ILE por mes
Data1 <- Raw1 %>%
  mutate(Año = as.character(Año)) %>%
  group_by(Año, Tipo, Mes_ord) %>%
  summarise(Cantidad = sum(Cantidad)) %>%
  ungroup %>%
  mutate(Mes = meses[Mes_ord]) %>%
  rename(Mes_num = "Mes_ord") %>%
  mutate(Trimestre = case_when(Mes_num >= 1 & Mes_num <= 3 ~ 1,
                               Mes_num >= 4 & Mes_num <= 6 ~ 2,
                               Mes_num >= 7 & Mes_num <= 9 ~ 3,
                               Mes_num >= 10 & Mes_num <= 12 ~ 4),
         Semestre = case_when(Mes_num >= 1 & Mes_num <= 6 ~ 1,
                              Mes_num >= 7 & Mes_num <= 12 ~ 2)) %>%
  mutate(year_mes = paste0(sprintf("%02d", Mes_num), "-", str_sub(Año, 3,4)),
         year_trimestre=paste0(sprintf("%02d", Trimestre), "-", str_sub(Año, 3, 4)),
         year_semestre=paste0(sprintf("%02d",Semestre), "-", str_sub(Año,3,4))) %>%
  arrange(Año, Mes_num) %>%
  ungroup

# IVE/ILE por edad de la persona gestante
Data2 <- expand.grid(
  Año = as.character(2020:2025),
  Rango_etario_pg = rango_pg,
  Tipo = c("IVE", "ILE"),
  KEEP.OUT.ATTRS = FALSE,
  stringsAsFactors = FALSE) %>%
  mutate(
    Ord_rango_etario = match(Rango_etario_pg, rango_pg)) %>%
  left_join(
    Raw2 %>%
      mutate(Año = as.character(Año)) %>%
      group_by(Año, Tipo, Rango_etario_pg) %>%
      summarise(Cantidad = sum(Cantidad), .groups = "drop"),
    by = c("Año", "Tipo", "Rango_etario_pg")
  ) %>%
  mutate(
    Cantidad = coalesce(Cantidad, 0)
  ) %>%
  arrange(Año, Tipo, Ord_rango_etario)

# IVE/ILE por semanas de gestación
Data3 <- expand.grid(
  Año = as.character(2020:2025),
  Semanas = semanas,
  Tipo = c("IVE", "ILE"),
  KEEP.OUT.ATTRS = FALSE,
  stringsAsFactors = FALSE) %>%
  mutate(
    Ord_semanas = match(Semanas, semanas)) %>%
  left_join(
    Raw3 %>%
      mutate(Año = as.character(Año)) %>%
      group_by(Año, Tipo, Semanas) %>%
      summarise(Cantidad = sum(Cantidad), .groups = "drop"),
    by = c("Año", "Tipo", "Semanas")
  ) %>%
  mutate(
    Cantidad = coalesce(Cantidad, 0)
  ) %>%
  arrange(Año, Tipo, Ord_semanas)

######### ACTUALIZACIÓN #########
actualizacion <- paste0("Última actualización de los datos de esta sección: ", format(Sys.Date(), "%d/%m/%Y"))
writeLines(actualizacion, paste0(dir, "/json/actualizacion_salud_iveile.txt"))

######### ESCRIBIR DATOS #########
write_json(toJSON(Data1), path = paste0(dir, "/json/salud_ive_ile_mes.json"), na = "null")
write_json(toJSON(Data2), path = paste0(dir, "/json/salud_ive_ile_edad.json"), na = "null")
write_json(toJSON(Data3), path = paste0(dir, "/json/salud_ive_ile_semanas.json"), na = "null")
