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

planilla <- "https://docs.google.com/spreadsheets/d/1Cfbecjc5DLo3uGsMEHscsfUC9YOtnKtFvt1bOZI_B4c/edit?usp=sharing"

Raw1 <- read_sheet(ss = planilla, sheet = "Ingresadas")
Raw2 <- read_sheet(ss = planilla, sheet = "Modalidad")
Raw3 <- read_sheet(ss = planilla, sheet = "Tipo")
Raw4 <- read_sheet(ss = planilla, sheet = "Vinculo")
Raw5 <- read_sheet(ss = planilla, sheet = "Persona_que_denuncia")
Raw6 <- read_sheet(ss = planilla, sheet = "Persona_denunciada")
Raw7 <- read_sheet(ss = planilla, sheet = "Persona_que_denuncia")
Raw8 <- read_sheet(ss = planilla, sheet = "Persona_denunciada")

######### TRANSFORMAR DATOS #########
# Ingresadas
Data1 <- Raw1 %>%
  filter(Tipo %ni% c("No configura VFG", "Consultas")) %>%
  group_by(Año, Distrito, Trimestre) %>%
  summarise(Cantidad = sum(Frecuencia)) %>%
  ungroup %>%
  mutate(year_trimestre = paste0(Trimestre, "-", str_sub(Año, 3,4)))
totalData1 <- Raw1 %>%
  filter(Tipo %ni% c("No configura VFG", "Consultas")) %>%
  group_by(Año, Trimestre) %>%
  summarise(Cantidad = sum(Frecuencia)) %>%
  ungroup %>%
  mutate(Distrito = "TODOS") %>%
  mutate(year_trimestre = paste0(Trimestre, "-", str_sub(Año, 3,4)))
Data1 <- rbind(Data1, totalData1)

# Modalidad
Data2 <- Raw2 %>%
  filter(Modalidad != "Sin especificar") %>%
  mutate(Año = as.character(Año)) %>%
  group_by(Año, Modalidad) %>%
  summarise(Cantidad = sum(Frecuencia)) %>%
  mutate(Porcentaje = 100 * Cantidad / sum(Cantidad))
totalData2 <- Raw2 %>%
  filter(Modalidad != "Sin especificar") %>%
  group_by(Modalidad) %>%
  summarise(Cantidad = sum(Frecuencia)) %>%
  mutate(Porcentaje = 100 * Cantidad / sum(Cantidad)) %>%
  ungroup %>%
  mutate(Año = "TODOS")
Data2 <- rbind(Data2, totalData2) %>%
  arrange(Año, desc(Porcentaje))

# Tipo
Data3 <- Raw3 %>%
  filter(Tipo != "Sin especificar") %>%
  mutate(Año = as.character(Año)) %>%
  group_by(Año, Tipo) %>%
  summarise(Cantidad = sum(Frecuencia)) %>%
  mutate(Porcentaje = 100 * Cantidad / sum(Cantidad))
totalData3 <- Raw3 %>%
  filter(Tipo != "Sin especificar") %>%
  group_by(Tipo) %>%
  summarise(Cantidad = sum(Frecuencia)) %>%
  mutate(Porcentaje = 100 * Cantidad / sum(Cantidad)) %>%
  ungroup %>%
  mutate(Año = "TODOS")
Data3 <- rbind(Data3, totalData3) %>%
  arrange(Año, desc(Porcentaje))

# Vinculo
Data4 <- Raw4 %>%
  filter(Vínculo != "Sin especificar") %>%
  mutate(Año = as.character(Año)) %>%
  group_by(Año, Vínculo) %>%
  summarise(Cantidad = sum(Cantidad)) %>%
  ungroup %>%
  mutate(Vínculo = ifelse((100 * Cantidad / sum(Cantidad)) <= 1, "Otro", Vínculo)) %>%
  group_by(Año, Vínculo) %>%
  summarise(Cantidad = sum(Cantidad)) %>%
  ungroup %>%
  group_by(Año) %>%
  mutate(Porcentaje = 100 * Cantidad / sum(Cantidad))
totalData4 <- Raw4 %>%
  filter(Vínculo != "Sin especificar") %>%
  group_by(Vínculo) %>%
  summarise(Cantidad = sum(Cantidad)) %>%
  ungroup %>%
  mutate(Vínculo = ifelse((100 * Cantidad / sum(Cantidad)) <= 1, "Otro", Vínculo)) %>%
  group_by(Vínculo) %>%
  summarise(Cantidad = sum(Cantidad)) %>%
  ungroup %>%
  mutate(Año = "TODOS") %>%
  mutate(Porcentaje = 100 * Cantidad / sum(Cantidad))
Data4 <- rbind(Data4, totalData4) %>%
  arrange(desc(Porcentaje))

# Persona que denuncia
Data5 <- Raw5 %>%
  mutate(Año = as.character(Año)) %>%
  group_by(Año, Género) %>%
  summarise(Cantidad = sum(Frecuencia)) %>%
  mutate(Porcentaje = 100 * Cantidad / sum(Cantidad))
totalData5 <- Raw5 %>%
  mutate(Año = as.character(Año)) %>%
  group_by(Género) %>%
  summarise(Cantidad = sum(Frecuencia)) %>%
  mutate(Porcentaje = 100 * Cantidad / sum(Cantidad)) %>%
  ungroup %>%
  mutate(Año = "TODOS")
Data5 <- rbind(Data5, totalData5) %>%
  arrange(desc(Porcentaje))

# Persona denunciada
Data6 <- Raw6 %>%
  mutate(Año = as.character(Año)) %>%
  group_by(Año, Género) %>%
  summarise(Cantidad = sum(Frecuencia)) %>%
  mutate(Porcentaje = 100 * Cantidad / sum(Cantidad))
totalData6 <- Raw6 %>%
  mutate(Año = as.character(Año)) %>%
  group_by(Género) %>%
  summarise(Cantidad = sum(Frecuencia)) %>%
  mutate(Porcentaje = 100 * Cantidad / sum(Cantidad)) %>%
  ungroup %>%
  mutate(Año = "TODOS")
Data6 <- rbind(Data6, totalData6) %>%
  arrange(desc(Porcentaje))

# Edades de las personas que denuncian
Data7 <- Raw7 %>%
  filter(Rango_etario != "Sin especificar") %>%
  mutate(Rango_etario = paste0(sprintf("%02d", Ord_rango_etario), "-", Rango_etario)) %>%
  mutate(Año = as.character(Año)) %>%
  group_by(Año, Género, Rango_etario) %>%
  summarise(Cantidad = sum(Frecuencia)) %>%
  ungroup %>%
  group_by(Año) %>%
  mutate(Porcentaje = 100 * Cantidad / sum(Cantidad))
totalData7 <- Raw7 %>%
  filter(Rango_etario != "Sin especificar") %>%
  mutate(Rango_etario = paste0(sprintf("%02d", Ord_rango_etario), "-", Rango_etario)) %>%
  group_by(Género, Rango_etario) %>%
  summarise(Cantidad = sum(Frecuencia)) %>%
  ungroup %>%
  mutate(Porcentaje = 100 * Cantidad / sum(Cantidad)) %>%
  mutate(Año = "TODOS")
Data7 <- rbind(Data7, totalData7)
Data7 <- Data7 %>%
  mutate(Cantidad = ifelse(Género == "Mujeres", -1 * Cantidad, Cantidad)) %>%
  mutate(Porcentaje = ifelse(Género == "Mujeres", -1 * Porcentaje, Porcentaje)) %>%
  arrange(desc(Rango_etario))

# Edades de las personas denunciadas
Data8 <- Raw8 %>%
  filter(Rango_etario != "Sin especificar") %>%
  mutate(Rango_etario = paste0(sprintf("%02d", Ord_rango_etario), "-", Rango_etario)) %>%
  mutate(Año = as.character(Año)) %>%
  group_by(Año, Género, Rango_etario) %>%
  summarise(Cantidad = sum(Frecuencia)) %>%
  ungroup %>%
  group_by(Año) %>%
  mutate(Porcentaje = 100 * Cantidad / sum(Cantidad))
totalData8 <- Raw8 %>%
  filter(Rango_etario != "Sin especificar") %>%
  mutate(Rango_etario = paste0(sprintf("%02d", Ord_rango_etario), "-", Rango_etario)) %>%
  group_by(Género, Rango_etario) %>%
  summarise(Cantidad = sum(Frecuencia)) %>%
  ungroup %>%
  mutate(Porcentaje = 100 * Cantidad / sum(Cantidad)) %>%
  mutate(Año = "TODOS")
Data8 <- rbind(Data8, totalData8)
Data8 <- Data8 %>%
  mutate(Cantidad = ifelse(Género == "Mujeres", -1 * Cantidad, Cantidad)) %>%
  mutate(Porcentaje = ifelse(Género == "Mujeres", -1 * Porcentaje, Porcentaje)) %>%
  arrange(desc(Rango_etario))

######### ESCRIBIR DATOS #########
write_json(toJSON(Data1), path = paste0(dir, "/json/denuncias_ovfg_ingresadas.json"))

write_json(toJSON(Data2), path = paste0(dir, "/json/denuncias_ovfg_modalidades.json"))

write_json(toJSON(Data3), path = paste0(dir, "/json/denuncias_ovfg_tipos.json"))

write_json(toJSON(Data4), path = paste0(dir, "/json/denuncias_ovfg_vinculo.json"))

write_json(toJSON(Data5), path = paste0(dir, "/json/denuncias_ovfg_genero_denunciante.json"))

write_json(toJSON(Data6), path = paste0(dir, "/json/denuncias_ovfg_genero_denunciado.json"))

write_json(toJSON(Data7), path = paste0(dir, "/json/denuncias_ovfg_edades_denunciante.json"))

write_json(toJSON(Data8), path = paste0(dir, "/json/denuncias_ovfg_edades_denunciado.json"))