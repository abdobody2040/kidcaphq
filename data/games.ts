
import { BusinessSimulation } from "../types";

export const GAMES_DB: BusinessSimulation[] = [
  {
    "business_id": "BIZ_01_LEMONADE",
    "name": "Lemonade Stand",
    "category": "Retail & Food",
    "game_type": "simulation_tycoon",
    "description": "Adjust your recipe and prices based on the weather forecast.",
    "visual_config": {
        "theme": "light",
        "colors": { "primary": "#FFC800", "secondary": "#F59E0B", "accent": "#10B981", "background": "#FEF3C7" },
        "icon": "🍋"
    },
    "variables": {
      "resources": ["lemons", "sugar", "ice", "cups"],
      "dynamic_factors": ["temperature", "weather_condition"],
      "player_inputs": ["price_per_cup", "ice_per_cup", "lemons_per_cup"]
    },
    "upgrade_tree": [
      { "id": "upgrade_ice_chest", "name": "Super Cooler", "effect": "Ice melts 50% slower", "cost": 50, "modifier_target": "quality", "modifier_value": 1.2 },
      { "id": "upgrade_juicer", "name": "Electric Juicer", "effect": "Production speed +25%", "cost": 100, "modifier_target": "speed", "modifier_value": 1.25 },
      { "id": "upgrade_sign", "name": "Spinning Sign", "effect": "Customer attraction +20%", "cost": 150, "modifier_target": "demand", "modifier_value": 1.2 }
    ],
    "event_triggers": {
      "positive": { "event_name": "Heatwave", "effect": "Demand increases by 200%", "duration": "1_day", "modifier_target": "demand", "modifier_value": 2.0 },
      "negative": { "event_name": "Sour Batch", "effect": "Refund cost increases by 20%", "duration": "1_day", "modifier_target": "revenue", "modifier_value": 0.8 }
    }
  },
  {
    "business_id": "BIZ_02_PIZZA",
    "name": "Pizza Rush",
    "category": "Retail & Food",
    "game_type": "driving_game",
    "description": "Deliver pizzas to hungry customers before they get cold!",
    "visual_config": {
        "theme": "neon",
        "colors": { "primary": "#EF4444", "secondary": "#B91C1C", "accent": "#F59E0B", "background": "#FFF1F2" },
        "icon": "🍕"
    },
    "entities": [
        { "id": "scooter", "type": "resource", "name": "Scooter", "emoji": "🛵" },
        { "id": "house", "type": "target", "name": "House", "emoji": "🏠" }
    ],
    "scoring": {
        "base_points": 20,
        "time_limit": 45
    },
    "upgrade_tree": [],
    "event_triggers": { positive: { event_name: "", effect: "", duration: "" }, negative: { event_name: "", effect: "", duration: "" } }
  },
  {
    "business_id": "BIZ_03_CUPCAKE",
    "name": "Cupcake Bakery",
    "category": "Retail & Food",
    "game_type": "matching_game",
    "description": "Assemble cupcakes exactly as ordered by customers!",
    "visual_config": {
        "theme": "pastel",
        "colors": { "primary": "#EC4899", "secondary": "#DB2777", "accent": "#F472B6", "background": "#FDF2F8" },
        "icon": "🧁"
    },
    "entities": [
        { "id": "base_vanilla", "type": "resource", "name": "Vanilla Base", "emoji": "🧁" },
        { "id": "base_choc", "type": "resource", "name": "Choco Base", "emoji": "🍫" },
        { "id": "frosting_pink", "type": "resource", "name": "Strawberry", "emoji": "🍓" },
        { "id": "frosting_blue", "type": "resource", "name": "Blueberry", "emoji": "🫐" },
        { "id": "top_cherry", "type": "resource", "name": "Cherry", "emoji": "🍒" },
        { "id": "top_sprinkle", "type": "resource", "name": "Sprinkles", "emoji": "🍬" }
    ],
    "scoring": { "base_points": 15 },
    "upgrade_tree": [],
    "event_triggers": { positive: { event_name: "", effect: "", duration: "" }, negative: { event_name: "", effect: "", duration: "" } }
  },
  {
    "business_id": "BIZ_12_CARWASH",
    "name": "Groovy Car Wash",
    "category": "Services & E-Commerce",
    "game_type": "rhythm_game",
    "description": "Scrub the cars to the beat! Hit the targets perfectly.",
    "visual_config": {
        "theme": "neon",
        "colors": { "primary": "#3B82F6", "secondary": "#2563EB", "accent": "#60A5FA", "background": "#EFF6FF" },
        "icon": "🚗"
    },
    "game_mechanics": { "spawn_rate": 1200 },
    "entities": [
        { "id": "dirt", "type": "item", "name": "Dirt", "emoji": "💩" },
        { "id": "bubble", "type": "item", "name": "Bubble", "emoji": "🫧" }
    ],
    "upgrade_tree": [],
    "event_triggers": { positive: { event_name: "", effect: "", duration: "" }, negative: { event_name: "", effect: "", duration: "" } }
  },
  {
    "business_id": "BIZ_25_APP",
    "name": "App Developer",
    "category": "Digital & Tech",
    "game_type": "clicker_idle",
    "description": "Tap to write code! Fix bugs and launch features to gain users.",
    "visual_config": {
        "theme": "dark",
        "colors": { "primary": "#3B82F6", "secondary": "#1E3A8A", "accent": "#10B981", "background": "#0F172A" },
        "icon": "📱"
    },
    "game_mechanics": {
        "click_value": 1,
        "auto_click_rate": 0
    },
    "entities": [
        { "id": "bug", "type": "obstacle", "name": "Bug", "emoji": "🐛", "value": -10 },
        { "id": "feature", "type": "target", "name": "Feature", "emoji": "✨", "value": 50 }
    ],
    "upgrade_tree": [
      { "id": "upgrade_laptop", "name": "Dual Monitors", "effect": "Click value +5", "cost": 100, "modifier_target": "click_value", "modifier_value": 5 },
      { "id": "upgrade_server", "name": "Cloud Scaling", "effect": "Auto-code +2/sec", "cost": 500, "modifier_target": "auto_click_rate", "modifier_value": 2 },
      { "id": "upgrade_ai", "name": "AI Assistant", "effect": "Auto-code +10/sec", "cost": 1500, "modifier_target": "auto_click_rate", "modifier_value": 10 }
    ],
    "event_triggers": {
      "positive": { "event_name": "Featured by Store", "effect": "Downloads x2 for 10s", "duration": "10s" },
      "negative": { "event_name": "Server Crash", "effect": "Production halted", "duration": "5s" }
    }
  },
  {
    "business_id": "BIZ_29_RECYCLE",
    "name": "Recycling Center",
    "category": "Social Impact",
    "game_type": "sorting_game",
    "description": "Sort incoming trash into the correct bins. Don't let plastic go into paper!",
    "visual_config": {
        "theme": "eco",
        "colors": { "primary": "#22C55E", "secondary": "#15803D", "accent": "#EAB308", "background": "#F0FDF4" },
        "icon": "♻️"
    },
    "game_mechanics": {
        "spawn_rate": 2000,
        "lanes": 3
    },
    "entities": [
        { "id": "paper", "type": "item", "name": "Paper", "emoji": "📄", "behavior": "fall" },
        { "id": "plastic", "type": "item", "name": "Plastic", "emoji": "🥤", "behavior": "fall" },
        { "id": "glass", "type": "item", "name": "Glass", "emoji": "🍾", "behavior": "fall" }
    ],
    "upgrade_tree": [
      { "id": "upgrade_belt", "name": "Fast Belt", "effect": "Spawn rate +20%", "cost": 200 },
      { "id": "upgrade_scanner", "name": "Auto-Sorter", "effect": "Auto-sorts 10% of trash", "cost": 500 }
    ],
    "event_triggers": {
      "positive": { "event_name": "City Grant", "effect": "Bonus Points", "duration": "instant" },
      "negative": { "event_name": "Jam", "effect": "Belt stops", "duration": "5s" }
    }
  },
  {
    "business_id": "BIZ_31_OFFICE",
    "name": "BizTycoon",
    "category": "Production & Manufacturing",
    "game_type": "simulation_tycoon",
    "description": "Manage a busy corporate office. Balance employee happiness with productivity.",
    "visual_config": {
      "theme": "realistic",
      "colors": { "primary": "#64748B", "secondary": "#475569", "accent": "#3B82F6", "background": "#F8FAFC" },
      "icon": "🏢"
    },
    "variables": {
      "resources": ["paper", "ink", "coffee"],
      "dynamic_factors": ["morale", "deadlines"],
      "player_inputs": ["salary", "break_time", "office_supplies"]
    },
    "upgrade_tree": [
      { "id": "upgrade_coffee", "name": "Premium Coffee", "effect": "Productivity +10%", "cost": 100, "modifier_target": "speed", "modifier_value": 1.1 },
      { "id": "upgrade_chairs", "name": "Ergo Chairs", "effect": "Happiness +15%", "cost": 250, "modifier_target": "quality", "modifier_value": 1.15 }
    ],
    "event_triggers": {
      "positive": { "event_name": "Big Contract", "effect": "Revenue +500", "duration": "1d" },
      "negative": { "event_name": "Printer Jam", "effect": "Productivity -20%", "duration": "1d" }
    }
  }
];
