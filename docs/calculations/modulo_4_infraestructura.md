# Protocolo de Certificación: Módulo 4 - Infraestructura y Servicios 🏗️

---

### **Visión General: El Activo Físico Auditable**
En el marco de **City-RISK**, la infraestructura no es solo un conjunto de obras, sino el sustento material que garantiza la continuidad operativa del municipio. El Módulo 4 transforma el inventario de servicios básicos en un **Índice de Infraestructura (II)** verificado, permitiendo a los inversores validar que los activos físicos coinciden con la realidad del terreno y no son meras proyecciones contables.

---

## **1. Service Trust Stack: Arquitectura de Verificación Espacial**
La integridad de la infraestructura se construye sobre la ponderación estratégica de tres servicios críticos:

*   **Agua Potable (40%)**: El pilar de la resiliencia sanitaria y calidad de vida.
*   **Gestión de Efluentes y Saneamiento (40%)**: El indicador definitivo de madurez urbana y sostenibilidad ambiental.
*   **Conectividad y Fibra Óptica (20%)**: El habilitador de la economía digital y la eficiencia administrativa.

Fórmula de Consolidación:  
$II = (Agua \times 0.4) + (Cloacas \times 0.4) + (Fibra \times 0.2)$

---

## **2. El Handshake con OpenStreetMap (Prueba de Realidad) 🌎**
A diferencia de los reportes tradicionales, este módulo implementa un motor de auditoría asincrónico con la **Overpass API (OpenStreetMap)**.

*   **Mecanismo de Auditoría**: El sistema realiza un barrido de nodos georreferenciados (`water_tower`, `wastewater_plant`, `telecom`) en la jurisdicción certificada en el Módulo 2.
*   **Truth Score (Métrica de Verdad)**: Compara la densidad de servicios declarada vs. la evidencia física detectada.
*   **Cap de Seguridad**: Si el municipio no se somete a la validación OSM, el Score de Infraestructura queda limitado a un máximo de **80%**, impidiendo el acceso a la categoría de inversión A+.

---

## **3. Clasificación de Reputación y Riesgo 🛡️**

### **A. Estados de Verificación (SBT Reputation)**
El sistema asigna etiquetas de reputación inmutables basadas en la consistencia de los datos:
*   **🛡️ VERIFIED_REALITY**: Los datos declarados guardan correlación directa con la infraestructura mapeada en nodos globales.
*   **🚨 OPTIMISTIC_BIAS**: Se detecta una discrepancia significativa (> 15%) entre lo declarado y la evidencia física. El sistema marca el perfil como "Sesgo Optimista", alertando a los auditores.

### **B. Umbrales de Alerta Preventiva**
*   **CRÍTICO (Sanitario)**: Activado automáticamente si el agua potable o las cloacas están por debajo del **50%**. Establece un bloqueo en la calificación de solvencia.
*   **BRECHA TÉCNICA**: Identificado cuando el índice consolidado es menor al **70%**, sugiriendo una necesidad urgente de inversión en capital para mantener la competitividad territorial.

---

## **4. Valor para el Mercado e Inversión Impacto**
El Módulo 4 es el corazón de la **Inversión con Propósito** dentro de City-RISK:

1.  **Validación de Garantías Físicas**: Para créditos destinados a obra pública, este protocolo certifica el estado inicial ("Línea de Base") y el progreso real mediante actualizaciones cartográficas.
2.  **Mitigación de Riesgo Sanitario**: Reduce la incertidumbre sobre posibles pasivos ambientales o crisis de salud pública que afecten el flujo de caja municipal.
3.  **Certificación de Capital Humano**: Un municipio con alta conectividad (Fibra) y saneamiento básico atrae talento y empresas, aumentando la base tributaria a largo plazo.

---
*City-RISK Protocol | Framework de Inteligencia de Infraestructura*
