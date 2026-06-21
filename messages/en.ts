export const en = {
  artifactMetric: {
    CURRENT_STATS_CURRENT_ARTIFACTS: {
      description:
        "Estimates how often equipping this piece completes your build when your current stat totals are the goal and your other equipped artifacts stay as they are (simulated to max level). A value of 0.5 means about half of simulated outcomes satisfy every main stat, set bonus, and stat target.",
      label: "Build Completion Odds (Current Stats, Current Artifacts)",
      whenToUse: "Use when you want to know whether this piece works with the artifacts you already have today.",
    },
    CURRENT_STATS_RANDOM_ARTIFACTS: {
      description:
        "Same as Current Stats, but treats your other artifact slots as still being farmed — random pieces with appropriate sets and main stats. Useful for judging long-term value while the rest of your build is unfinished.",
      label: "Build Completion Odds (Current Stats, Random Artifacts)",
      whenToUse: "Use when other slots are still a work in progress and you care about future farming value.",
    },
    DESIRED_STATS_CURRENT_ARTIFACTS: {
      description:
        "Estimates how often equipping this piece completes your build against your explicit desired stat targets (e.g. 70% CRIT Rate, 140% CRIT DMG) while keeping your other equipped artifacts. Shows progress toward your endgame numbers.",
      label: "Build Completion Odds (Desired Stats, Current Artifacts)",
      whenToUse: "Use when you have specific stat goals and want to see if this piece gets you there with your current set.",
    },
    DESIRED_STATS_RANDOM_ARTIFACTS: {
      description:
        "Combines desired stat targets with random artifacts on other slots. Reflects how valuable this piece is while you are still farming the rest of your build toward your final goals.",
      label: "Build Completion Odds (Desired Stats, Random Artifacts)",
      whenToUse: "Use when evaluating a piece's long-term contribution toward your ideal finished build.",
    },
    PLUS_MINUS: {
      description:
        "The expected change in Rating compared to the artifact currently equipped in this slot. A positive value suggests an upgrade after fully leveling; a negative value suggests a downgrade. Zero if this is already the equipped piece.",
      label: "Plus/Minus",
      whenToUse: "Use when deciding whether a new drop is worth keeping over what you already have equipped.",
    },
    POSITIVE_PLUS_MINUS_ODDS: {
      description:
        "The chance (from 0 to 1) that fully leveling this piece will beat the rating of your currently equipped artifact in this slot. Higher means you are more likely to come out ahead after investing resources.",
      label: "Upgrade Odds",
      whenToUse: "Use when deciding whether to keep rolling substats or stop leveling.",
    },
    RATING: {
      description:
        "Expected substat quality if this piece is leveled to max, based on your build's desired stats and priority weights. Higher is better. Wrong main stat scores zero. Off-set pieces from sets your build does not need are scored lower when set bonuses matter.",
      label: "Rating",
      whenToUse: "Use to compare raw substat quality for a build, independent of whether it completes every target.",
    },
  },
  help: {
    gettingStarted: {
      artifacts: {
        body: "Your artifact or relic collection lives in the artifact manager for each game. Metrics are calculated per character build and shown on artifact cards, detail views, and sort options. Strong pieces for one character may be weak for another — always check metrics in the context of a build.",
        title: "Artifacts and relics",
      },
      builds: {
        body: "A build defines a character's desired stats, acceptable main stats per slot, required set bonuses, and currently equipped pieces. Every artifact metric evaluates a piece against one or more builds — the same artifact can score differently for different characters.",
        title: "Builds",
      },
      cloudSync: {
        body: "Log in to save your plan to the cloud (one plan per account). Your builds and artifacts are also stored locally in your browser, so you can use the planner without an account.",
        title: "Cloud sync",
      },
      importExport: {
        body: "Import game data from Genshin Impact (GOOD format) or Honkai: Star Rail (HSR Scanner). You can export your builds and artifacts for backup or sharing from each game's Import/Export page.",
        title: "Import and export",
      },
      recalculatingMetrics: {
        body: "Metrics refresh when you change an artifact or build. The artifact manager recalculates all metrics with a progress indicator. Results are cached until something relevant changes.",
        title: "Recalculating metrics",
      },
      title: "Getting started",
    },
    homeLink: "New to artifact metrics? Read the Help & FAQ guide",
    intro:
      "This planner helps you evaluate artifacts and relics against your character builds. The sections below explain how the app works and what each artifact metric means.",
    metrics: {
      ratingMetricsIntro:
        "Rating metrics measure substat quality and whether a piece is likely to beat what you already have equipped.",
      satisfactionMetricsIntro:
        "Build completion metrics estimate how often a piece helps you fully meet your build goals — correct main stats, set bonuses, and stat targets.",
      title: "Artifact metrics",
    },
    metricsIntro:
      "Metrics fall into two groups: rating metrics score substat quality (and upgrades vs. your equipped piece), while build completion metrics estimate how often a piece helps you fully meet your build goals.",
    title: "Help & FAQ",
    whereYouSeeMetrics:
      "You will see metrics as colored bars on artifact detail pages, in the sort dropdown on the artifact manager, in the top-artifacts picker on build pages, and in the top-builds picker on artifact details (showing which characters benefit most from a piece).",
  },
  nav: {
    help: "Help",
    settings: "Settings",
  },
  settings: {
    artifactMetrics: {
      atLeastOneRequired: "At least one metric must remain enabled.",
      buildCompletionMetrics: {
        title: "Build completion metrics",
      },
      description:
        "Disabled metrics are skipped during calculation and hidden from charts and dropdowns. Changes apply globally to Genshin Impact and Honkai: Star Rail.",
      ratingMetrics: {
        sharedSimulationNote:
          "Rating, Plus/Minus, and Upgrade Odds share the same roll simulation when any of them is enabled.",
        title: "Rating metrics",
      },
      title: "Artifact metrics",
    },
    intro: "Configure how the planner calculates and displays artifact metrics.",
    title: "Settings",
  },
} as const;
