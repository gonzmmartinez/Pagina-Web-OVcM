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

######### LEER DATOS #########
dir <- dirname(rstudioapi::getActiveDocumentContext()$path)

Raw <- rbind(
  get_microdata(
    year = 2020:2023,
    period = 1:4,
    type = "individual",
    vars = c("ANO4", "TRIMESTRE", "REGION", "AGLOMERADO", "PONDERA" , "CH04",
             "CH06", "ESTADO", "CAT_OCUP", "CAT_INAC", "INTENSI", "PP03J")),
  get_microdata(
    year = 2024,
    period = 1:3,
    type = "individual",
    vars = c("ANO4", "TRIMESTRE", "REGION", "AGLOMERADO", "PONDERA" , "CH04",
             "CH06", "ESTADO", "CAT_OCUP", "CAT_INAC", "INTENSI", "PP03J"))
)

######### TRANSFORMAR DATOS #########

# Matriculas por genero
Data1 <- Raw %>%
  mutate(ANO4 = as.character(ANO4), TRIMESTRE = as.character(TRIMESTRE)) %>%
  filter(AGLOMERADO == 23, CH06 >= 14) %>%
  organize_labels(type = "individual") %>%
  group_by(ANO4, TRIMESTRE, CH04) %>%
  summarise(Poblacion = sum(PONDERA),
            Ocupados = sum(PONDERA[ESTADO == 1]),
            Desocupados = sum(PONDERA[ESTADO == 2]),
            PEA = Ocupados + Desocupados,
            Subocupados = sum(PONDERA[ESTADO == 1 & INTENSI ==1 & PP03J==1]) + sum(PONDERA[ESTADO == 1 & INTENSI ==1 & PP03J %in% c(2,9)]),
            Tasa_Actividad = round(PEA/Poblacion * 100, 1)) %>%
  ungroup %>%
  mutate(CH04 = ifelse(CH04 == "1", "Varones", "Mujeres"),
         TRIMESTRE = str_sub(TRIMESTRE, 1,1)) %>%
  rename(Año = "ANO4", Trimestre = "TRIMESTRE", Género = "CH04") %>%
  select(Año, Trimestre, Género, Tasa_Actividad) %>%
  mutate(year_trimestre = paste0(Trimestre, "-", str_sub(Año, 3,4)))

######### ESCRIBIR DATOS #########
write_json(toJSON(Data1), path = paste0(dir, "/json/trabajo_actividad.json"))