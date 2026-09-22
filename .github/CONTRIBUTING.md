# Guía de contribución — inmobiliaria_api

> Esta guía tiene **tres secciones**. Empezá por la primera. Si entendés la idea,
> las reglas te van a parecer obvias; si no, las reglas te van a parecer arbitrarias.

---

## 🧠 La idea (leé esto primero)

Somos un equipo chico (3 personas: @eveernst, @ezesanchezb, @JuanTreiyerr) trabajando en
**inmobiliaria_api** como proyecto de la materia. Esto define cómo nos coordinamos: **todos
tenemos que poder participar, todos tenemos que poder tocar código, y nadie tiene que quedar
esperando a otro para hacer su parte**.

Por eso la asignación de issues no es "el líder te asigna lo que te toca".
Es **auto-organizada** con tres reglas simples:

1. **Nadie te tiene que decir qué hacer.** Si ves una issue que te interesa y
   podés resolver, la tomás. Los compañeros sugieren; vos decidís.
2. **Una vez que tomás una issue, es tuya hasta que la termines o la liberes.**
   Nadie te la saca. Eso te protege de que alguien te pise el trabajo o te
   haga perder contexto.
3. **Cada tanto alguien distinto hace de Product Owner.** Su trabajo no es
   "mandar", es **destrabar**: revisar las issues `triage:rotating`, decidir
   prioridades, y ser el punto de contacto si hay un bloqueo. El resto del
   tiempo puede seguir `claim`-eando issues con libertad.

Este modelo se llama **"PO + self-claim con hard lock"**. El PO activo se gestiona a
mano vía PR a `.github/ROTA.yml`.

### Por qué funciona para nosotros

- **Elimina el cuello de botella.** Si la asignación depende de UNA persona,
  cuando esa persona está ocupada, nadie avanza. Con self-claim, la asignación
  es inmediata y el PO se libera para pensar producto, no para repartir tareas.
- **Elimina el robo de contexto.** Si vos arrancás una issue y alguien te la
  reasigna a mitad de camino, perdiste el trabajo. El hard lock te protege
  y te obliga a pedirte explícitamente que la liberes.
- **Reparte la responsabilidad de producto.** En un trabajo de materia, todos
  necesitamos demostrar que podemos priorizar, decidir, y destrabar.
- **Es auditable.** Para la entrega de la materia, queda registro de quién
  trabajó qué y quién fue PO cuándo.

### Por qué NO es "totalmente libre"

- **Sin hard lock**, alguien podría desasignarte la issue a vos mismo para
  quedársela, y tendrías un conflicto que resolver por chat.
- **Sin PO**, las decisiones de producto quedarían implícitas en el
  código, sin ownership claro.
- **Sin un assignee por issue**, el trabajo se diluye: dos personas tocando
  lo mismo se chocan, una persona termina haciendo todo y la otra nada.

---

## 🛠️ Cómo funciona en la práctica

### Para tomar una issue (cualquier dev del equipo)

1. Buscá una issue con label `status:needs-triage` y sin asignar.
2. Comentá `/claim` en ella.
3. El bot te asigna automáticamente y le pone `status:claimed`. Listo, es tuya.

### Si no podés seguir con una issue

1. Comentá `/release` en ella (solo vos, el assignee actual, podés).
2. Vuelve a `status:needs-triage`. Otro dev la puede tomar.

### Si te equivocaste al tomar una o querés pasársela a otro

1. Reasignala manualmente desde la UI de GitHub (mientras seas el assignee).
2. Avisale al otro por el chat del equipo.
3. La Action te deja reasignar a vos mismo como excepción al hard lock.

### Si la issue está bloqueada por algo externo

1. Comentá `/blocked <razón>` en ella (solo vos, el assignee actual, podés).
   Ejemplo: `/blocked esperando definición de @ezesanchezb sobre el modelo de Insurance`.
2. El bot agrega `status:blocked` y comenta confirmando con la razón.
3. Cuando se destrabe: `/unblocked` (vos otra vez). Vuelve a `status:claimed`.

### Si la issue necesita una decisión de producto

1. Agregale el label `triage:rotating`.
2. Esperá al PO activo (ver `.github/ROTA.yml`).

### El PO activo

1. El PO activo se define en `.github/ROTA.yml`. El equipo lo cambia con un PR
   cuando lo decide.
2. Tu trabajo como PO: revisar issues con `triage:rotating`, resolver
   ambigüedades de prioridad/área, y destrabar a quien te pida ayuda.
3. **NO tenés que asignar a nadie.** Si querés reorganizar el trabajo,
   reasigná vos mismo con justificación; los demás siguen con self-claim.

### Cuando tu PR mergea y cierra una issue

1. Tu PR usa la plantilla `PULL_REQUEST_TEMPLATE.md` con el body `Closes #N`.
2. Al mergearla, el bot pasa la issue de `status:claimed` a `status:done`.
3. `status:done` es **sello histórico**: no se quita nunca. Si reabrís la
   issue después, queda como marca de auditoría.

---

## 📋 Reglas duras (las que el bot enforce)

1. Toda issue nueva arranca con `status:needs-triage`.
2. Para tomar una issue: `/claim`. El bot asigna al comentarista.
   - Este repo es de una cuenta personal, no de una organización: el chequeo
     acepta comentarios de `MEMBER`, `OWNER` o **`COLLABORATOR`** (colaborador
     invitado al repo). Sin `COLLABORATOR` en la lista, ningún compañero podría
     `/claim` nada.
3. Para liberarla: `/release` (solo el assignee actual puede).
4. Para bloquearla: `/blocked <razón>` (solo el assignee actual).
5. Para desbloquearla: `/unblocked` (solo el assignee actual).
6. **Nadie puede desasignar a otro.** Hard lock enforced por Actions. Solo el
   assignee actual o el PO activo pueden modificar `assignees`.
7. **Una issue = una persona.** Si en el workflow se escapan >1, el bot deja
   solo al primero.
8. El PO activo está en `.github/ROTA.yml`. Cambia solo vía PR al archivo.
9. Una PR mergeada que cierra una issue con `status:claimed` la pasa a
   `status:done` automáticamente. El label no se quita.
10. `master` es la rama principal y tiene branch protection: **CI obligatorio
    (`build-and-test`) + 1 approval + sin push directo (ni para admins)**. Todo
    cambio pasa por PR.

---

## 🏷️ Vocabulario de labels

### Status (`status:*`)
- `status:needs-triage` — sin asignar, esperando triage o `/claim`
- `status:claimed` — asignada via `/claim`, **lock activo**
- `status:blocked` — asignada pero bloqueada por algo externo (`/blocked <razón>`)
- `status:done` — cerrada via PR mergeada; **sello histórico, no se quita**

### Tipo (`type:*`)
- `type:feature` — funcionalidad nueva
- `type:refactor` — refactor sin cambio funcional
- `type:chore` — mantenimiento, deps, housekeeping
- `bug` — algo no funciona
- `enhancement` — mejora a algo existente

### Prioridad (`priority:*`)
- `priority:p0` — bloquea release
- `priority:p1` — sprint actual
- `priority:p2` — backlog

### Área (`area:*`)
- `area:auth` — `src/modules/auth/`
- `area:users` — `src/modules/users/`
- `area:property` — `src/modules/property/`
- `area:installation` — `src/modules/installation/`
- `area:classification` — `src/modules/classification/`
- `area:insurance-record` — `src/modules/insurance-record/`
- `area:plan-record` — `src/modules/plan-record/`
- `area:rented-record` — `src/modules/rented-record/`
- `area:writing-record` — `src/modules/writing-record/`
- `area:notification` — `src/modules/notification/`
- `area:devops` — CI/deploy

### Otros
- `triage:rotating` — esperando decisión del PO activo

---

## 🚀 Quickstart para devs nuevos en el equipo

1. **Empezá por [`.github/QUICKSTART.md`](./QUICKSTART.md)** — tiene escenarios
   paso-a-paso con diagramas, comandos `gh` y tabla para evaluadores.
2. Volvé a esta guía (CONTRIBUTING) para las reglas formales cuando ya
   entendés la idea.
3. **Buscá issues con `status:needs-triage`** para arrancar.
4. **Comentá `/claim`** en la que te interese.
5. **Leé `CLAUDE.md`** para entender la arquitectura y las reglas de seguridad
   del proyecto (guards, DTOs, `@IsOptional()`), y corré `npm run precommit`
   antes de subir cualquier cambio.
