# Protocolo de Certificación: Módulo 3 - Solvencia Económica 💰

---

### **Visión General: El Motor de la Confianza**
En el ecosistema **City-RISK**, la solvencia económica no se mide por el volumen de presupuesto, sino por la calidad del excedente. El Módulo 3 define el **Coeficiente de Solvencia ($\alpha$)**, la variable matemática fundamental que determina la capacidad real del municipio para honrar sus compromisos financieros sin comprometer la prestación de servicios básicos.

---

## **1. Economic Trust Stack: Arquitectura de Verdad Fiscal**
La integridad financiera se construye sobre tres procesos de validación:

*   **CAPA DE FLUJO PRIMARIO (Cash Flow Proof)**: Cálculo en tiempo real del excedente operativo. Representa la "utilidad" del municipio antes del pago de deudas, validando que la estructura de gastos corrientes es sostenible respecto a los ingresos genuinos.
*   **ORÁCULO DE TRAZABILIDAD MONETARIA (Price Oracle)**: Integración con la API neutra **Frankfurter / ExchangeRate-API** para la conversión dinámica a divisas duras (USD/EUR). Esto elimina la discrecionalidad en la declaración de valores ante inversores internacionales, actuando como un tercero imparcial.
*   **ANCLAJE DE INTEGRIDAD (Blockchain Hash)**: Cada cierre fiscal genera un hash SHA-256 único. Esto garantiza que una vez declarados los ingresos y gastos, los datos son inmutables para el mercado.

---

## **2. El Semáforo Financiero: Lógica del Riesgo**
El sistema procesa los ratios financieros y asigna automáticamente una calificación basada en el **Superávit Primario (%)** sobre los ingresos totales:

*   🟢 **VERDE (A+) - Excelencia Fiscal**: Superávit Primario **> 15%**. Indica una estructura robusta con alta capacidad de ahorro y resiliencia ante shocks económicos.
*   🟡 **AMARILLO (B) - Estabilidad**: Superávit entre **5% y 15%**. Representa un municipio equilibrado, pero con márgenes de maniobra limitados ante imprevistos.
*   🔴 **ROJO (C) - Alerta de Riesgo**: Superávit **< 5%** o **Déficit**. Activa penalizaciones automáticas en el Score Risk-70 y reduce drásticamente el Coeficiente $\alpha$.

---

## **3. Mecanismos de Confianza y Rigor Técnico**

### **A. Cálculo del Coeficiente $\alpha$ (Alpha)**
El Coeficiente $\alpha$ es el multiplicador de confianza que afecta la valoración global del municipio.
*   **$\alpha = 1.0$**: Validación exitosa de superávit primario positivo, baja relación deuda/ingresos y certificación por nodo remoto.
*   **$\alpha = 0.4$**: Penalización por riesgo crítico (Déficit detected). Este ajuste reduce proporcionalmente el atractivo del activo municipal en el mercado.

### **B. Desempeño de Inversión (Músculo de Crecimiento)**
*   **Fórmula de Capacidad**: $CI = \frac{(Ingresos - Gastos Corrientes - Deuda)}{Ingresos} \times 100$
*   **Valor para el Auditor**: Permite identificar cuánto del presupuesto se destina realmente a la creación de nuevos activos (infraestructura) frente al mero mantenimiento operativo.

### **C. La Lente del Inversor (Triple Moneda)**
Para eliminar la sospecha de manipulación del tipo de cambio, el sistema impone la **Trazabilidad Monetaria**:
1.  **Captura**: Se registran los valores en moneda local (ARS).
2.  **Consulta**: El Oráculo (API externa) provee la tasa de conversión oficial del día.
3.  **Proyección**: Se ofrecen métricas en USD y EUR, permitiendo que el inversor evalúe la solvencia en una moneda de referencia sin volatilidad local.

---

## **4. Impacto en el Modelo de Riesgo Crediticio**
El Módulo 3 es el principal determinante del **Riesgo Exógeno** en el modelo Risk-70.

1.  **Certeza de Pago**: Un Coeficiente $\alpha$ alto reduce la tasa de interés exigida por el mercado.
2.  **Protección contra Inflación**: La conversión mediante oráculos permite normalizar el análisis histórico de solvencia, neutralizando los efectos de la depreciación monetaria.
3.  **Certificación de Solvencia**: Solo se emite el sello de "Válido" cuando el sistema detecta que el ahorro primario es real y ha sido anclado mediante un hash criptográfico.

---
*City-RISK Protocol | Framework de Solvencia Económica*
