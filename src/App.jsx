/* eslint-disable react/display-name, react/prop-types, no-unused-vars */
import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";

// ── GLOBAL STYLES ─────────────────────────────────────────────────────────────
const G_STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@400;500;600&family=DM+Mono:wght@400;500&display=swap');
  *{box-sizing:border-box;margin:0;padding:0}
  body{background:#040610;color:#fff;font-family:'DM Sans',sans-serif;overflow-x:hidden}
  ::-webkit-scrollbar{width:3px}::-webkit-scrollbar-track{background:#040610}
  ::-webkit-scrollbar-thumb{background:linear-gradient(#3b82f6,#8b5cf6);border-radius:2px}
  ::selection{background:rgba(99,179,237,.22);color:#fff}
  @keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-8px)}}
  @keyframes pglow{0%,100%{opacity:.4}50%{opacity:.9}}
  @keyframes spin{to{transform:rotate(360deg)}}
  @keyframes spinR{to{transform:rotate(-360deg)}}
  @keyframes blink{0%,88%,100%{transform:scaleY(1)}93%{transform:scaleY(0.08)}}
  @keyframes typeC{0%,80%,100%{opacity:1}40%{opacity:0}}
  @keyframes orb1{0%{transform:rotate(0deg) translateX(55px) rotate(0deg)}100%{transform:rotate(360deg) translateX(55px) rotate(-360deg)}}
  @keyframes orb2{0%{transform:rotate(120deg) translateX(45px) rotate(-120deg)}100%{transform:rotate(480deg) translateX(45px) rotate(-480deg)}}
  @keyframes orb3{0%{transform:rotate(240deg) translateX(38px) rotate(-240deg)}100%{transform:rotate(600deg) translateX(38px) rotate(-600deg)}}
`;

// ── DATA ──────────────────────────────────────────────────────────────────────
const LINKS = {
  email: "mailto:mounir.bekkar@univ-lyon2.fr",
  linkedin: "https://www.linkedin.com/in/mounir-bekkar-503885263",
  github: "https://github.com/mbekkar",
  cv: "/cv.pdf",
};

const TITLES = ["Data Engineer", "BI Developer", "Data Analyst", "Python Developer", "Software Engineer"];

const STATS = [
  { l: "Projets GitHub", v: 6, plus: "+", c: "#63b3ed" },
  { l: "Technologies", v: 20, plus: "+", c: "#a78bfa" },
  { l: "Stage Pro", v: 1, plus: "", c: "#34d399" },
  { l: "Lignes de code", v: 5, plus: "k+", c: "#f472b6" },
  { l: "Années études", v: 4, plus: "+", c: "#fb923c" },
  { l: "Langues", v: 4, plus: "", c: "#60a5fa" },
];

const SKILLS = [
  { l: "Data & BI", c: "#63b3ed", items: [["SQL / PostgreSQL",88],["Tableau / Power BI",80],["OLAP / KPIs",82],["Python / Pandas",84],["R / ggplot2",72],["ETL Pipelines",78]] },
  { l: "Data Engineering", c: "#a78bfa", items: [["Python / NumPy",84],["OpenCV / CBIR",70],["Docker",65],["Git / GitHub",86],["Linux",68],["dbt (notions)",55]] },
  { l: "Web & Software", c: "#34d399", items: [["PHP / MVC",76],["Java / Android",68],["React / JSX",72],["MySQL / MariaDB",80],["Swift / iOS",60],["REST API",70]] },
];

const ACADEMIA = [
  { deg: "Master Informatique — Data Science & BI", school: "Université Lumière Lyon 2", period: "2025 — Présent", c: "#a78bfa", active: true },
  { deg: "Licence Informatique", school: "Université Lumière Lyon 2", period: "2022 — 2025", c: "#63b3ed", active: false },
  { deg: "Baccalauréat Mathématiques — Mention Bien", school: "Lycée", period: "2022", c: "#34d399", active: false },
];

const LANGS = [["🇫🇷","Français","Bilingue","#3b82f6"],["🇩🇪","Allemand","Maternelle","#a78bfa"],["🇩🇿","Arabe","Maternelle","#34d399"],["🇬🇧","Anglais","Courant","#f472b6"]];
const DOMAINS = [["🔬","Data Science","#63b3ed"],["📊","Business BI","#a78bfa"],["⚙️","Data Engineering","#34d399"],["💻","Software Dev","#f472b6"]];
const JOBS = [
  { co: "Leroy Merlin", role: "Team Member", period: "2022", c: "#34d399", i: "🏪" },
  { co: "B&M", role: "Retail Team Member", period: "2021", c: "#fb923c", i: "🛍️" },
  { co: "Keepcool", role: "Gym Assistant", period: "2020", c: "#f472b6", i: "💪" },
];
const CATS = ["All","Data","BI","AI","Mobile"];

const PROJECTS = [
  {
    id:1, title:"Python Data Cleaning", cat:"Data", c:"#63b3ed", i:"🧹",
    github:"https://github.com/mbekkar/python-data-cleaning-project",
    tags:["Data Quality","Preprocessing"], tech:["Python","Pandas","NumPy","Matplotlib"],
    desc:"Pipeline de nettoyage de données — gestion des nulls, suppression des doublons et amélioration de la qualité via méthode IQR.",
    full:{
      ctx:"Projet Data Engineering. Pipeline Python complet pour nettoyer et standardiser des jeux de données bruts, réalistes et hétérogènes (CSV multi-sources, encodages variés, valeurs aberrantes).",
      problem:"Les jeux de données réels contiennent jusqu'à 30% de données inutilisables. Sans nettoyage, les modèles d'analyse donnent des résultats biaisés.",
      objs:["Automatiser la détection et suppression des doublons","Gérer les nulls avec stratégies adaptées (médiane, mode)","Détecter les outliers via méthode IQR","Générer un rapport qualité avant/après"],
      feats:["Détection automatique des types de colonnes","Imputation intelligente par type (médiane/mode)","Rapport HTML de qualité avec métriques","Export CSV nettoyé prêt à l'analyse"],
      code:`import pandas as pd
import numpy as np

class DataCleaner:
    def __init__(self, df: pd.DataFrame):
        self.df = df.copy()
        self.report = {}

    def remove_duplicates(self) -> 'DataCleaner':
        before = len(self.df)
        self.df = self.df.drop_duplicates()
        self.report['dupes'] = before - len(self.df)
        return self

    def handle_missing(self) -> 'DataCleaner':
        for col in self.df.columns:
            pct = self.df[col].isna().mean()
            if pct > 0.5:
                self.df.drop(columns=[col], inplace=True)
            elif self.df[col].dtype in ['float64','int64']:
                self.df[col].fillna(self.df[col].median(), inplace=True)
            else:
                self.df[col].fillna(self.df[col].mode()[0], inplace=True)
        return self

    def remove_outliers_iqr(self, cols: list) -> 'DataCleaner':
        for col in cols:
            Q1, Q3 = self.df[col].quantile([0.25, 0.75])
            IQR = Q3 - Q1
            self.df = self.df[
                self.df[col].between(Q1 - 1.5*IQR, Q3 + 1.5*IQR)
            ]
        return self

    def run(self) -> pd.DataFrame:
        return (self
            .remove_duplicates()
            .handle_missing()
            .remove_outliers_iqr(['age','salary','amount'])
            .df)

# Usage
df_raw   = pd.read_csv("raw_data.csv")
df_clean = DataCleaner(df_raw).run()
print(f"Cleaned: {len(df_raw)} → {len(df_clean)} rows")`,
      lang:"Python",
      stats:[{l:"Lignes traitées",v:"50k+"},{l:"Nulls gérés",v:"~23%"},{l:"Doublons",v:"8.4%"},{l:"Qualité finale",v:"97%"}],
      results:"Pipeline réduisant les données invalides de 31% à 3% sur 50 000 lignes. Méthode IQR supprimant automatiquement les outliers. Rapport de qualité généré automatiquement.",
      difficulty:"Gestion des encodages variés (latin-1, UTF-8). Stratégie d'imputation adaptée par type de colonne pour préserver la distribution.",
      improvements:["Connexion Airflow","Support JSON/Parquet","Dashboard Streamlit"],
      pipeline:["CSV bruts","Détection types","drop_duplicates()","fillna()/IQR","Export propre"],
    },
  },
  {
    id:2, title:"Python ETL Pipeline", cat:"Data", c:"#a78bfa", i:"⚙️",
    github:"https://github.com/mbekkar/python-etl-pipeline",
    tags:["ETL","Data Engineering"], tech:["Python","Pandas","SQLAlchemy","Docker"],
    desc:"Pipeline ETL modulaire — extraction multi-sources, transformation pandas, validation qualité, chargement SQL, logs structurés.",
    full:{
      ctx:"Projet Data Engineering. Architecture modulaire Extractor→Transformer→Validator→Loader pour ingérer des données hétérogènes vers une base analytique.",
      problem:"Les données arrivent de sources multiples avec des formats différents. Un pipeline ETL robuste garantit la qualité, la traçabilité et l'automatisation du flux.",
      objs:["Concevoir une architecture ETL modulaire","Valider la qualité avant chargement","Générer des logs structurés par run","Conteneuriser avec Docker Compose"],
      feats:["Extraction depuis CSV, JSON, SQL, API REST","Contrôles qualité : nulls, ranges, valeurs autorisées","Logging structuré avec timestamp et run_id","Docker Compose : source + ETL + base cible"],
      code:`from etl_pipeline import ETLPipeline

pipeline = ETLPipeline(
    source       = "data/consultations.csv",
    target_table = "consultations_clean",
    db_url       = "sqlite:///hospital.db",

    not_null_cols = ["id", "patient_id", "date"],

    type_schema = {
        "date":    "datetime",
        "cout":    "float",
        "duree":   "int",
    },

    numeric_ranges = {
        "cout":  (0, 1000),
        "duree": (5, 300),
    },

    normalize_cols = ["service", "diagnostic"],
    if_exists      = "replace",
)

result = pipeline.run()
print(result.summary())

# ───────────────────────────────────────
# ✅ SUCCESS  —  Run: 20250115_090001
# ───────────────────────────────────────
# Extracted : 515 rows
# Dropped   : 33  (nulls + dupes)
# Validated : 470 valid | 12 rejected
# Loaded    : 470 → consultations_clean
# Duration  : 1.24s`,
      lang:"Python",
      stats:[{l:"Lignes traitées",v:"500+"},{l:"Sources",v:"3"},{l:"Rejetées",v:"~8%"},{l:"Durée run",v:"<2s"}],
      results:"Pipeline fonctionnel et reproductible. Lignes invalides isolées dans un CSV de rejet pour audit.",
      difficulty:"Encodages hétérogènes entre sources. Normalisation des formats de dates (dd/mm vs YYYY-MM-DD).",
      improvements:["Apache Airflow","Support Parquet/Delta","Monitoring Grafana"],
      pipeline:["Source CSV/SQL","Extract","Transform","Validate","Load (DB)","Logs"],
    },
  },
  {
    id:3, title:"AI Image Retrieval CBIR", cat:"AI", c:"#f472b6", i:"🤖",
    github:"https://github.com/mbekkar/ai-image-retrieval-cbir",
    tags:["Computer Vision","AI"], tech:["Python","OpenCV","scikit-learn","Flask"],
    desc:"Système CBIR utilisant des histogrammes HSV (512-dim) et descripteurs ORB (32-dim) pour retrouver les images similaires par similarité cosinus.",
    full:{
      ctx:"Projet Computer Vision. Système de recherche d'image par contenu (CBIR) sans métadonnées. Features visuelles + similarité vectorielle.",
      problem:"La recherche par mot-clé ne fonctionne pas sans tags. Le CBIR permet de retrouver des images similaires uniquement à partir du contenu visuel.",
      objs:["Extraire des features visuelles robustes","Calculer la similarité cosinus","Indexer un dataset pour recherche rapide","Déployer une interface Flask drag & drop"],
      feats:["Histogramme HSV 8×8×8 → 512 dimensions","Descripteurs ORB moyen → 32 dimensions","Vecteur 544-dim · similarité cosinus","Interface Flask avec upload et résultats visuels"],
      code:`import cv2, numpy as np
from sklearn.metrics.pairwise import cosine_similarity

def extract_features(img_path: str) -> np.ndarray:
    """
    HSV histogram (color) + ORB mean (texture)
    → 544-dimensional feature vector
    """
    img = cv2.imread(img_path)

    # Couleur — histogramme HSV normalisé (512-dim)
    hsv  = cv2.cvtColor(img, cv2.COLOR_BGR2HSV)
    hist = cv2.calcHist([hsv],[0,1,2],None,
                        [8,8,8],[0,180,0,256,0,256])
    hist = cv2.normalize(hist, hist).flatten()

    # Texture — ORB descriptors mean (32-dim)
    orb      = cv2.ORB_create(nfeatures=100)
    _, des   = orb.detectAndCompute(img, None)
    orb_vec  = des.mean(axis=0) if des is not None else np.zeros(32)

    return np.concatenate([hist, orb_vec])  # 544-dim

def find_similar(query: str, index: dict, k=5):
    q      = extract_features(query).reshape(1,-1)
    paths  = list(index.keys())
    feats  = np.array(list(index.values()))
    scores = cosine_similarity(q, feats)[0]
    top    = np.argsort(scores)[::-1][:k]
    return [(paths[i], round(float(scores[i]),4)) for i in top]

# Results:
# #1  ./red/red_002.jpg   0.9821  ████████████████████
# #2  ./red/red_003.jpg   0.9745  ███████████████████
# #3  ./red/red_005.jpg   0.8123  ████████████████`,
      lang:"Python",
      stats:[{l:"Dim vecteur",v:"544"},{l:"Précision@5",v:"84%"},{l:"Temps index",v:"<1s"},{l:"Interface",v:"Flask"}],
      results:"84% de Précision@5 sur dataset synthétique. Recherche en moins d'une seconde sur 500 images. Interface Flask fonctionnelle.",
      difficulty:"Sensibilité ORB aux variations d'éclairage. Compromis précision/vitesse sur grands datasets.",
      improvements:["Features CNN ResNet-50","FAISS pour ANN","Millions d'images"],
      pipeline:["Image requête","HSV Hist 512d","ORB desc 32d","Concat 544d","Cosine sim","Top-K résultats"],
    },
  },
  {
    id:4, title:"R Health Data Analysis", cat:"Data", c:"#34d399", i:"📈",
    github:"https://github.com/mbekkar/r-health-data-analysis",
    tags:["Data Analysis","Visualization"], tech:["R","ggplot2","dplyr","corrplot","tidyr"],
    desc:"Analyse exploratoire d'un dataset santé — nettoyage tidyverse, boxplots ggplot2, matrice de corrélation et rapport Rmarkdown.",
    full:{
      ctx:"Projet Analyse de Données. Exploration complète d'un dataset santé multi-variables avec le tidyverse R. Production d'un rapport Rmarkdown complet.",
      problem:"Les données médicales nécessitent une EDA rigoureuse pour identifier distributions, outliers et corrélations entre variables cliniques.",
      objs:["Explorer et nettoyer un dataset 2000+ patients","Identifier distributions et valeurs manquantes","Produire des visualisations ggplot2","Analyser les corrélations cliniques"],
      feats:["EDA complète (summary, glimpse)","Nettoyage : NA, types, outliers IQR","Variables dérivées : tranches d'âge, IMC catégories","Boxplots, scatter plots, heatmap corrélations"],
      code:`library(tidyverse)
library(corrplot)

# Chargement et transformation
df <- read_csv("health_data.csv") %>%
  filter(!is.na(age), !is.na(imc), age > 0, imc > 10) %>%
  mutate(
    tranche_age = cut(age,
      breaks = c(0, 18, 35, 55, 75, Inf),
      labels = c("<18","18-35","35-55","55-75","75+")),
    cat_imc = case_when(
      imc < 18.5 ~ "Sous-poids",
      imc < 25   ~ "Normal",
      imc < 30   ~ "Surpoids",
      TRUE       ~ "Obésité"
    )
  )

# Boxplot IMC par tranche d'âge
ggplot(df, aes(x = tranche_age, y = imc, fill = tranche_age)) +
  geom_boxplot(alpha = 0.7, outlier.colour = "red") +
  geom_jitter(width = 0.15, alpha = 0.12) +
  scale_fill_brewer(palette = "Blues") +
  labs(title = "Distribution IMC par âge") +
  theme_minimal(base_size = 13)

# Corrélations
df %>%
  select(age, imc, tension, cholesterol, glycemie) %>%
  cor(use = "complete.obs") %>%
  corrplot(method = "color", type = "upper",
           addCoef.col = "black")`,
      lang:"R",
      stats:[{l:"Patients",v:"2 000+"},{l:"Variables",v:"12"},{l:"Visuels",v:"8"},{l:"Rapport Rmd",v:"✓"}],
      results:"Corrélation IMC/cholestérol r=0.61. Distribution IMC asymétrique sur 35-55 ans. Rapport Rmarkdown complet avec interprétations.",
      difficulty:"Valeurs manquantes variables (5% à 22%). Choix de transformation pour conserver la distribution.",
      improvements:["Modèles tidymodels","Application Shiny","Bootstrap CI"],
      pipeline:["CSV brut","read_csv()","dplyr filter+mutate","ggplot2","corrplot","Rapport Rmd"],
    },
  },
  {
    id:5, title:"OLAP Hospital Dashboard", cat:"BI", c:"#fb923c", i:"📊",
    github:"https://github.com/mbekkar/olap-hopital-dashboard",
    tags:["Business Intelligence","OLAP"], tech:["Tableau","SQL","Excel","OLAP"],
    desc:"Entrepôt hospitalier schéma en étoile, 10 000 consultations, analyses OLAP Roll-up/Drill-down et dashboard Tableau interactif.",
    full:{
      ctx:"Projet universitaire Groupe 5 — Master Lyon 2. Construction d'un entrepôt de données hospitalier depuis CSV réels. Modélisation dimensionnelle + requêtes OLAP + 14 feuilles Tableau.",
      problem:"L'hôpital a des données dispersées dans plusieurs CSV. Sans entrepôt centralisé, impossible d'analyser tendances, coûts et saturation des services.",
      objs:["Concevoir schéma en étoile (FAIT + 4 dimensions)","Implémenter Roll-up, Drill-down, Slice OLAP","Produire 14 feuilles Tableau + 1 dashboard","Identifier KPIs de pilotage médical"],
      feats:["10 000 consultations · 1 000 patients · 100 médecins","4 dimensions : Patient, Docteur, Service, Temps","GROUP BY ROLLUP pour analyses hiérarchiques","Drill-down Année → Trimestre → Mois par service"],
      code:`-- Analyse OLAP : Roll-up par service et trimestre
SELECT
    s.Type_Service,
    s.Nom_Service,
    t.Trimestre,
    t.Mois,
    COUNT(f.ID_Consultation)   AS Nb_Consultations,
    ROUND(AVG(f.Cout), 2)      AS Cout_Moyen,
    ROUND(AVG(f.Duree_Min), 1) AS Duree_Moy,
    SUM(f.Cout)                AS CA_Total
FROM FAIT_CONSULTATION  f
JOIN DIM_SERVICE        s ON f.ID_Service = s.ID_Service
JOIN DIM_TEMPS          t ON f.ID_Temps   = t.ID_Temps
GROUP BY ROLLUP(
    s.Type_Service,
    s.Nom_Service,
    t.Trimestre,
    t.Mois
)
HAVING COUNT(*) > 0
ORDER BY s.Type_Service, t.Trimestre;

-- Résultats (extrait) :
-- Urgences   | T1 | Jan | 312 consult. | 198€ moy
-- Urgences   | T1 | Fév | 298 consult. | 204€ moy
-- Cardiologie| T1 | Jan | 248 consult. | 315€ moy`,
      lang:"SQL",
      stats:[{l:"Consultations",v:"10 000"},{l:"Patients",v:"1 000"},{l:"Services",v:"10"},{l:"Feuilles Tableau",v:"14"}],
      results:"Dashboard Tableau couvrant 10 services et 12 mois. Urgences = service le plus saturé (1 200 consult.). Coût moyen : 215€. Drill-down interactif opérationnel.",
      difficulty:"Jointure CSV hétérogènes (latin-1). Définition cohérente des hiérarchies OLAP temporelles.",
      improvements:["SQL live Tableau","Dimension géographique","Alertes KPI automatiques"],
      pipeline:["CSV Sources","Nettoyage Excel","Schéma étoile","Jointures SQL","Tableau Workbook","Dashboard"],
    },
  },
  {
    id:6, title:"BeGreen Web App", cat:"Mobile", c:"#10b981", i:"🌿",
    github:"https://github.com/mbekkar/begreen-java-app",
    tags:["PHP","Gamification"], tech:["PHP","MySQL","CSS","Sessions"],
    desc:"Application web PHP gamifiée pour éco-gestes — inscription bcrypt, CSRF, défis par ville, classement amis et système de points.",
    full:{
      ctx:"Projet universitaire en équipe. Application web PHP pour encourager les comportements écoresponsables via gamification : défis quotidiens, points, classement entre amis.",
      problem:"Encourager les comportements écologiques est difficile sans motivation externe. La gamification augmente l'engagement sur le long terme.",
      objs:["Système d'inscription/connexion sécurisé","Défis écologiques filtrés par ville","Système de points et classement","Interface propre et responsive"],
      feats:["Auth bcrypt + protection CSRF complète","Défis personnalisés selon la ville","Classement dynamique entre amis acceptés","Gestion amis : demande / acceptation / refus"],
      code:`<?php
// Traitement sécurisé des défis cochés
// Fix critique : SQL injection via implode() → intval()

if (isset($_POST['valider'])) {

    // 1. Vérification CSRF
    if (!hash_equals($_SESSION['csrf_token'],
                     $_POST['csrf_token'] ?? '')) {
        die('Erreur de sécurité.');
    }

    // 2. Nettoyage IDs (protection SQL injection)
    $defis_coches = [];
    foreach ($_POST['defi_id'] ?? [] as $id) {
        $defis_coches[] = (int) $id; // intval() ← sécurisé
    }

    // 3. Mise à jour sécurisée
    if (!empty($defis_coches)) {
        $ids = implode(',', $defis_coches); // ints purs
        $db->prepare("
            UPDATE realisation
            SET etat = CASE WHEN id_defi IN ($ids) THEN 1 ELSE 0 END
            WHERE id_utilisateur = :uid
        ")->execute([':uid' => $uid]);
    }

    // 4. Recalcul des points
    $db->prepare("
        UPDATE utilisateur SET points = (
            SELECT COALESCE(SUM(d.points), 0)
            FROM defis d JOIN realisation r ON r.id_defi = d.id_defi
            WHERE r.id_utilisateur = :uid AND r.etat = 1
        ) WHERE id_utilisateur = :uid2
    ")->execute([':uid'=>$uid,':uid2'=>$uid]);

    header('Location: accueil.php'); exit;
}`,
      lang:"PHP",
      stats:[{l:"Pages PHP",v:"7"},{l:"Tables SQL",v:"4"},{l:"Sécurité",v:"CSRF+bcrypt"},{l:"Villes",v:"4"}],
      results:"Application fonctionnelle avec inscription, connexion, défis par ville, classement amis. Vulnérabilités SQL injection et CSRF corrigées.",
      difficulty:"SQL injection dans UPDATE via implode() non sécurisé — corrigée avec intval(). Déconnexion GET→POST.",
      improvements:["Version Android native","Notifications push","API REST mobile"],
      pipeline:["index.php","connexion.php","accueil.php","amis.php","classement.php","profil.php"],
    },
  },
];

// ── ICONS ─────────────────────────────────────────────────────────────────────
const GithubIcon = ({ size=16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/>
  </svg>
);

// ── PRIMITIVES ────────────────────────────────────────────────────────────────
const Glass = ({ children, style={}, c }) => (
  <div style={{ background:"rgba(8,12,26,.7)", border:`1px solid ${c?c+"22":"rgba(255,255,255,.1)"}`, borderRadius:16, backdropFilter:"blur(12px)", boxShadow: c?`0 0 32px ${c}14,0 8px 32px rgba(0,0,0,.3)`:"0 4px 24px rgba(0,0,0,.2)", ...style }}>
    {children}
  </div>
);
const Tag = ({ t, c }) => (
  <span style={{ fontFamily:"monospace", fontSize:10, padding:"2px 7px", borderRadius:999, background:`${c}18`, color:c, border:`1px solid ${c}35` }}>{t}</span>
);
const SectionLabel = ({ text }) => (
  <div style={{ display:"inline-flex", alignItems:"center", gap:6, padding:"4px 14px", borderRadius:999, border:"1px solid rgba(99,179,237,.3)", background:"rgba(99,179,237,.05)", color:"#63b3ed", fontFamily:"monospace", fontSize:11, marginBottom:14 }}>
    <span style={{ width:5, height:5, borderRadius:"50%", background:"#63b3ed", display:"inline-block", animation:"pglow 1.5s infinite" }}/>
    {text}
  </div>
);
const Fade = ({ children, delay=0, y=22, x=0 }) => {
  const ref=useRef(); const v=useInView(ref,{once:true,margin:"-50px"});
  return <motion.div ref={ref} initial={{opacity:0,y,x}} animate={v?{opacity:1,y:0,x:0}:{}} transition={{duration:.65,delay,ease:[.22,1,.36,1]}}>{children}</motion.div>;
};
const SkillBar = ({ name, level, c }) => {
  const ref=useRef(); const v=useInView(ref,{once:true});
  return (
    <div ref={ref} style={{marginBottom:12}}>
      <div style={{display:"flex",justifyContent:"space-between",fontSize:12,marginBottom:4,color:"#cbd5e1"}}>
        <span>{name}</span><span style={{color:c,fontFamily:"monospace"}}>{level}%</span>
      </div>
      <div style={{height:5,borderRadius:99,background:"rgba(255,255,255,.05)",overflow:"hidden"}}>
        <motion.div style={{height:"100%",borderRadius:99,background:`linear-gradient(90deg,${c}88,${c})`}} initial={{width:0}} animate={v?{width:`${level}%`}:{}} transition={{duration:1.4,ease:[.22,1,.36,1]}}/>
      </div>
    </div>
  );
};
const Avatar = () => (
  <motion.div animate={{y:[0,-6,0]}} transition={{duration:4,repeat:Infinity,ease:"easeInOut"}}>
    <svg width="108" height="124" viewBox="0 0 110 128" fill="none">
      <ellipse cx="55" cy="118" rx="35" ry="6" fill="rgba(99,179,237,.13)"/>
      <path d="M21 76 Q15 70 13 96 Q12 114 18 119 Q35 123 55 123 Q75 123 92 119 Q98 114 97 96 Q95 70 89 76 L81 68 Q69 79 55 79 Q41 79 29 68 Z" fill="#162038"/>
      <rect x="39" y="81" width="32" height="10" rx="3" fill="rgba(99,179,237,.13)" stroke="#63b3ed" strokeWidth=".6"/>
      <text x="55" y="89" textAnchor="middle" fill="#63b3ed" fontSize="5" fontFamily="monospace" fontWeight="700">DATA ENG</text>
      <rect x="46" y="58" width="18" height="16" rx="5" fill="#d6a97a"/>
      <ellipse cx="55" cy="42" rx="25" ry="27" fill="#e0b48a"/>
      <ellipse cx="30" cy="44" rx="4.5" ry="5.5" fill="#c9955c"/><ellipse cx="80" cy="44" rx="4.5" ry="5.5" fill="#c9955c"/>
      <ellipse cx="44" cy="41" rx="5" ry="5" fill="white"/><ellipse cx="66" cy="41" rx="5" ry="5" fill="white"/>
      <motion.g animate={{scaleY:[1,1,1,.08,1,1]}} transition={{duration:4,repeat:Infinity,times:[0,.38,.46,.5,.54,1]}}>
        <ellipse cx="44" cy="41" rx="3" ry="3" fill="#1a1a2e"/><ellipse cx="66" cy="41" rx="3" ry="3" fill="#1a1a2e"/>
        <ellipse cx="45" cy="39.8" rx="1" ry="1" fill="white"/><ellipse cx="67" cy="39.8" rx="1" ry="1" fill="white"/>
      </motion.g>
      <path d="M39 33 Q44 31 49 33" stroke="#2d1b0e" strokeWidth="1.8" strokeLinecap="round" fill="none"/>
      <path d="M61 33 Q66 31 71 33" stroke="#2d1b0e" strokeWidth="1.8" strokeLinecap="round" fill="none"/>
      <path d="M48 57 Q55 61 62 57" stroke="#c0956e" strokeWidth="1.5" strokeLinecap="round" fill="none"/>
      <path d="M30 35 Q30 11 55 10 Q80 11 80 35" stroke="#243250" strokeWidth="5" strokeLinecap="round" fill="none"/>
      <rect x="25" y="33" width="10" height="14" rx="4" fill="#1e3a5f" stroke="#63b3ed" strokeWidth=".9"/>
      <rect x="75" y="33" width="10" height="14" rx="4" fill="#1e3a5f" stroke="#63b3ed" strokeWidth=".9"/>
      <path d="M21 76 Q10 87 13 102 Q17 107 22 102 Q22 88 29 80Z" fill="#162038"/>
      <path d="M89 76 Q100 87 97 102 Q93 107 88 102 Q88 88 81 80Z" fill="#162038"/>
      <ellipse cx="17" cy="105" rx="6" ry="5" fill="#d6a97a"/><ellipse cx="93" cy="105" rx="6" ry="5" fill="#d6a97a"/>
    </svg>
  </motion.div>
);

// ── SVG PROJECT PREVIEWS ──────────────────────────────────────────────────────
const Preview = ({ p }) => {
  const c=p.c;
  const rows = {
    1:[["raw_df.shape","50 428 rows × 14 cols",35],["nulls_pct","23.4%  →  0.2%",50],["duplicates","4 231  →  0 removed",65],["outliers_iqr","1 847 rows flagged",80],["quality_score","97.8% ✓",95]],
  };
  if(p.id===1) return (
    <svg viewBox="0 0 340 165" style={{width:"100%",height:"100%"}}>
      <rect width="340" height="165" fill="#060b18"/>
      <text x="12" y="20" fill={`${c}88`} fontSize="9" fontFamily="monospace">data_cleaner.py — output</text>
      {rows[1].map(([k,v,y])=><g key={k}><text x="12" y={y} fill="#475569" fontSize="8" fontFamily="monospace">{k}</text><text x="130" y={y} fill={k==="quality_score"?"#34d399":c} fontSize="8" fontFamily="monospace">{v}</text></g>)}
      <rect x="12" y="108" width="315" height="4" rx="2" fill="rgba(255,255,255,.05)"/>
      <rect x="12" y="108" width="308" height="4" rx="2" fill={`${c}88`}/>
      <text x="12" y="130" fill="#64748b" fontSize="8" fontFamily="monospace">Progress: 97.8% cleaned  ·  50k rows processed</text>
      <text x="12" y="148" fill="#64748b" fontSize="7.5" fontFamily="monospace">pandas · numpy · matplotlib · python 3.11</text>
    </svg>
  );
  if(p.id===2) return (
    <svg viewBox="0 0 340 165" style={{width:"100%",height:"100%"}}>
      <rect width="340" height="165" fill="#060b18"/>
      {[["Extract",8,c],["Transform",76,"#a78bfa"],["Validate",144,"#34d399"],["Load",212,"#fb923c"],["Logs",280,"#f472b6"]].map(([l,x,col])=>(
        <g key={l}>
          <rect x={x} y="18" width="56" height="26" rx="5" fill={`${col}18`} stroke={col} strokeWidth="1"/>
          <text x={x+28} y="35" textAnchor="middle" fill={col} fontSize="8.5" fontFamily="monospace" fontWeight="700">{l}</text>
          {x<280&&<path d={`M${x+56} 31 L${x+70} 31`} stroke="#334155" strokeWidth="1.5"/>}
        </g>
      ))}
      {[["[EXTRACT]","515 rows from consultations.csv",70,"#63b3ed"],["[TRANSFORM]","33 rows dropped (nulls+dupes)",84,"#fb923c"],["[VALIDATE]","✓ 470 valid  |  ✗ 12 rejected",98,"#34d399"],["[LOAD]","470 rows → consultations_clean ✓",112,c],["[SUCCESS]","Run time: 1.24s",126,"#a78bfa"]].map(([tag,msg,y,col])=>(
        <g key={tag}><text x="12" y={y} fill={col} fontSize="7.5" fontFamily="monospace" fontWeight="700">{tag}</text><text x="82" y={y} fill="#64748b" fontSize="7.5" fontFamily="monospace">{msg}</text></g>
      ))}
      <rect x="10" y="140" width="315" height="3" rx="1" fill="rgba(255,255,255,.04)"/>
      <rect x="10" y="140" width="280" height="3" rx="1" fill={`${c}88`}/>
      <text x="12" y="156" fill="#64748b" fontSize="7.5" fontFamily="monospace">SQLAlchemy · Docker · pandas · python 3.11</text>
    </svg>
  );
  if(p.id===3) return (
    <svg viewBox="0 0 340 165" style={{width:"100%",height:"100%"}}>
      <rect width="340" height="165" fill="#060b18"/>
      <rect x="10" y="10" width="70" height="70" rx="6" fill={`${c}15`} stroke={c} strokeWidth="1"/>
      <text x="45" y="52" textAnchor="middle" fill={c} fontSize="20">🖼️</text>
      <text x="45" y="68" textAnchor="middle" fill="#64748b" fontSize="8" fontFamily="monospace">query</text>
      <text x="88" y="38" fill="#94a3b8" fontSize="8" fontFamily="monospace">HSV 512d</text>
      <text x="88" y="50" fill="#64748b" fontSize="7" fontFamily="monospace">+ ORB 32d</text>
      <text x="88" y="62" fill="#94a3b8" fontSize="8" fontFamily="monospace">= 544-dim</text>
      <path d="M84 45 L86 45" stroke="#334155" strokeWidth="1"/>
      <text x="155" y="38" fill="#34d399" fontSize="8" fontFamily="monospace">Cosine</text>
      <text x="155" y="50" fill="#64748b" fontSize="7" fontFamily="monospace">similarity</text>
      <path d="M150 45 L153 45" stroke="#334155" strokeWidth="1"/>
      {[0,1,2,3,4].map(i=>(
        <g key={i}>
          <rect x="220" y={8+i*17} width="110" height="13" rx="3" fill={i===0?`${c}22`:"rgba(255,255,255,.03)"} stroke={i===0?c:"rgba(255,255,255,.06)"} strokeWidth="1"/>
          <text x="225" y={18+i*17} fill={i===0?c:"#475569"} fontSize="7" fontFamily="monospace">#{i+1} score: {(0.97-i*.08).toFixed(2)}  {i===0?"★":""}</text>
        </g>
      ))}
      <text x="10" y="100" fill="#64748b" fontSize="8" fontFamily="monospace">Precision@5: 84%  ·  Index: 500 images</text>
      <text x="10" y="115" fill={c} fontSize="8" fontFamily="monospace">$ python search.py search --query img.jpg --top 5</text>
      <text x="10" y="132" fill="#64748b" fontSize="7.5" fontFamily="monospace">opencv · scikit-learn · flask · python 3.11</text>
    </svg>
  );
  if(p.id===4) return (
    <svg viewBox="0 0 340 165" style={{width:"100%",height:"100%"}}>
      <rect width="340" height="165" fill="#060b18"/>
      <text x="12" y="18" fill="#64748b" fontSize="9" fontFamily="monospace">IMC distribution par tranche d'âge (ggplot2)</text>
      {[["<18",22,58],["18-35",54,72],["35-55",88,78],["55-75",72,66],["75+",45,50]].map(([label,h,med],i)=>{
        const x=25+i*56,bw=38;
        return(
          <g key={label}>
            <rect x={x} y={132-h} width={bw} height={h} rx="3" fill={`${c}22`} stroke={c} strokeWidth="1"/>
            <line x1={x+bw/2-10} y1={132-med} x2={x+bw/2+10} y2={132-med} stroke="#f472b6" strokeWidth="2"/>
            <text x={x+bw/2} y="148" textAnchor="middle" fill="#64748b" fontSize="7" fontFamily="monospace">{label}</text>
          </g>
        );
      })}
      <line x1="18" y1="10" x2="18" y2="133" stroke="rgba(255,255,255,.08)" strokeWidth="1"/>
      <line x1="18" y1="133" x2="320" y2="133" stroke="rgba(255,255,255,.08)" strokeWidth="1"/>
      <text x="10" y="157" fill="#64748b" fontSize="7.5" fontFamily="monospace">R · ggplot2 · tidyverse · corrplot · 2 000 patients</text>
    </svg>
  );
  if(p.id===5) return (
    <svg viewBox="0 0 340 165" style={{width:"100%",height:"100%"}}>
      <rect width="340" height="165" fill="#060b18"/>
      <text x="12" y="18" fill="#64748b" fontSize="9" fontFamily="monospace">KPI Dashboard — Consultations par service 2024</text>
      {[["Urgences",1200,c],["Cardiologie",980,"#a78bfa"],["Pédiatrie",850,"#34d399"],["Chirurgie",720,"#f472b6"],["Neurologie",600,"#60a5fa"],["Dermato",480,"#fb923c"]].map(([s,n,col],i)=>{
        const w=(n/1200)*190;
        return(
          <g key={s}>
            <text x="10" y={38+i*18} fill="#64748b" fontSize="8" fontFamily="monospace">{s}</text>
            <rect x="100" y={26+i*18} width={w} height="11" rx="2" fill={`${col}44`} stroke={col} strokeWidth=".5"/>
            <text x={104+w} y={36+i*18} fill={col} fontSize="8" fontFamily="monospace"> {n}</text>
          </g>
        );
      })}
      <text x="10" y="155" fill="#64748b" fontSize="7.5" fontFamily="monospace">SQL ROLLUP · Tableau · 10 000 consultations · Coût moy: 215€</text>
    </svg>
  );
  return (
    <svg viewBox="0 0 340 165" style={{width:"100%",height:"100%"}}>
      <rect width="340" height="165" fill="#060b18"/>
      <text x="12" y="18" fill="#64748b" fontSize="9" fontFamily="monospace">Classement Éco — Semaine 21</text>
      {[["🥇 Mounir B.",520,true],["🥈 Sofiane T.",480,false],["🥉 Alice M.",350,false],["   Karim L.",290,false]].map(([name,pts,me],i)=>(
        <g key={name}>
          <rect x="10" y={28+i*28} width="315" height="22" rx="4" fill={me?`${c}18`:"rgba(255,255,255,.03)"} stroke={me?c:"rgba(255,255,255,.05)"} strokeWidth="1"/>
          <text x="20" y={43+i*28} fill={me?"#fff":"#94a3b8"} fontSize="9" fontFamily="monospace" fontWeight={me?"700":"400"}>{name}</text>
          <rect x="160" y={32+i*28} width={(pts/520)*120} height="12" rx="2" fill={`${c}44`}/>
          <text x="290" y={43+i*28} fill={c} fontSize="9" fontFamily="monospace" fontWeight="700">{pts} pts</text>
        </g>
      ))}
      <text x="10" y="152" fill="#64748b" fontSize="7.5" fontFamily="monospace">PHP · MySQL · PDO · bcrypt · CSRF · Sessions</text>
    </svg>
  );
};

// ── CODE HIGHLIGHTER ──────────────────────────────────────────────────────────
const KWS = {
  Python:["import","from","def","class","return","if","else","elif","for","in","while","with","as","and","or","not","True","False","None","self"],
  R:["library","function","return","if","else","for","ggplot","aes","mutate","filter","select","TRUE","FALSE","NULL"],
  SQL:["SELECT","FROM","JOIN","WHERE","GROUP","ORDER","BY","ON","AS","WITH","ROUND","AVG","COUNT","SUM","ROLLUP","HAVING","CASE","WHEN","THEN","END","UPDATE","SET"],
  PHP:["function","class","public","private","return","if","else","while","foreach","new","true","false","null","echo","isset","empty","die","header"],
};
const esc=s=>s.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;");
function hlCode(code,lang){
  const kws=KWS[lang]||[];
  return code.split("\n").map(line=>{
    const cm={Python:"#",R:"#",SQL:"--",PHP:"//"}[lang];
    if(cm&&line.trimStart().startsWith(cm))return`<span style="color:#64748b;font-style:italic">${esc(line)}</span>`;
    if(lang==="PHP"&&line.trimStart().startsWith("//"))return`<span style="color:#64748b;font-style:italic">${esc(line)}</span>`;
    let out="",i=0;
    while(i<line.length){
      if(line[i]==='"'||line[i]==="'"){let q=line[i],end=i+1;while(end<line.length&&line[end]!==q)end++;out+=`<span style="color:#a3e635">${esc(line.slice(i,end+1))}</span>`;i=end+1;continue;}
      const wm=line.slice(i).match(/^[A-Za-z_]\w*/);
      if(wm){const w=wm[0];out+=kws.includes(w)?`<span style="color:#63b3ed;font-weight:600">${w}</span>`:/^[A-Z_]{2,}$/.test(w)?`<span style="color:#a78bfa">${w}</span>`:w;i+=w.length;continue;}
      const nm=line.slice(i).match(/^\d+\.?\d*/);
      if(nm){out+=`<span style="color:#fb923c">${nm[0]}</span>`;i+=nm[0].length;continue;}
      out+=esc(line[i]);i++;
    }
    return out;
  }).join("\n");
}

// ── STAT COUNTER ──────────────────────────────────────────────────────────────
const StatCard=({s})=>{
  const ref=useRef(),v=useInView(ref,{once:true});
  const[n,setN]=useState(0);
  useEffect(()=>{if(!v)return;let c=0;const step=()=>{c=Math.min(c+Math.ceil(s.v/48),s.v);setN(c);if(c<s.v)setTimeout(step,18)};step();},[v]);
  return(
    <motion.div ref={ref} whileHover={{y:-4,scale:1.04}}>
      <Glass c={s.c} style={{padding:14,textAlign:"center"}}>
        <div style={{fontFamily:"'Syne',sans-serif",fontSize:"1.75rem",fontWeight:800,color:s.c,marginBottom:3}}>{n}{s.plus}</div>
        <div style={{fontSize:10,color:"#64748b"}}>{s.l}</div>
      </Glass>
    </motion.div>
  );
};

// ── PROJECT CARD ──────────────────────────────────────────────────────────────
const ProjectCard=({p,onClick})=>(
  <motion.div layout initial={{opacity:0,scale:.93}} animate={{opacity:1,scale:1}} exit={{opacity:0,scale:.93}} transition={{duration:.3}}
    whileHover={{y:-8,scale:1.015}} onClick={()=>onClick(p)}
    style={{cursor:"pointer",borderRadius:20,overflow:"hidden",background:"rgba(8,12,26,.88)",border:`1px solid ${p.c}22`,position:"relative",display:"flex",flexDirection:"column"}}
    onMouseEnter={e=>e.currentTarget.style.boxShadow=`0 12px 40px ${p.c}22`}
    onMouseLeave={e=>e.currentTarget.style.boxShadow="none"}>
    <div style={{position:"absolute",inset:0,background:`linear-gradient(135deg,${p.c}08,transparent 65%)`,pointerEvents:"none",borderRadius:20}}/>
    {/* Preview */}
    <div style={{height:165,overflow:"hidden",borderBottom:`1px solid ${p.c}18`,position:"relative",flexShrink:0}}>
      <Preview p={p}/>
      <div style={{position:"absolute",top:9,left:9,padding:"3px 9px",borderRadius:999,background:`${p.c}22`,border:`1px solid ${p.c}50`,color:p.c,fontFamily:"monospace",fontSize:9,fontWeight:700}}>{p.cat}</div>
      <a href={p.github} target="_blank" rel="noreferrer" onClick={e=>e.stopPropagation()}
        style={{position:"absolute",top:9,right:9,width:28,height:28,borderRadius:7,background:"rgba(0,0,0,.65)",border:"1px solid rgba(255,255,255,.1)",display:"flex",alignItems:"center",justifyContent:"center",color:"#94a3b8",textDecoration:"none",transition:"all .2s"}}
        onMouseEnter={e=>{e.currentTarget.style.color="#fff";e.currentTarget.style.borderColor="rgba(255,255,255,.3)";}}
        onMouseLeave={e=>{e.currentTarget.style.color="#94a3b8";e.currentTarget.style.borderColor="rgba(255,255,255,.1)";}}>
        <GithubIcon size={13}/>
      </a>
    </div>
    {/* Body */}
    <div style={{padding:"1rem 1.1rem 1.1rem",flex:1,display:"flex",flexDirection:"column"}}>
      <div style={{display:"flex",alignItems:"center",gap:9,marginBottom:7}}>
        <span style={{fontSize:18}}>{p.i}</span>
        <h3 style={{fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:"1rem",color:"#fff",lineHeight:1.25}}>{p.title}</h3>
      </div>
      <p style={{color:"#64748b",fontSize:11.5,lineHeight:1.6,marginBottom:9,flex:1}}>{p.desc}</p>
      <div style={{display:"flex",flexWrap:"wrap",gap:4,marginBottom:8}}>
        {p.tags.map(t=><Tag key={t} t={t} c={p.c}/>)}
      </div>
      <div style={{display:"flex",flexWrap:"wrap",gap:3,marginBottom:11}}>
        {p.tech.map(t=>(
          <span key={t} style={{fontFamily:"monospace",fontSize:10,padding:"2px 6px",borderRadius:5,background:"rgba(255,255,255,.05)",color:"#64748b",border:"1px solid rgba(255,255,255,.07)"}}>{t}</span>
        ))}
      </div>
      <div style={{display:"flex",gap:6}}>
        <button onClick={e=>{e.stopPropagation();onClick(p);}}
          style={{flex:1,padding:"7px 0",borderRadius:8,background:`linear-gradient(90deg,${p.c}cc,${p.c}88)`,border:"none",color:"#fff",fontSize:11,fontWeight:700,cursor:"pointer",fontFamily:"monospace"}}
          onMouseEnter={e=>e.currentTarget.style.opacity=".85"} onMouseLeave={e=>e.currentTarget.style.opacity="1"}>
          View Details →
        </button>
        <a href={p.github} target="_blank" rel="noreferrer" onClick={e=>e.stopPropagation()}
          style={{display:"inline-flex",alignItems:"center",gap:5,padding:"7px 10px",borderRadius:8,background:"rgba(255,255,255,.05)",border:"1px solid rgba(255,255,255,.1)",color:"#94a3b8",fontSize:11,fontFamily:"monospace",textDecoration:"none",transition:"all .2s"}}
          onMouseEnter={e=>{e.currentTarget.style.color="#fff";e.currentTarget.style.background="rgba(255,255,255,.1)";}}
          onMouseLeave={e=>{e.currentTarget.style.color="#94a3b8";e.currentTarget.style.background="rgba(255,255,255,.05)";}}>
          <GithubIcon size={13}/> Code
        </a>
      </div>
    </div>
  </motion.div>
);

// ── PROJECT MODAL ─────────────────────────────────────────────────────────────
const ProjectModal=({p,onClose})=>{
  const[tab,setTab]=useState("overview");
  useEffect(()=>{document.body.style.overflow="hidden";return()=>{document.body.style.overflow="";};},[]);
  const tabs=[["overview","👁 Overview"],["code","⌨ Code"],["results","📊 Résultats"]];
  return(
    <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} onClick={e=>e.target===e.currentTarget&&onClose()}
      style={{position:"fixed",inset:0,zIndex:500,background:"rgba(2,4,12,.97)",backdropFilter:"blur(28px)",display:"flex",alignItems:"flex-start",justifyContent:"center",overflowY:"auto",padding:"1.5rem"}}>
      <motion.div initial={{y:40,scale:.97}} animate={{y:0,scale:1}} exit={{y:20,opacity:0}} transition={{duration:.45,ease:[.22,1,.36,1]}}
        style={{width:"100%",maxWidth:720,borderRadius:24,background:"rgba(6,9,20,.99)",border:"1px solid rgba(255,255,255,.08)",boxShadow:`0 0 80px ${p.c}18,0 32px 80px rgba(0,0,0,.9)`,overflow:"hidden",margin:"auto"}}>
        {/* Header */}
        <div style={{padding:"1.5rem 1.5rem 0",background:`linear-gradient(135deg,${p.c}0d,transparent 60%)`,position:"relative"}}>
          <button onClick={onClose} style={{position:"absolute",top:14,right:14,width:34,height:34,borderRadius:10,border:"1px solid rgba(255,255,255,.1)",background:"transparent",color:"#94a3b8",cursor:"pointer",fontSize:16}}>✕</button>
          <div style={{display:"flex",alignItems:"flex-start",gap:14,marginBottom:10,flexWrap:"wrap"}}>
            <div style={{width:52,height:52,borderRadius:14,display:"flex",alignItems:"center",justifyContent:"center",fontSize:"1.5rem",background:`${p.c}20`,border:`1px solid ${p.c}40`,flexShrink:0}}>{p.i}</div>
            <div style={{flex:1,minWidth:160}}>
              <div style={{display:"flex",gap:5,marginBottom:6,flexWrap:"wrap"}}>
                <Tag t={p.cat} c={p.c}/>{p.tags.map(t=><Tag key={t} t={t} c={p.c}/>)}
              </div>
              <h2 style={{fontFamily:"'Syne',sans-serif",fontSize:"1.35rem",fontWeight:800,color:"#fff",marginBottom:4}}>{p.title}</h2>
              <p style={{color:"#94a3b8",fontSize:12.5,lineHeight:1.6}}>{p.desc}</p>
            </div>
          </div>
          <div style={{display:"flex",flexWrap:"wrap",gap:5,marginBottom:10}}>
            {p.tech.map(t=><span key={t} style={{fontFamily:"monospace",fontSize:10,padding:"2px 8px",borderRadius:6,background:`${p.c}18`,color:p.c,border:`1px solid ${p.c}35`}}>{t}</span>)}
          </div>
          {/* GitHub bar */}
          <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:10,padding:"8px 12px",borderRadius:10,background:"rgba(255,255,255,.03)",border:"1px solid rgba(255,255,255,.06)"}}>
            <GithubIcon size={13}/><span style={{fontFamily:"monospace",fontSize:11,color:"#475569",flex:1,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{p.github}</span>
            <a href={p.github} target="_blank" rel="noreferrer" style={{display:"inline-flex",alignItems:"center",gap:4,padding:"4px 10px",borderRadius:7,background:`${p.c}18`,border:`1px solid ${p.c}35`,color:p.c,fontSize:10,fontFamily:"monospace",fontWeight:700,textDecoration:"none",transition:"all .2s",flexShrink:0}}
              onMouseEnter={e=>e.currentTarget.style.background=`${p.c}30`} onMouseLeave={e=>e.currentTarget.style.background=`${p.c}18`}>
              Voir le code ↗
            </a>
          </div>
          {/* Tabs */}
          <div style={{display:"flex",borderTop:"1px solid rgba(255,255,255,.06)",overflowX:"auto"}}>
            {tabs.map(([k,l])=>(
              <button key={k} onClick={()=>setTab(k)} style={{padding:"10px 18px",fontFamily:"monospace",fontSize:10,fontWeight:600,border:"none",background:tab===k?`${p.c}12`:"transparent",color:tab===k?p.c:"#475569",borderBottom:`2px solid ${tab===k?p.c:"transparent"}`,cursor:"pointer",transition:"all .2s",whiteSpace:"nowrap",flexShrink:0}}>{l}</button>
            ))}
          </div>
        </div>
        {/* Content */}
        <div style={{padding:"1.5rem"}}>
          {/* Overview */}
          {tab==="overview"&&(
            <div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14,marginBottom:14}}>
                <div><h3 style={{fontFamily:"'Syne',sans-serif",fontSize:12,fontWeight:700,color:"#fff",marginBottom:7}}>🔗 Contexte</h3><p style={{color:"#94a3b8",fontSize:12,lineHeight:1.7}}>{p.full.ctx}</p></div>
                <div><h3 style={{fontFamily:"'Syne',sans-serif",fontSize:12,fontWeight:700,color:"#fff",marginBottom:7}}>⚡ Problème résolu</h3><p style={{color:"#94a3b8",fontSize:12,lineHeight:1.7}}>{p.full.problem}</p></div>
              </div>
              <h3 style={{fontFamily:"'Syne',sans-serif",fontSize:12,fontWeight:700,color:"#fff",marginBottom:8}}>🎯 Objectifs</h3>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"4px 14px",marginBottom:12}}>
                {p.full.objs.map(o=>(
                  <div key={o} style={{display:"flex",gap:6,fontSize:12,color:"#94a3b8",lineHeight:1.55}}>
                    <span style={{color:p.c,flexShrink:0,marginTop:2}}>▸</span>{o}
                  </div>
                ))}
              </div>
              <h3 style={{fontFamily:"'Syne',sans-serif",fontSize:12,fontWeight:700,color:"#fff",marginBottom:8}}>✓ Fonctionnalités</h3>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:5}}>
                {p.full.feats.map(f=>(
                  <div key={f} style={{display:"flex",gap:6,padding:"7px 9px",borderRadius:8,background:`${p.c}08`,border:`1px solid ${p.c}18`,fontSize:11.5,color:"#cbd5e1",lineHeight:1.5}}>
                    <span style={{color:p.c,flexShrink:0}}>✓</span>{f}
                  </div>
                ))}
              </div>
            </div>
          )}
          {/* Code */}
          {tab==="code"&&(
            <div style={{borderRadius:12,overflow:"hidden",border:"1px solid rgba(255,255,255,.08)"}}>
              <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"7px 14px",background:"#080e1c",borderBottom:"1px solid rgba(255,255,255,.06)"}}>
                <div style={{display:"flex",gap:5}}>{["#ff5f57","#ffbd2e","#28ca41"].map(c=><div key={c} style={{width:10,height:10,borderRadius:"50%",background:c}}/>)}</div>
                <span style={{fontFamily:"monospace",fontSize:10,color:"#475569",padding:"1px 7px",borderRadius:4,background:"rgba(255,255,255,.04)"}}>{p.full.lang}</span>
                <button onClick={()=>navigator.clipboard?.writeText(p.full.code)}
                  style={{fontFamily:"monospace",fontSize:10,color:"#64748b",background:"none",border:"none",cursor:"pointer",padding:"2px 8px",borderRadius:4,transition:"all .2s"}}
                  onMouseEnter={e=>{e.currentTarget.style.color="#fff";e.currentTarget.style.background="rgba(255,255,255,.06)";}}
                  onMouseLeave={e=>{e.currentTarget.style.color="#64748b";e.currentTarget.style.background="none";}}>copier</button>
              </div>
              <pre style={{padding:16,fontFamily:"monospace",fontSize:11,lineHeight:1.7,color:"#e2e8f0",background:"#060b18",overflowX:"auto",margin:0}}
                dangerouslySetInnerHTML={{__html:hlCode(p.full.code,p.full.lang)}}/>
            </div>
          )}
          {/* Results */}
          {tab==="results"&&(
            <div>
              <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:8,marginBottom:12}}>
                {p.full.stats.map(s=>(
                  <div key={s.l} style={{padding:"9px 7px",borderRadius:10,textAlign:"center",background:`${p.c}08`,border:`1px solid ${p.c}18`}}>
                    <div style={{fontFamily:"'Syne',sans-serif",fontSize:"1.25rem",fontWeight:800,color:p.c,marginBottom:2}}>{s.v}</div>
                    <div style={{fontSize:10,color:"#64748b"}}>{s.l}</div>
                  </div>
                ))}
              </div>
              <div style={{padding:"10px 14px",borderRadius:10,background:"rgba(52,211,153,.06)",border:"1px solid rgba(52,211,153,.2)",marginBottom:10}}>
                <h4 style={{color:"#34d399",fontSize:12,fontWeight:700,marginBottom:5}}>✓ Résultats obtenus</h4>
                <p style={{color:"#94a3b8",fontSize:12,lineHeight:1.65}}>{p.full.results}</p>
              </div>
              <div style={{padding:"10px 14px",borderRadius:10,background:"rgba(251,146,60,.06)",border:"1px solid rgba(251,146,60,.18)",marginBottom:10}}>
                <h4 style={{color:"#fb923c",fontSize:12,fontWeight:700,marginBottom:5}}>⚡ Difficultés</h4>
                <p style={{color:"#94a3b8",fontSize:12,lineHeight:1.65}}>{p.full.difficulty}</p>
              </div>
              <div style={{marginBottom:10}}>
                <h4 style={{fontFamily:"'Syne',sans-serif",fontSize:12,fontWeight:700,color:"#fff",marginBottom:8}}>⚙ Pipeline</h4>
                <div style={{display:"flex",alignItems:"center",gap:5,flexWrap:"wrap"}}>
                  {p.full.pipeline.map((s,i)=>(
                    <React.Fragment key={s}>
                      <span style={{padding:"3px 9px",borderRadius:6,background:`${p.c}15`,color:p.c,border:`1px solid ${p.c}30`,fontFamily:"monospace",fontSize:11,fontWeight:600}}>{s}</span>
                      {i<p.full.pipeline.length-1&&<span style={{color:"#334155"}}>→</span>}
                    </React.Fragment>
                  ))}
                </div>
              </div>
              <div style={{marginBottom:12}}>
                <h4 style={{fontFamily:"'Syne',sans-serif",fontSize:12,fontWeight:700,color:"#fff",marginBottom:8}}>🚀 Améliorations</h4>
                <div style={{display:"flex",flexWrap:"wrap",gap:5}}>
                  {p.full.improvements.map(i=>(
                    <span key={i} style={{fontFamily:"monospace",fontSize:10,padding:"3px 8px",borderRadius:999,background:"rgba(255,255,255,.04)",color:"#94a3b8",border:"1px solid rgba(255,255,255,.08)"}}>{i}</span>
                  ))}
                </div>
              </div>
              <div style={{display:"flex",gap:8,paddingTop:12,borderTop:"1px solid rgba(255,255,255,.06)",flexWrap:"wrap"}}>
                <a href={p.github} target="_blank" rel="noreferrer"
                  style={{display:"inline-flex",alignItems:"center",gap:6,padding:"8px 16px",borderRadius:10,background:"rgba(255,255,255,.06)",border:"1px solid rgba(255,255,255,.12)",color:"#e2e8f0",fontSize:12,fontFamily:"monospace",fontWeight:600,textDecoration:"none",transition:"all .2s"}}
                  onMouseEnter={e=>e.currentTarget.style.background="rgba(255,255,255,.12)"} onMouseLeave={e=>e.currentTarget.style.background="rgba(255,255,255,.06)"}>
                  <GithubIcon size={13}/> Voir le code GitHub
                </a>
                <button onClick={onClose} style={{display:"inline-flex",alignItems:"center",gap:5,padding:"8px 14px",borderRadius:10,background:"transparent",border:"1px solid rgba(255,255,255,.1)",color:"#94a3b8",fontSize:12,cursor:"pointer",fontFamily:"monospace",transition:"color .2s"}}
                  onMouseEnter={e=>e.currentTarget.style.color="#fff"} onMouseLeave={e=>e.currentTarget.style.color="#94a3b8"}>← Retour</button>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

// ── TYPING HOOK ───────────────────────────────────────────────────────────────
function useTyping(titles){
  const[idx,setIdx]=useState(0);const[txt,setTxt]=useState("");const[fwd,setFwd]=useState(true);
  useEffect(()=>{
    const w=titles[idx];
    if(fwd){if(txt.length<w.length){const t=setTimeout(()=>setTxt(w.slice(0,txt.length+1)),72);return()=>clearTimeout(t);}const t=setTimeout(()=>setFwd(false),1900);return()=>clearTimeout(t);}
    else{if(txt.length>0){const t=setTimeout(()=>setTxt(txt.slice(0,-1)),38);return()=>clearTimeout(t);}setIdx(i=>(i+1)%titles.length);setFwd(true);}
  },[txt,fwd,idx]);
  return txt;
}

// ── MAIN APP ──────────────────────────────────────────────────────────────────
export default function App(){
  const[cat,setCat]=useState("All");
  const[modal,setModal]=useState(null);
  const[sent,setSent]=useState(false);
  const[scrolled,setScrolled]=useState(false);
  const canvasRef=useRef();
  const txt=useTyping(TITLES);
  const filtered=cat==="All"?PROJECTS:PROJECTS.filter(p=>p.cat===cat);

  useEffect(()=>{const f=()=>setScrolled(window.scrollY>40);window.addEventListener("scroll",f);return()=>window.removeEventListener("scroll",f);},[]);

  // Particles
  useEffect(()=>{
    const cv=canvasRef.current;if(!cv)return;
    const ctx=cv.getContext("2d");
    const resize=()=>{cv.width=window.innerWidth;cv.height=window.innerHeight;};
    resize();window.addEventListener("resize",resize);
    const pts=Array.from({length:65},()=>({x:Math.random()*cv.width,y:Math.random()*cv.height,vx:(Math.random()-.5)*.28,vy:(Math.random()-.5)*.28,r:Math.random()*1.2+.3,a:Math.random()*.35+.06}));
    let raf;
    const loop=()=>{
      ctx.clearRect(0,0,cv.width,cv.height);
      pts.forEach(p=>{p.x+=p.vx;p.y+=p.vy;if(p.x<0||p.x>cv.width)p.vx*=-1;if(p.y<0||p.y>cv.height)p.vy*=-1;ctx.beginPath();ctx.arc(p.x,p.y,p.r,0,Math.PI*2);ctx.fillStyle=`rgba(99,179,237,${p.a})`;ctx.fill();});
      for(let i=0;i<pts.length;i++)for(let j=i+1;j<pts.length;j++){const dx=pts[i].x-pts[j].x,dy=pts[i].y-pts[j].y,d=Math.hypot(dx,dy);if(d<100){ctx.beginPath();ctx.moveTo(pts[i].x,pts[i].y);ctx.lineTo(pts[j].x,pts[j].y);ctx.strokeStyle=`rgba(139,92,246,${.08*(1-d/100)})`;ctx.lineWidth=.5;ctx.stroke();}}
      raf=requestAnimationFrame(loop);
    };
    loop();
    return()=>{cancelAnimationFrame(raf);window.removeEventListener("resize",resize);};
  },[]);

  const goTo=id=>document.getElementById(id)?.scrollIntoView({behavior:"smooth"});
  const BG="#040610";

  return(
    <div style={{background:BG,color:"#fff",minHeight:"100vh",overflowX:"hidden",fontFamily:"'DM Sans',sans-serif"}}>
      <style>{G_STYLES}</style>
      <canvas ref={canvasRef} style={{position:"fixed",inset:0,zIndex:0,pointerEvents:"none"}}/>
      <div style={{position:"fixed",inset:0,zIndex:0,pointerEvents:"none",backgroundImage:"linear-gradient(rgba(99,179,237,.025) 1px,transparent 1px),linear-gradient(90deg,rgba(99,179,237,.025) 1px,transparent 1px)",backgroundSize:"64px 64px"}}/>
      <div style={{position:"fixed",inset:0,zIndex:0,pointerEvents:"none",background:"radial-gradient(ellipse 70% 50% at 50% 0%,rgba(99,179,237,.07),transparent)"}}/>

      {/* ── NAV ──────────────────────────────────────────── */}
      <nav style={{position:"fixed",top:0,left:0,right:0,zIndex:100,height:64,display:"flex",alignItems:"center",justifyContent:"space-between",padding:"0 2.5rem",transition:"all .4s",background:scrolled?"rgba(4,6,18,.95)":"transparent",backdropFilter:scrolled?"blur(22px)":"none",borderBottom:scrolled?"1px solid rgba(255,255,255,.05)":"none"}}>
        <span style={{fontFamily:"monospace",fontWeight:700,fontSize:13,letterSpacing:".15em"}}>
          <span style={{color:"#63b3ed"}}>MB</span><span style={{color:"#334155"}}>_</span><span style={{color:"#a78bfa"}}>dev</span>
        </span>
        <div style={{display:"flex",gap:20,alignItems:"center"}}>
          {["about","skills","projects","experience","contact"].map(s=>(
            <button key={s} onClick={()=>goTo(s)} style={{background:"none",border:"none",color:"#94a3b8",fontSize:12,cursor:"pointer",fontFamily:"'DM Sans',sans-serif",textTransform:"capitalize",transition:"color .2s"}}
              onMouseEnter={e=>e.target.style.color="#fff"} onMouseLeave={e=>e.target.style.color="#94a3b8"}>{s}</button>
          ))}
          <button onClick={()=>goTo("contact")} style={{padding:"6px 16px",borderRadius:999,fontSize:11,fontWeight:600,border:"1px solid rgba(99,179,237,.4)",color:"#93c5fd",background:"transparent",cursor:"pointer",transition:"all .2s"}}
            onMouseEnter={e=>e.currentTarget.style.background="rgba(99,179,237,.12)"} onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
            Hire Me
          </button>
        </div>
      </nav>

      {/* ── HERO ─────────────────────────────────────────── */}
      <section id="hero" style={{minHeight:"100vh",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",textAlign:"center",padding:"6rem 1.5rem 3rem",position:"relative",zIndex:10}}>
        {[{t:"12%",l:"6%",s:340,c:"rgba(99,179,237,.07)"},{t:"55%",r:"4%",s:280,c:"rgba(167,139,250,.07)"}].map((o,i)=>(
          <div key={i} style={{position:"absolute",top:o.t,left:o.l,right:o.r,width:o.s,height:o.s,borderRadius:"50%",background:`radial-gradient(circle,${o.c},transparent)`,pointerEvents:"none",animation:`pglow ${6+i*2}s ease-in-out ${i}s infinite`}}/>
        ))}
        <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{delay:.3}}
          style={{display:"inline-flex",alignItems:"center",gap:8,padding:"8px 20px",borderRadius:999,border:"1px solid rgba(52,211,153,.35)",background:"rgba(52,211,153,.06)",color:"#34d399",fontFamily:"monospace",fontSize:11,letterSpacing:".1em",marginBottom:32}}>
          <span style={{width:6,height:6,borderRadius:"50%",background:"#34d399",display:"inline-block",animation:"pglow 1.5s infinite"}}/>
          Disponible — Alternance / Stage · Lyon, France
        </motion.div>
        <motion.h1 initial={{opacity:0,y:30}} animate={{opacity:1,y:0}} transition={{delay:.45,duration:.8}}
          style={{fontFamily:"'Syne',sans-serif",fontSize:"clamp(3.5rem,10vw,8rem)",fontWeight:800,lineHeight:1,marginBottom:16}}>
          <span style={{color:"#fff"}}>Mounir</span><br/>
          <span style={{background:"linear-gradient(135deg,#63b3ed,#a78bfa 55%,#f472b6)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>Bekkar</span>
        </motion.h1>
        <motion.div initial={{opacity:0}} animate={{opacity:1}} transition={{delay:.65}}
          style={{fontFamily:"'Syne',sans-serif",fontSize:"clamp(1.1rem,3vw,1.7rem)",fontWeight:700,height:38,marginBottom:20}}>
          <span style={{background:"linear-gradient(90deg,#63b3ed,#a78bfa)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>{txt}</span>
          <span style={{color:"#63b3ed",animation:"typeC 1s infinite"}}>|</span>
        </motion.div>
        <motion.p initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{delay:.82}}
          style={{color:"#94a3b8",maxWidth:520,lineHeight:1.75,fontSize:14,marginBottom:40}}>
          Master Informatique — Lyon 2. Passionné par la <span style={{color:"#63b3ed",fontWeight:600}}>Data Science, le BI et le Data Engineering</span>. Je construis des pipelines, des analyses et des systèmes intelligents.
        </motion.p>
        <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{delay:1}}
          style={{display:"flex",flexWrap:"wrap",gap:12,justifyContent:"center"}}>
          {[{l:"Voir les projets →",fn:()=>goTo("projects"),p:true},{l:"⬇ CV",fn:()=>window.open(LINKS.cv,"_blank"),p:false},{l:"✉ Contact",fn:()=>goTo("contact"),p:false}].map(b=>(
            <motion.button key={b.l} onClick={b.fn} whileHover={{scale:1.04}} whileTap={{scale:.97}}
              style={{padding:"12px 24px",borderRadius:12,fontWeight:700,fontSize:13,cursor:"pointer",fontFamily:"'DM Sans',sans-serif",...(b.p?{background:"linear-gradient(90deg,#3b82f6,#8b5cf6)",color:"#fff",border:"none",boxShadow:"0 0 28px rgba(99,179,237,.25)"}:{background:"transparent",color:"#cbd5e1",border:"1px solid rgba(255,255,255,.12)"})}}>
              {b.l}
            </motion.button>
          ))}
        </motion.div>
      </section>

      {/* ── STATS ─────────────────────────────────────────── */}
      <section style={{padding:"4rem 1.5rem",position:"relative",zIndex:10}}>
        <div style={{maxWidth:900,margin:"0 auto",display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:12}}>
          {STATS.map((s,i)=><Fade key={s.l} delay={i*.08}><StatCard s={s}/></Fade>)}
        </div>
      </section>

      {/* ── ABOUT ─────────────────────────────────────────── */}
      <section id="about" style={{padding:"6rem 1.5rem",position:"relative",zIndex:10}}>
        <div style={{maxWidth:960,margin:"0 auto"}}>
          <Fade><div style={{textAlign:"center",marginBottom:48}}><SectionLabel text="// 01. ABOUT"/><br/>
            <h2 style={{fontFamily:"'Syne',sans-serif",fontSize:"clamp(1.8rem,4vw,2.8rem)",fontWeight:800,color:"#fff"}}>Qui suis-je ?</h2>
          </div></Fade>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:48,alignItems:"center"}}>
            <Fade x={-24}>
              <div style={{position:"relative",width:300,height:340,margin:"0 auto",perspective:1000}}>
                <Glass c="#63b3ed" style={{width:"100%",height:"100%",borderRadius:28,overflow:"hidden",position:"relative"}}>
                  <div style={{position:"absolute",top:14,right:14,display:"flex",alignItems:"center",gap:5,padding:"3px 10px",borderRadius:999,background:"rgba(52,211,153,.1)",border:"1px solid rgba(52,211,153,.3)",fontFamily:"monospace",fontSize:10,color:"#34d399"}}>
                    <span style={{width:5,height:5,borderRadius:"50%",background:"#34d399",animation:"pglow 1.5s infinite",display:"inline-block"}}/>Open to work
                  </div>
                  <div style={{position:"absolute",top:14,left:14,fontFamily:"monospace",fontSize:9,color:"rgba(99,179,237,.3)"}}>ID-2025-MB</div>
                  <div style={{display:"flex",justifyContent:"center",paddingTop:32,position:"relative"}}>
                    <div style={{position:"relative",width:120,height:120,display:"flex",alignItems:"center",justifyContent:"center"}}>
                      {[{w:114,a:"spin 8s linear infinite",c:"rgba(99,179,237,.2)"},{w:90,a:"spinR 12s linear infinite",c:"rgba(167,139,250,.15)"}].map((r,i)=>(
                        <div key={i} style={{position:"absolute",width:r.w,height:r.w,borderRadius:"50%",border:`1px dashed ${r.c}`,animation:r.a}}/>
                      ))}
                      {[["#63b3ed","orb1 8s"],["#a78bfa","orb2 6s"],["#34d399","orb3 10s"]].map(([c,a])=>(
                        <div key={c} style={{position:"absolute",width:7,height:7,borderRadius:"50%",background:c,boxShadow:`0 0 8px ${c}`,top:"50%",left:"50%",animation:`${a} linear infinite`}}/>
                      ))}
                      <Avatar/>
                    </div>
                  </div>
                  <div style={{textAlign:"center",padding:"8px 12px 0"}}>
                    <h3 style={{fontFamily:"'Syne',sans-serif",fontSize:16,fontWeight:800,color:"#fff",margin:0}}>Mounir Bekkar</h3>
                    <p style={{fontFamily:"monospace",fontSize:10,color:"#64748b",marginTop:3}}>Lyon 🇫🇷 · Master Data Science</p>
                  </div>
                  <div style={{display:"flex",flexWrap:"wrap",gap:5,justifyContent:"center",padding:"10px 12px"}}>
                    {[["Data","#63b3ed"],["BI","#a78bfa"],["ETL","#34d399"],["AI","#f472b6"]].map(([l,c])=>(
                      <span key={l} style={{padding:"2px 8px",borderRadius:999,fontFamily:"monospace",fontSize:10,background:`${c}15`,color:c,border:`1px solid ${c}35`}}>{l}</span>
                    ))}
                  </div>
                </Glass>
                {[{l:"Data Science",c:"#63b3ed",s:{top:-14,right:-24},d:0},{l:"Business BI",c:"#a78bfa",s:{bottom:60,right:-32},d:.9},{l:"ETL / Eng.",c:"#34d399",s:{bottom:-14,left:8},d:1.8}].map((b,i)=>(
                  <motion.div key={b.l} animate={{y:[0,-6,0]}} transition={{duration:3.5+i,repeat:Infinity,ease:"easeInOut",delay:b.d}}
                    style={{position:"absolute",padding:"4px 10px",borderRadius:999,fontFamily:"monospace",fontSize:10,fontWeight:600,backdropFilter:"blur(8px)",zIndex:20,background:`${b.c}18`,color:b.c,border:`1px solid ${b.c}40`,...b.s}}>
                    {b.l}
                  </motion.div>
                ))}
              </div>
            </Fade>
            <Fade delay={.2}>
              <h3 style={{fontFamily:"'Syne',sans-serif",fontSize:20,fontWeight:700,color:"#fff",marginBottom:12}}>Data Analyst · BI Developer · Data Engineer</h3>
              <p style={{color:"#94a3b8",fontSize:13,lineHeight:1.8,marginBottom:12}}>Étudiant en <span style={{color:"#63b3ed",fontWeight:600}}>Master Informatique à Lyon 2</span>, orienté Data Science, Business Intelligence et Data Engineering.</p>
              <p style={{color:"#94a3b8",fontSize:13,lineHeight:1.8,marginBottom:20}}>Je recherche une <span style={{color:"#a78bfa",fontWeight:600}}>alternance ou un stage</span> en Data Analytics, BI ou Software Development.</p>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:16}}>
                {DOMAINS.map(([i,l,c])=>(
                  <div key={l} style={{display:"flex",alignItems:"center",gap:8,padding:"10px 12px",borderRadius:10,background:`${c}0e`,border:`1px solid ${c}22`}}>
                    <span style={{fontSize:"1rem"}}>{i}</span><span style={{fontSize:12,fontWeight:600,color:c}}>{l}</span>
                  </div>
                ))}
              </div>
              <div style={{display:"flex",flexWrap:"wrap",gap:6}}>
                {LANGS.map(([f,l,lv,c])=>(
                  <div key={l} style={{display:"flex",alignItems:"center",gap:5,padding:"4px 10px",borderRadius:999,fontSize:11,background:`${c}10`,color:c,border:`1px solid ${c}25`}}>
                    {f} <strong>{l}</strong> <span style={{color:"#64748b"}}>· {lv}</span>
                  </div>
                ))}
              </div>
            </Fade>
          </div>
        </div>
      </section>

      {/* ── ACADEMIC ──────────────────────────────────────── */}
      <section id="academic" style={{padding:"6rem 1.5rem",position:"relative",zIndex:10}}>
        <div style={{maxWidth:600,margin:"0 auto"}}>
          <Fade><div style={{textAlign:"center",marginBottom:40}}><SectionLabel text="// 02. FORMATION"/><br/>
            <h2 style={{fontFamily:"'Syne',sans-serif",fontSize:"clamp(1.8rem,4vw,2.8rem)",fontWeight:800,color:"#fff"}}>Parcours Académique</h2>
          </div></Fade>
          <div style={{position:"relative",paddingLeft:48}}>
            <div style={{position:"absolute",left:12,top:8,bottom:8,width:1,background:"linear-gradient(to bottom,transparent,rgba(167,139,250,.45) 20%,rgba(99,179,237,.45) 80%,transparent)"}}/>
            {ACADEMIA.map((a,i)=>(
              <Fade key={a.deg} delay={i*.15}>
                <div style={{position:"relative",marginBottom:20}}>
                  {a.active&&<div style={{position:"absolute",left:-36,top:24,width:26,height:26,borderRadius:"50%",border:`1px dashed ${a.c}70`,animation:"spin 7s linear infinite"}}/>}
                  <div style={{position:"absolute",left:-34,top:24,width:22,height:22,borderRadius:"50%",border:`2px solid ${a.c}`,background:"#07090f",boxShadow:`0 0 14px ${a.c}55`,display:"flex",alignItems:"center",justifyContent:"center",zIndex:2}}>
                    <div style={{width:9,height:9,borderRadius:"50%",background:a.c}}/>
                  </div>
                  <motion.div whileHover={{y:-3}}>
                    <Glass c={a.active?a.c:null} style={{padding:18,borderColor:a.active?`${a.c}30`:"rgba(255,255,255,.1)"}}>
                      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:8,flexWrap:"wrap"}}>
                        <div>
                          <div style={{fontFamily:"'Syne',sans-serif",fontSize:14,fontWeight:700,color:"#fff"}}>{a.deg}</div>
                          <div style={{fontSize:12,fontWeight:600,color:a.c,marginTop:3}}>{a.school}</div>
                        </div>
                        <div style={{display:"flex",alignItems:"center",gap:6,flexShrink:0}}>
                          {a.active&&<span style={{fontFamily:"monospace",fontSize:10,padding:"2px 8px",borderRadius:999,background:`${a.c}18`,color:a.c,border:`1px solid ${a.c}30`}}>Actuel</span>}
                          <span style={{fontFamily:"monospace",fontSize:10,color:"#64748b",border:"1px solid rgba(255,255,255,.1)",padding:"3px 8px",borderRadius:6}}>{a.period}</span>
                        </div>
                      </div>
                    </Glass>
                  </motion.div>
                </div>
              </Fade>
            ))}
          </div>
        </div>
      </section>

      {/* ── SKILLS ────────────────────────────────────────── */}
      <section id="skills" style={{padding:"6rem 1.5rem",position:"relative",zIndex:10}}>
        <div style={{maxWidth:960,margin:"0 auto"}}>
          <Fade><div style={{textAlign:"center",marginBottom:40}}><SectionLabel text="// 03. COMPÉTENCES"/><br/>
            <h2 style={{fontFamily:"'Syne',sans-serif",fontSize:"clamp(1.8rem,4vw,2.8rem)",fontWeight:800,color:"#fff"}}>Arsenal Technique</h2>
          </div></Fade>
          <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:16}}>
            {SKILLS.map((g,gi)=>(
              <Fade key={g.l} delay={gi*.13}>
                <Glass style={{padding:20,height:"100%"}}>
                  <h3 style={{fontFamily:"'Syne',sans-serif",fontSize:13,fontWeight:700,color:"#fff",marginBottom:16}}>{g.l}</h3>
                  {g.items.map(([n,l])=><SkillBar key={n} name={n} level={l} c={g.c}/>)}
                </Glass>
              </Fade>
            ))}
          </div>
        </div>
      </section>

      {/* ── PROJECTS ──────────────────────────────────────── */}
      <section id="projects" style={{padding:"6rem 1.5rem",position:"relative",zIndex:10}}>
        <div style={{maxWidth:1100,margin:"0 auto"}}>
          <Fade><div style={{textAlign:"center",marginBottom:40}}>
            <SectionLabel text="// 04. PROJETS"/><br/>
            <h2 style={{fontFamily:"'Syne',sans-serif",fontSize:"clamp(1.8rem,4vw,2.8rem)",fontWeight:800,color:"#fff",marginBottom:8}}>Projets GitHub</h2>
            <p style={{color:"#94a3b8",fontSize:13,maxWidth:480,margin:"0 auto"}}>Cliquez pour explorer les détails, le code, les visualisations et les insights.</p>
          </div></Fade>
          {/* Filters */}
          <div style={{display:"flex",gap:8,justifyContent:"center",flexWrap:"wrap",marginBottom:32}}>
            {CATS.map(c=>(
              <button key={c} onClick={()=>setCat(c)}
                style={{padding:"6px 18px",borderRadius:999,fontSize:11,fontWeight:600,cursor:"pointer",fontFamily:"monospace",transition:"all .2s",...(cat===c?{background:"linear-gradient(90deg,#3b82f6,#8b5cf6)",color:"#fff",border:"none",boxShadow:"0 0 18px rgba(99,179,237,.22)"}:{background:"rgba(255,255,255,.04)",color:"#94a3b8",border:"1px solid rgba(255,255,255,.08)"})}}>
                {c}
              </button>
            ))}
          </div>
          {/* Grid */}
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(300px,1fr))",gap:20}}>
            <AnimatePresence mode="wait">
              {filtered.map(p=><ProjectCard key={p.id} p={p} onClick={setModal}/>)}
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* ── EXPERIENCE ────────────────────────────────────── */}
      <section id="experience" style={{padding:"6rem 1.5rem",position:"relative",zIndex:10}}>
        <div style={{maxWidth:600,margin:"0 auto"}}>
          <Fade><div style={{textAlign:"center",marginBottom:40}}><SectionLabel text="// 05. EXPÉRIENCE"/><br/>
            <h2 style={{fontFamily:"'Syne',sans-serif",fontSize:"clamp(1.8rem,4vw,2.8rem)",fontWeight:800,color:"#fff"}}>Expérience Pro</h2>
          </div></Fade>
          <div style={{position:"relative",paddingLeft:48}}>
            <div style={{position:"absolute",left:12,top:0,bottom:0,width:1,background:"rgba(99,179,237,.35)"}}/>
            <div style={{position:"absolute",left:-22,top:24,width:26,height:26,borderRadius:"50%",border:"1px dashed rgba(99,179,237,.7)",animation:"spin 7s linear infinite"}}/>
            <div style={{position:"absolute",left:-20,top:24,width:22,height:22,borderRadius:"50%",border:"2px solid #63b3ed",background:"#07090f",boxShadow:"0 0 14px rgba(99,179,237,.55)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:2}}>
              <div style={{width:9,height:9,borderRadius:"50%",background:"#63b3ed"}}/>
            </div>
            <Glass c="#63b3ed" style={{padding:20,borderColor:"rgba(99,179,237,.3)"}}>
              <div style={{display:"flex",justifyContent:"space-between",flexWrap:"wrap",gap:8,marginBottom:10}}>
                <div>
                  <div style={{fontFamily:"'Syne',sans-serif",fontSize:15,fontWeight:700,color:"#fff"}}>Stagiaire Data / Développeur</div>
                  <div style={{fontSize:13,fontWeight:600,color:"#63b3ed",marginTop:2}}>BADR Bank — Algérie</div>
                </div>
                <div style={{display:"flex",gap:6}}>
                  <span style={{fontFamily:"monospace",fontSize:10,padding:"2px 8px",borderRadius:999,background:"rgba(99,179,237,.18)",color:"#63b3ed",border:"1px solid rgba(99,179,237,.3)"}}>2025</span>
                </div>
              </div>
              <p style={{color:"#94a3b8",fontSize:12,lineHeight:1.65,marginBottom:10}}>Analyse et manipulation de données bancaires SQL/PL-SQL. Développement backend PHP pour les interfaces de gestion des crédits. Optimisation de requêtes et collaboration avec les équipes métiers.</p>
              <div style={{display:"flex",flexWrap:"wrap",gap:5}}>
                {["PHP","PL/SQL","Oracle","SQL","PDO"].map(t=><Tag key={t} t={t} c="#63b3ed"/>)}
              </div>
            </Glass>
          </div>
          <Fade delay={.2}>
            <div style={{marginTop:16,padding:"12px 16px",borderRadius:12,display:"flex",alignItems:"center",gap:12,background:"rgba(99,179,237,.05)",border:"1px solid rgba(99,179,237,.18)"}}>
              <span>⚡</span>
              <p style={{color:"#94a3b8",fontSize:12,lineHeight:1.55}}>Disponible pour <span style={{color:"#63b3ed",fontWeight:600}}>alternance ou stage</span> en Data / BI / Dev. <button onClick={()=>goTo("contact")} style={{background:"none",border:"none",color:"#93c5fd",textDecoration:"underline",cursor:"pointer",fontSize:12}}>Me contacter →</button></p>
            </div>
          </Fade>
        </div>
      </section>

      {/* ── JOBS ──────────────────────────────────────────── */}
      <section style={{padding:"5rem 1.5rem",position:"relative",zIndex:10}}>
        <div style={{maxWidth:960,margin:"0 auto"}}>
          <Fade><div style={{textAlign:"center",marginBottom:36}}><SectionLabel text="// 06. JOBS ÉTUDIANTS"/><br/>
            <h2 style={{fontFamily:"'Syne',sans-serif",fontSize:"clamp(1.6rem,4vw,2.4rem)",fontWeight:800,color:"#fff"}}>Jobs Étudiants</h2>
          </div></Fade>
          <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:14}}>
            {JOBS.map((j,i)=>(
              <Fade key={j.co} delay={i*.1}>
                <motion.div whileHover={{y:-5,scale:1.02}}>
                  <Glass c={j.c} style={{padding:18}}>
                    <div style={{display:"flex",justifyContent:"space-between",marginBottom:10}}>
                      <div style={{width:38,height:38,borderRadius:10,background:`${j.c}18`,border:`1px solid ${j.c}30`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:17}}>{j.i}</div>
                      <span style={{fontFamily:"monospace",fontSize:10,color:"#64748b",border:"1px solid rgba(255,255,255,.08)",padding:"2px 7px",borderRadius:5}}>{j.period}</span>
                    </div>
                    <div style={{fontFamily:"'Syne',sans-serif",fontSize:15,fontWeight:700,color:"#fff"}}>{j.co}</div>
                    <div style={{fontSize:12,color:j.c,fontWeight:600,marginTop:2}}>{j.role}</div>
                  </Glass>
                </motion.div>
              </Fade>
            ))}
          </div>
        </div>
      </section>

      {/* ── CONTACT ───────────────────────────────────────── */}
      <section id="contact" style={{padding:"6rem 1.5rem",position:"relative",zIndex:10}}>
        <div style={{maxWidth:960,margin:"0 auto"}}>
          <Fade><div style={{textAlign:"center",marginBottom:40}}><SectionLabel text="// 07. CONTACT"/><br/>
            <h2 style={{fontFamily:"'Syne',sans-serif",fontSize:"clamp(1.8rem,4vw,2.8rem)",fontWeight:800,color:"#fff",marginBottom:8}}>Contactez-moi</h2>
            <p style={{color:"#94a3b8",fontSize:13}}>Alternance, stage ou collaboration — je réponds vite.</p>
          </div></Fade>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:24}}>
            <Fade x={-20}>
              {[{l:"Email",v:"mounir.bekkar@univ-lyon2.fr",href:LINKS.email,c:"#63b3ed",i:"✉"},{l:"LinkedIn",v:"mounir-bekkar-503885263",href:LINKS.linkedin,c:"#a78bfa",i:"in"},{l:"GitHub",v:"github.com/mbekkar",href:LINKS.github,c:"#34d399",i:"⌥"}].map(l=>(
                <motion.a key={l.l} href={l.href} target="_blank" rel="noreferrer" whileHover={{x:5}}
                  style={{display:"flex",alignItems:"center",gap:14,padding:"12px 14px",borderRadius:12,border:"1px solid rgba(255,255,255,.06)",background:"rgba(255,255,255,.02)",textDecoration:"none",marginBottom:10}}>
                  <div style={{width:38,height:38,borderRadius:10,background:`${l.c}18`,color:l.c,display:"flex",alignItems:"center",justifyContent:"center",fontSize:14,flexShrink:0}}>{l.i}</div>
                  <div>
                    <div style={{fontFamily:"monospace",fontSize:10,color:"#64748b"}}>{l.l}</div>
                    <div style={{fontSize:12,color:"#fff"}}>{l.v}</div>
                  </div>
                  <span style={{marginLeft:"auto",color:"#334155"}}>→</span>
                </motion.a>
              ))}
            </Fade>
            <Fade delay={.2}>
              <Glass style={{padding:22}}>
                <h3 style={{fontFamily:"'Syne',sans-serif",fontSize:15,fontWeight:700,color:"#fff",marginBottom:16}}>Envoyer un message</h3>
                {sent?(
                  <div style={{textAlign:"center",padding:"20px 0"}}>
                    <div style={{fontSize:32,marginBottom:12}}>⚡</div>
                    <h4 style={{fontFamily:"'Syne',sans-serif",color:"#fff",marginBottom:6}}>Message envoyé !</h4>
                    <p style={{color:"#94a3b8",fontSize:12}}>Je vous répondrai dès que possible.</p>
                  </div>
                ):(
                  <form onSubmit={e=>{e.preventDefault();setSent(true);}}>
                    {[["Nom","text","Votre nom"],["Email","email","votre@email.com"]].map(([l,t,ph])=>(
                      <div key={l} style={{marginBottom:12}}>
                        <label style={{display:"block",fontFamily:"monospace",fontSize:10,color:"#64748b",marginBottom:4}}>{l}</label>
                        <input type={t} placeholder={ph} required style={{width:"100%",padding:"10px 12px",borderRadius:10,fontSize:13,color:"#fff",background:"rgba(255,255,255,.04)",border:"1px solid rgba(255,255,255,.08)",outline:"none",fontFamily:"'DM Sans',sans-serif"}}/>
                      </div>
                    ))}
                    <div style={{marginBottom:14}}>
                      <label style={{display:"block",fontFamily:"monospace",fontSize:10,color:"#64748b",marginBottom:4}}>Message</label>
                      <textarea placeholder="Décrivez votre opportunité..." required rows={3} style={{width:"100%",padding:"10px 12px",borderRadius:10,fontSize:13,color:"#fff",background:"rgba(255,255,255,.04)",border:"1px solid rgba(255,255,255,.08)",outline:"none",resize:"none",fontFamily:"'DM Sans',sans-serif"}}/>
                    </div>
                    <motion.button type="submit" whileHover={{scale:1.02}} whileTap={{scale:.97}}
                      style={{width:"100%",padding:12,borderRadius:10,fontWeight:700,fontSize:13,color:"#fff",background:"linear-gradient(90deg,#3b82f6,#8b5cf6)",border:"none",cursor:"pointer",fontFamily:"'DM Sans',sans-serif"}}>
                      Envoyer →
                    </motion.button>
                  </form>
                )}
              </Glass>
            </Fade>
          </div>
        </div>
      </section>

      {/* ── FOOTER ────────────────────────────────────────── */}
      <footer style={{padding:"2rem 1.5rem",borderTop:"1px solid rgba(255,255,255,.05)",position:"relative",zIndex:10}}>
        <div style={{maxWidth:960,margin:"0 auto",display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:16}}>
          <div>
            <div style={{fontFamily:"monospace",fontWeight:700,fontSize:16,marginBottom:4}}>
              <span style={{color:"#63b3ed"}}>MB</span><span style={{color:"#334155"}}>_</span><span style={{color:"#a78bfa"}}>dev</span>
            </div>
            <p style={{fontSize:11,color:"#334155"}}>© 2026 Mounir Bekkar · Data Engineer · Lyon</p>
          </div>
          <p style={{fontFamily:"monospace",fontSize:11,color:"#334155"}}>Built with React · Framer Motion</p>
          <div style={{display:"flex",gap:8}}>
            {[[LINKS.github,"⌥"],[LINKS.linkedin,"in"],[LINKS.email,"✉"]].map(([h,l])=>(
              <motion.a key={l} href={h} target="_blank" rel="noreferrer" whileHover={{scale:1.1,y:-2}}
                style={{width:34,height:34,borderRadius:10,border:"1px solid rgba(255,255,255,.08)",background:"rgba(255,255,255,.02)",display:"flex",alignItems:"center",justifyContent:"center",color:"#64748b",textDecoration:"none",fontSize:13}}>
                {l}
              </motion.a>
            ))}
          </div>
        </div>
      </footer>

      {/* ── MODAL ─────────────────────────────────────────── */}
      <AnimatePresence>{modal&&<ProjectModal p={modal} onClose={()=>setModal(null)}/>}</AnimatePresence>
    </div>
  );
}
