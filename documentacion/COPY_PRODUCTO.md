# Copy de producto (permitido / prohibido)

Norma editorial del frontend en **runtime** (lo que ve el usuario). La
documentación técnica sí puede explicar el papel del LLM; la interfaz, no.

## Permitido (lenguaje de producto)

- recomendación personalizada
- calidad turística
- coherencia de ruta
- contexto del destino
- preferencias del viaje
- lugares registrados en SpainWay

**Frase de referencia** (usada en `TrustPanel`):

> «SpainWay ha organizado este viaje combinando tus preferencias, la calidad
> turística de los lugares, la coherencia de la ruta y el contexto disponible del
> destino.»

Otras frases neutras válidas:

> «Cómo se ha construido tu viaje» · «Por qué SpainWay te recomienda este viaje»
> · «Resumen de criterios utilizados para construir la recomendación.»

## Prohibido en runtime

Estos términos **no deben aparecer** en pantallas ni componentes visibles:

- `LLM`
- `ChatGPT`
- `OpenAI`
- `TFG`
- `defensa`
- `tribunal`
- `no genera`
- `no inventa`

## Verificación

Se comprueba con una búsqueda sobre `src/` (excluyendo tests/documentación):

```bash
grep -rniE "\bLLM\b|ChatGPT|OpenAI|\bTFG\b|defensa|tribunal|no genera|no inventa" src
# resultado esperado: sin coincidencias
```

Resultado actual: **0 coincidencias** en runtime.

Existe además un test que verifica que las etiquetas de explicabilidad no
contienen jerga prohibida (`src/lib/insightLabels.test.ts`).

## Correcciones aplicadas

| Antes | Después |
|-------|---------|
| «…integrarse con el motor IA del **TFG**.» (MenuConfiguracionGlobal) | «…un motor propio de recomendación que construye itinerarios a partir de tus preferencias y de la calidad turística de cada lugar.» |
| «La nueva versión usa la **IA2 actual**…» | «La nueva versión combina tus preferencias, tu contexto guardado…» |
| «El **modelo no asignó** POIs para este día.» | «Aún no hay paradas asignadas para este día.» |

## Nota

El término «IA» (inteligencia artificial) NO está en la lista prohibida y es copy
de producto habitual; se mantiene donde aporta claridad.
