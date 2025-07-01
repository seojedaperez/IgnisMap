# Plan de Migración a Datos Reales

## 🌍 **APIs REALES RECOMENDADAS**

### **1. Datos de Biodiversidad y Especies**
```
GBIF (Global Biodiversity Information Facility)
- API: https://api.gbif.org/v1/
- Datos: Especies, distribución, estado de conservación
- Gratuita con registro

IUCN Red List API
- API: https://apiv3.iucnredlist.org/
- Datos: Estados de conservación oficiales
- Requiere API key gratuita

eBird API (Cornell Lab)
- API: https://ebird.org/api/keygen
- Datos: Observaciones de aves en tiempo real
- Gratuita con registro
```

### **2. Datos de Infraestructura**
```
OpenStreetMap Overpass API
- API: https://overpass-api.de/api/
- Datos: Edificios, hospitales, escuelas, carreteras
- Completamente gratuita

HERE Maps API
- API: https://developer.here.com/
- Datos: Infraestructura detallada, rutas
- Plan gratuito disponible

Google Places API
- API: https://developers.google.com/maps/documentation/places
- Datos: Puntos de interés, edificios críticos
- Requiere facturación
```

### **3. Datos de Incendios Históricos**
```
NASA FIRMS (Fire Information for Resource Management System)
- API: https://firms.modaps.eosdis.nasa.gov/api/
- Datos: Fuegos activos en tiempo real, históricos
- Completamente gratuita

EFFIS (European Forest Fire Information System)
- API: https://effis.jrc.ec.europa.eu/
- Datos: Incendios forestales en Europa
- Acceso público

NIFC (National Interagency Fire Center)
- API: https://data-nifc.opendata.arcgis.com/
- Datos: Incendios en EEUU, pero útil para modelos
- Gratuita
```

### **4. Datos Meteorológicos Avanzados**
```
ECMWF (European Centre for Medium-Range Weather Forecasts)
- API: https://www.ecmwf.int/en/forecasts/datasets
- Datos: Modelos meteorológicos profesionales
- Algunos datos gratuitos

NOAA Weather API
- API: https://www.weather.gov/documentation/services-web-api
- Datos: Datos meteorológicos detallados
- Completamente gratuita

Windy API
- API: https://api.windy.com/
- Datos: Vientos detallados, modelos atmosféricos
- Plan gratuito limitado
```

### **5. Datos de Vegetación y Sequía**
```
USGS Earth Explorer
- API: https://earthexplorer.usgs.gov/
- Datos: Landsat, índices de vegetación
- Gratuita con registro

Copernicus Climate Data Store
- API: https://cds.climate.copernicus.eu/api-how-to
- Datos: Índices de sequía, clima
- Gratuita con registro

MODIS Web Service
- API: https://modis.ornl.gov/data/modis_webservice.html
- Datos: NDVI, temperatura superficial
- Completamente gratuita
```

## 🔧 **IMPLEMENTACIÓN PRIORITARIA**

### **Fase 1: Datos Críticos (Semana 1)**
1. **NASA FIRMS** - Fuegos activos reales
2. **GBIF** - Especies en peligro reales
3. **OpenStreetMap** - Infraestructura real
4. **USGS** - Índices de vegetación reales

### **Fase 2: Datos Avanzados (Semana 2)**
1. **IUCN Red List** - Estados de conservación oficiales
2. **ECMWF** - Modelos meteorológicos profesionales
3. **Copernicus** - Datos de sequía reales
4. **HERE Maps** - Rutas de evacuación reales

### **Fase 3: Optimización (Semana 3)**
1. **Windy API** - Análisis de vientos profesional
2. **eBird** - Fauna en tiempo real
3. **EFFIS** - Incendios forestales europeos
4. **Google Places** - Infraestructura crítica detallada

## 💰 **COSTOS ESTIMADOS**

### **APIs Gratuitas (0€/mes)**
- Open-Meteo ✅ (ya implementada)
- NASA FIRMS
- GBIF
- OpenStreetMap
- USGS
- NOAA
- Copernicus

### **APIs con Plan Gratuito Limitado**
- HERE Maps: 250,000 requests/mes gratis
- Windy API: 1,000 requests/día gratis
- Google Places: $200 crédito mensual

### **APIs Premium (si necesario)**
- ECMWF: €50-200/mes según uso
- Google Maps Platform: Según uso

## 🚀 **IMPLEMENTACIÓN INMEDIATA**

### **Eliminar Datos Simulados:**
```bash
# Archivos a modificar para usar datos reales:
src/services/windAnalysisService.ts
src/services/biodiversityAssessmentService.ts
src/services/tacticalFirefightingService.ts
src/contexts/AlertContext.tsx
```

### **Mantener Datos Reales:**
```bash
# Archivos que YA usan datos reales:
src/services/weatherService.ts ✅
src/services/planetaryComputerService.ts ✅ (parcial)
```