# Limpiar todo
rm(list = ls())

# Funciones
`%ni%` <- Negate(`%in%`)

# Librerias
library(jsonlite)
library(dplyr)
library(stringr)
library(readr)
library(eph)
library(janitor)
library(tidyr)

######### LEER DATOS #########
dir <- dirname(rstudioapi::getActiveDocumentContext()$path)

Raw <- get_microdata(
        year = 2020:2024,
        period = 1:4,
        type = "individual",
        vars = c("ANO4", "TRIMESTRE", "REGION", "AGLOMERADO", "PONDERA" , "CH04",
                 "CH06", "ESTADO", "CAT_OCUP", "CAT_INAC", "INTENSI", "PP03J"))

######### TRANSFORMAR DATOS #########

# Todos los indicadores
Data0 <- Raw %>%
  mutate(ANO4 = as.character(ANO4), TRIMESTRE = as.character(TRIMESTRE)) %>%
  filter(AGLOMERADO == 23, CH06 >= 14) %>%
  organize_labels(type = "individual") %>%
  group_by(ANO4, TRIMESTRE, CH04) %>%
  summarise(Poblacion = sum(PONDERA),
            Ocupados = sum(PONDERA[ESTADO == 1]),
            Desocupados = sum(PONDERA[ESTADO == 2]),
            PEA = Ocupados + Desocupados,
            Subocupados = sum(PONDERA[ESTADO == 1 & INTENSI ==1 & PP03J==1]) + sum(PONDERA[ESTADO == 1 & INTENSI ==1 & PP03J %in% c(2,9)]),
            Tasa_Actividad = round(PEA/Poblacion * 100, 1),
            Tasa_Empleo = round(Ocupados/Poblacion * 100, 1),
            Tasa_Desocupacion = round(Desocupados/PEA * 100, 1),
            Tasa_Subocupacion = round(Subocupados/PEA * 100, 1)) %>%
  ungroup %>%
  mutate(CH04 = ifelse(CH04 == "1", "Varones", "Mujeres"),
         TRIMESTRE = str_sub(TRIMESTRE, 1,1)) %>%
  rename(Año = "ANO4", Trimestre = "TRIMESTRE", Género = "CH04")

# Tasa de actividad
Data1 <- Data0 %>%
  mutate(Año = as.character(Año), Trimestre = as.character(Trimestre)) %>%
  select(Año, Trimestre, Género, Tasa_Actividad) %>%
  mutate(year_trimestre = paste0(Trimestre, "-", str_sub(Año, 3, 4))) %>%
  arrange(Año,Trimestre)

# Tasa de empleo
Data2 <- Data0 %>%
  mutate(Año = as.character(Año), Trimestre = as.character(Trimestre)) %>%
  select(Año, Trimestre, Género, Tasa_Empleo) %>%
  mutate(year_trimestre = paste0(Trimestre, "-", str_sub(Año, 3, 4))) %>%
  arrange(Año,Trimestre)

# Tasa de subocupación
Data3 <- Data0 %>%
  mutate(Año = as.character(Año), Trimestre = as.character(Trimestre)) %>%
  select(Año, Trimestre, Género, Tasa_Subocupacion) %>%
  mutate(year_trimestre = paste0(Trimestre, "-", str_sub(Año, 3, 4))) %>%
  arrange(Año,Trimestre)

# Tasa de desocupacion
Data4 <- Data0 %>%
  mutate(Año = as.character(Año), Trimestre = as.character(Trimestre)) %>%
  select(Año, Trimestre, Género, Tasa_Desocupacion) %>%
  mutate(year_trimestre = paste0(Trimestre, "-", str_sub(Año, 3, 4))) %>%
  arrange(Año,Trimestre)

######### ESCRIBIR DATOS #########
write_json(toJSON(Data1), path = paste0(dir, "/json/trabajo_actividad.json"))
write_json(toJSON(Data2), path = paste0(dir, "/json/trabajo_empleo.json"))
write_json(toJSON(Data3), path = paste0(dir, "/json/trabajo_subocupacion.json"))
write_json(toJSON(Data4), path = paste0(dir, "/json/trabajo_desocupacion.json"))