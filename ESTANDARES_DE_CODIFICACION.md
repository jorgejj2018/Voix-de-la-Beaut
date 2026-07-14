# Estándares de Codificación — Voix de la Beauté

Fecha: 2026-07-13
Autor: Equipo de Desarrollo — Voix de la Beauté

## 1. Introducción

Este documento establece los estándares de codificación aplicables al proyecto Voix de la Beauté, una plataforma editorial desarrollada con React.js, Tailwind CSS y Firebase. Su propósito es garantizar la calidad del software, la coherencia del código, la facilidad de mantenimiento y la colaboración efectiva entre desarrolladores, facilitando auditorías, revisiones y el cumplimiento de buenas prácticas de ingeniería para presentación ante el SENA.

## 2. Convenciones de Nomenclatura (Naming Conventions)

- **Lenguaje de identificadores:** Usar inglés técnico para identificadores de código (variables, funciones, componentes, APIs). El texto visible de la interfaz puede permanecer en el idioma de contenido.
- **Componentes de React:** `PascalCase` para nombres de componentes y archivos. Ej.: `ArticleCard.jsx`, `AdminDashboardPage.jsx`.
- **Hooks personalizados:** prefijo `use` + `camelCase`; archivos en `camelCase` o `useXxx.js`/`.jsx`. Ej.: `useArticles.js`.
- **Contextos:** `PascalCase` para nombre de archivo y exportación. Ej.: `AuthContext.jsx`.
- **Páginas / Rutas:** `PascalCase`. Ej.: `HomePage.jsx`.
- **Servicios / APIs:** `camelCase` para archivos y funciones; usar sufijo `Service` cuando aplique. Ej.: `articlesService.js`.
- **Utilidades / Constants:** funciones en `camelCase`; constantes inmutables en `UPPER_SNAKE_CASE`. Archivos descriptivos: `formatDate.js`, `roles.js`.
- **Assets / Clases CSS:** si se crean clases personalizadas, usar `kebab-case`; para utilidades Tailwind respetar la convención del framework.
- **Variables, funciones y props:** `camelCase`. Evitar abreviaciones ambiguas.
- **Extensiones de archivo:** usar `.jsx` para componentes que retornan JSX y `.js` para servicios/útiles que no requieren JSX.
- **Exports:** Components — `default` export para componentes principales; hooks, utils y services — preferir `named exports` cuando el archivo exporta varias utilidades.

**Ejemplo:**

```jsx
// ArticleCard.jsx
export default function ArticleCard({ article }) { /* ... */ }

// useArticles.js
export function useArticles() { /* ... */ }
```

## 3. Estándares de Estructura y Lógica (React.js)

- **Arquitectura de carpetas:** Mantener la separación clara: `components/`, `pages/`, `services/`, `hooks/`, `context/`, `router/`, `utils/`.
  - `components/` — componentes reutilizables y presentacionales.
  - `pages/` — vistas que componen la interfaz por rutas.
  - `services/` — adaptadores y wrappers de Firebase y APIs externas.
  - `hooks/` — hooks personalizados que encapsulan lógica de estado y efectos.
  - `context/` — providers y contextos de aplicación.

- **Componentes funcionales:** usar componentes funcionales basados en hooks; evitar clases. Aplicar el principio SRP (Single Responsibility). Preferir componentes pequeños y composables (ideal < 200 líneas).
- **Props & Tipado:** documentar props con JSDoc o `PropTypes`. Si se migra a TypeScript, definir tipos e interfaces claras.
- **Estado y efectos:** minimizar estado local; derivar siempre que sea posible. Evitar side-effects en render; usar `useEffect` con dependencias completas y limpieza adecuada.
- **Memorización:** usar `React.memo`, `useMemo`, `useCallback` solo cuando exista evidencia de beneficio; documentar la razón.
- **Accesibilidad (a11y):** emplear elementos semánticos (`<main>`, `<nav>`, `<header>`), roles ARIA según necesidad, manejo de foco y contraste WCAG AA.
- **Render condicional:** mantener expresiones claras; extraer lógica compleja a helpers.
- **Separación Presentational vs Container:** los componentes presentacionales no deben acceder directamente a servicios; los containers o hooks deben inyectar datos.
- **Manejo de datos remotos:** centralizar llamadas a Firebase en `services/` y exponerse a través de hooks (`useArticles`, etc.).
- **Testing:** diseñar para testabilidad (inmutabilidad, inyección de dependencias); usar React Testing Library y pruebas unitarias/integ.
- **Imports:** orden consistente: dependencias externas → aliases/paths absolutos → imports relativos. Evitar re-exportar en exceso.
- **Error boundaries:** implementar `ErrorBoundary` en rutas críticas para recuperación de UI y logging.

## 4. Estándares de Estilos (Tailwind CSS)

- **Filosofía:** usar Tailwind como fuente principal de estilos. Para patrones complejos, encapsular en componentes estilizados reutilizables.
- **Tokens de diseño:** configurar `tailwind.config.js` con colores, tipografías, espaciados y breakpoints; prohibir valores ad-hoc fuera de la configuración.
- **Orden y legibilidad de clases:** mantener un orden lógico en `className`: layout → box model → spacing → typography → color → estados. Ej.:

```
className="flex items-center justify-between p-4 text-sm text-gray-700 hover:text-black"
```

- **Utilidades de composición:** usar `clsx`/`classnames` para clases condicionales; extraer combinaciones repetidas y, cuando aplique, usar `@apply` en reglas CSS para agrupar estilos.
- **Responsive:** aplicar enfoque mobile-first con prefijos `sm:`, `md:`, `lg:` de forma consistente.
- **Dark mode / temas:** gestionar temas con variables y tokens en `tailwind.config.js` y utilizar `dark:` para estados.
- **Prohibiciones:** evitar estilos inline salvo excepciones justificadas; evitar `!important` y no abusar de `style={{}}`.
- **Accesibilidad visual:** garantizar foco visible (`focus:ring`, `focus:outline`) y contraste suficiente.

## 5. Comentarios y Documentación

- **Tipo de comentarios:** priorizar comentarios que expliquen el *porqué* (rationale); evitar comentarios que repitan el código.
- **JSDoc / Docstrings:** documentar hooks, servicios y componentes públicos con JSDoc para mejorar autocompletado y claridad.

```js
/**
 * useArticles - hook para obtener y paginar artículos.
 * @param {Object} options - opciones de consulta
 * @returns {{ articles: Array, loading: boolean, error: Error|null }}
 */
```

- **Documentos por módulo:** cada carpeta principal debe incluir un `README.md` breve que describa su propósito, contratos y ejemplos de uso.
- **Onboarding técnico:** incluir `DESARROLLO.md` con pasos para configurar el entorno local, variables de entorno necesarias y comandos comunes (`npm/yarn`, lint, test).
- **Changelog y releases:** mantener changelog siguiendo SemVer; documentar notas de release.
- **PRs:** las solicitudes de integración deben contener descripción del cambio, motivación y pasos para reproducir/pruebas.

## 6. Manejo de Errores y Seguridad

- **Manejo de errores:** envolver llamadas asíncronas con `try/catch`; propagar errores con mensajes claros y niveles de log.
- **Logging y monitoreo:** evitar `console.log` en producción; usar un logger configurable y/o integraciones de monitoreo (Sentry u otra).
- **Validación y sanitización:** validar entradas en cliente y servidor; sanitizar HTML o rich text antes de renderizar para prevenir XSS.
- **Autenticación y autorización:** usar Firebase Auth y reglas estrictas en `firestore.rules` y Storage. Aplicar principio de mínimo privilegio.
- **Secretos y configuraciones:** no incluir claves en el repositorio; usar variables de entorno y documentarlas en `DESARROLLO.md`.
- **Dependencias:** mantener dependencias actualizadas; habilitar escaneo automático de vulnerabilidades (Dependabot, Renovate).
- **Protecciones HTTP y CSP:** configurar cabeceras de seguridad en hosting si aplica (CSP, HSTS, X-Frame-Options).
- **Privacidad de datos:** minimizar recopilación de datos personales y aplicar cifrado según normativa vigente.

## 7. Control de Versiones (Git)

- **Modelo de branching:** flujo basado en ramas de características: `main` (protegida, deployable), `develop` (opcional) y `feature/`/`hotfix/`.
- **Naming de ramas:** `feature/1234-add-article-preview`, `fix/issue-567-null-author`.
- **Commits:** usar Conventional Commits: `type(scope): descripción`. Ej.: `feat(articles): add featured article card`.
- **Pull Requests:** cada PR debe incluir descripción, referencia a issue/ticket, checklist (lint, tests, seguridad, accesibilidad) y capturas si procede.
- **Revisión de código:** mínimo 1 reviewer (2 recomendado en cambios críticos). Revisar calidad, pruebas, performance y seguridad.
- **Política de merge:** `squash and merge` o `rebase` para historial lineal; requerir PRs aprobados y CI verde.
- **Hooks locales y CI:** usar `husky` + `lint-staged` para ejecutar `eslint --fix` y `prettier --write` en pre-commit. CI debe ejecutar lint, tests y build.
- **Etiquetado de releases:** SemVer: `vMAJOR.MINOR.PATCH` y changelog asociado.
- **Gestión de assets grandes:** usar Git LFS para archivos multimedia pesados.

## 8. Herramientas y Configuración Recomendadas

- **Linting & Formato:** `ESLint` con `eslint-plugin-react`, `eslint-plugin-react-hooks`, `eslint-plugin-import`. Integrar `Prettier` con `eslint-config-prettier`.
- **Pre-commit y formateo:** `husky` + `lint-staged`.
- **Testing:** `jest`, `@testing-library/react`, `msw` para mocks de red.
- **CI/CD:** pipeline que ejecute: install → lint → tests → build → deploy (según entorno).
- **Dependabot / Renovate:** habilitar para actualizaciones automatizadas de dependencias.

## 9. Enforzamiento, Cumplimiento y Onboarding

- **Automatización:** habilitar checks obligatorios en PR (lint, tests, build). No permitir merges con fallas.
- **Checklist de revisión:** claridad, pruebas, cumplimiento de nomenclatura y estilo, evaluación de seguridad y accesibilidad.
- **Capacitación:** sesión de 1–2 horas para el equipo sobre estándares y flujo de trabajo.
- **Revisión periódica:** revisar y actualizar este documento cada 6 meses o cuando cambie el stack.

## 10. Anexos y Plantillas Útiles

- **Ejemplos de commits (Conventional):**
  - `feat(auth): add Google OAuth login`
  - `fix(articles): avoid crash when article has no author`
- **Reglas ESLint recomendadas (extracto):**
  - `react-hooks/rules-of-hooks: error`
  - `react-hooks/exhaustive-deps: warn`
  - `no-console: warn` (o `error` en producción)
  - `import/order` para orden uniforme de imports
- **Estructura mínima recomendada:**
  - `src/components/` — UI reusables
  - `src/pages/` — vistas
  - `src/services/` — Firebase wrappers
  - `src/hooks/` — hooks personalizados
  - `src/context/` — providers
  - `src/utils/` — helpers

---

Este documento debe guardarse en la raíz del repositorio y mantenerse versionado. Si lo desea, puedo:

- crear plantillas de PR y commit en el repositorio;
- añadir configuración inicial de `ESLint`, `Prettier` y `husky`;
- crear un pipeline CI básico (archivo de workflow) para ejecutar lint y tests.

Indíqueme cuáles acciones adicionales desea que ejecute ahora.
