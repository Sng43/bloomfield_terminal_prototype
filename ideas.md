# Bloomfield Terminal — Idées de Design

## Contexte
Interface de démonstration d'un terminal financier professionnel pour les marchés africains (BRVM, UEMOA). Doit refléter exactement les besoins de l'AO : données BRVM temps réel, analyses macro africaines, chat IA Langflow, interface multi-fenêtres modulaire. Cible : investisseurs institutionnels, SGI, analystes financiers.

---

<response>
<text>
**Approche 1 : Bloomberg Terminal Africain**

- **Design Movement** : Neo-brutalism financier — hommage aux terminaux Bloomberg/Reuters mais réinterprété avec une identité africaine forte
- **Core Principles** : Densité informationnelle maximale, hiérarchie visuelle stricte, efficacité opérationnelle, identité africaine assumée
- **Color Philosophy** : Fond noir profond (#0A0A0F), texte vert terminal (#00FF41), accents orange Bloomfield (#F39200), rouge/vert pour cours (hausse/baisse). Évoque la finance de précision et la nuit africaine.
- **Layout Paradigm** : Multi-panneaux fixes style Bloomberg — header ticker horizontal, sidebar gauche navigation, zone centrale divisée en 4 quadrants (cours BRVM, graphique, macro, chat IA)
- **Signature Elements** : Ticker scrollant en temps réel, grille de données monospace, prompt de chat style terminal `>_`
- **Interaction Philosophy** : Chaque interaction est une commande, pas un clic. L'utilisateur "pilote" le terminal.
- **Animation** : Clignotement curseur, mise à jour des cours avec flash vert/rouge, scroll ticker fluide
- **Typography** : JetBrains Mono (données/terminal) + Montserrat Bold (titres/labels)
</text>
<probability>0.08</probability>
</response>

<response>
<text>
**Approche 2 : Dashboard Financier Premium Dark**

- **Design Movement** : Luxury Fintech — inspiré de Refinitiv Eikon et des dashboards de hedge funds londoniens
- **Core Principles** : Sophistication sobre, lisibilité premium, données au premier plan, branding Bloomfield omniprésent
- **Color Philosophy** : Bleu marine profond (#0D1B3E → #1A2B5F), or champagne (#C9A84C) pour les KPIs clés, blanc cassé (#F5F5F0) pour le texte, rouge bordeaux pour les alertes. Palette qui inspire confiance et expertise.
- **Layout Paradigm** : Sidebar gauche fixe (navigation modules), zone principale avec grille de widgets redimensionnables, header avec ticker et profil utilisateur
- **Signature Elements** : Cartes de données avec micro-graphiques sparkline, badges de variation colorés, panel de chat IA intégré en drawer latéral
- **Interaction Philosophy** : Glisser-déposer des widgets, personnalisation du workspace, tout accessible en 2 clics
- **Animation** : Transitions de page fluides (200ms), sparklines animées au chargement, typing effect pour les réponses IA
- **Typography** : Space Grotesk (titres) + DM Mono (données numériques) + DM Sans (corps de texte)
</text>
<probability>0.07</probability>
</response>

<response>
<text>
**Approche 3 : Terminal Africain Moderne — Identité UEMOA**

- **Design Movement** : Afrofuturisme financier — interface qui assume son identité africaine tout en étant world-class
- **Core Principles** : Identité africaine forte, données BRVM en vedette, IA comme copilote visible, architecture modulaire évidente
- **Color Philosophy** : Fond très sombre bleu-nuit (#0B1426), orange vif Bloomfield (#F39200) comme couleur d'action principale, vert émeraude (#10B981) pour les hausses, rouge (#EF4444) pour les baisses, gris ardoise (#1E2A3A) pour les panneaux. Contraste fort, lisibilité maximale.
- **Layout Paradigm** : Split-screen asymétrique — 60% zone de données (tableau BRVM + graphique), 40% chat IA avec contexte des données visibles. Header avec ticker BRVM scrollant.
- **Signature Elements** : Panneau IA avec avatar "Bloomfield AI" et suggestions de questions pré-remplies, graphique de cours interactif avec annotations IA, badge "LIVE" clignotant
- **Interaction Philosophy** : L'IA est le centre de gravité — les données alimentent le chat, le chat explique les données
- **Animation** : Pulse sur les cours en temps réel, stream de tokens pour les réponses IA, graphique qui se dessine progressivement
- **Typography** : Syne (titres impactants) + IBM Plex Mono (données) + IBM Plex Sans (interface)
</text>
<probability>0.09</probability>
</response>

---

## Choix retenu : Approche 3 — Terminal Africain Moderne

Split-screen avec l'IA comme copilote central, identité Bloomfield forte, données BRVM en temps réel simulées. C'est la plus différenciante et la plus alignée avec la vision de l'AO.
