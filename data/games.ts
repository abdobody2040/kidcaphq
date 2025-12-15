
import { BusinessSimulation } from "../types";

export const GAMES_DB: BusinessSimulation[] = [
  // --- Retail & Food ---
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
    "scoring": { "base_points": 20, "time_limit": 45 },
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
    "business_id": "BIZ_04_COFFEE",
    "name": "Coffee Cart",
    "category": "Retail & Food",
    "game_type": "simulation_tycoon",
    "description": "Brew the perfect cup. Balance roast strength and milk foam.",
    "visual_config": {
        "theme": "eco",
        "colors": { "primary": "#78350F", "secondary": "#451a03", "accent": "#D97706", "background": "#FFFBEB" },
        "icon": "☕"
    },
    "variables": {
        "resources": ["beans", "milk", "cups"],
        "dynamic_factors": ["morning_rush", "weather"],
        "player_inputs": ["roast_level", "milk_foam", "price"]
    },
    "upgrade_tree": [
        { "id": "up_espresso", "name": "Espresso Machine", "effect": "Speed +30%", "cost": 200 },
        { "id": "up_beans", "name": "Premium Beans", "effect": "Quality +20%", "cost": 150 }
    ],
    "event_triggers": {
        "positive": { "event_name": "Rainy Day", "effect": "Hot coffee demand +50%", "duration": "1d" },
        "negative": { "event_name": "Machine Break", "effect": "Speed -50%", "duration": "1d" }
    }
  },
  {
    "business_id": "BIZ_05_TACO",
    "name": "Taco Truck",
    "category": "Retail & Food",
    "game_type": "matching_game",
    "description": "Build tacos to order! Don't forget the guac.",
    "visual_config": {
        "theme": "light",
        "colors": { "primary": "#F59E0B", "secondary": "#B45309", "accent": "#EF4444", "background": "#FEF3C7" },
        "icon": "🌮"
    },
    "entities": [
        { "id": "shell", "type": "resource", "name": "Shell", "emoji": "🌮" },
        { "id": "meat", "type": "resource", "name": "Meat", "emoji": "🥩" },
        { "id": "lettuce", "type": "resource", "name": "Lettuce", "emoji": "🥬" },
        { "id": "cheese", "type": "resource", "name": "Cheese", "emoji": "🧀" },
        { "id": "salsa", "type": "resource", "name": "Salsa", "emoji": "🍅" },
        { "id": "guac", "type": "resource", "name": "Guac", "emoji": "🥑" }
    ],
    "upgrade_tree": [],
    "event_triggers": { positive: { event_name: "", effect: "", duration: "" }, negative: { event_name: "", effect: "", duration: "" } }
  },
  {
    "business_id": "BIZ_06_ICECREAM",
    "name": "Ice Cream Parlor",
    "category": "Retail & Food",
    "game_type": "simulation_tycoon",
    "description": "Scoop happiness! Keep the freezer cold and flavors fun.",
    "visual_config": {
        "theme": "pastel",
        "colors": { "primary": "#F472B6", "secondary": "#DB2777", "accent": "#60A5FA", "background": "#FDF2F8" },
        "icon": "🍦"
    },
    "variables": {
        "resources": ["cream", "cones", "toppings"],
        "dynamic_factors": ["heat", "kids_out_of_school"],
        "player_inputs": ["scoop_size", "sugar_amount", "price"]
    },
    "upgrade_tree": [
        { "id": "up_freezer", "name": "Deep Freezer", "effect": "Less melting", "cost": 150 },
        { "id": "up_flavors", "name": "Flavor Station", "effect": "Attraction +20%", "cost": 200 }
    ],
    "event_triggers": {
        "positive": { "event_name": "Summer Camp", "effect": "Huge group of kids!", "duration": "1d" },
        "negative": { "event_name": "Brain Freeze", "effect": "Customers eat slower", "duration": "1d" }
    }
  },

  // --- Services & E-Commerce ---
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
    "business_id": "BIZ_13_PETSALON",
    "name": "Pet Salon",
    "category": "Services & E-Commerce",
    "game_type": "simulation_tycoon",
    "description": "Wash and groom cute pets. Keep them calm!",
    "visual_config": {
        "theme": "pastel",
        "colors": { "primary": "#A78BFA", "secondary": "#8B5CF6", "accent": "#F472B6", "background": "#F5F3FF" },
        "icon": "🐩"
    },
    "variables": {
        "resources": ["shampoo", "bows", "treats"],
        "dynamic_factors": ["pet_mood", "cleanliness"],
        "player_inputs": ["scrub_intensity", "water_temp", "treat_frequency"]
    },
    "upgrade_tree": [
        { "id": "up_dryer", "name": "Silent Dryer", "effect": "Pets stay calm", "cost": 300 },
        { "id": "up_shampoo", "name": "Premium Soap", "effect": "Shinier coats (Higher tips)", "cost": 100 }
    ],
    "event_triggers": {
        "positive": { "event_name": "Dog Show", "effect": "High-paying customers", "duration": "1d" },
        "negative": { "event_name": "Muddy Puddle", "effect": "Extra dirty dogs", "duration": "1d" }
    }
  },
  {
    "business_id": "BIZ_14_LAWN",
    "name": "Lawn Master",
    "category": "Services & E-Commerce",
    "game_type": "driving_game",
    "description": "Mow the lawn perfectly before time runs out!",
    "visual_config": {
        "theme": "eco",
        "colors": { "primary": "#22C55E", "secondary": "#15803D", "accent": "#EAB308", "background": "#F0FDF4" },
        "icon": "🚜"
    },
    "entities": [
        { "id": "mower", "type": "resource", "name": "Mower", "emoji": "🚜" },
        { "id": "grass", "type": "target", "name": "Tall Grass", "emoji": "🌾" }
    ],
    "scoring": { "base_points": 10, "time_limit": 60 },
    "upgrade_tree": [],
    "event_triggers": { positive: { event_name: "", effect: "", duration: "" }, negative: { event_name: "", effect: "", duration: "" } }
  },
  {
    "business_id": "BIZ_15_DROPSHIP",
    "name": "Dropship Empire",
    "category": "Services & E-Commerce",
    "game_type": "clicker_idle",
    "description": "Click to process orders! Automate your shipping empire.",
    "visual_config": {
        "theme": "dark",
        "colors": { "primary": "#6366F1", "secondary": "#4F46E5", "accent": "#10B981", "background": "#1E1B4B" },
        "icon": "📦"
    },
    "game_mechanics": { "click_value": 5, "auto_click_rate": 1 },
    "upgrade_tree": [
        { "id": "up_ads", "name": "Social Ads", "effect": "Auto-orders +5/sec", "cost": 200, "modifier_target": "auto_click_rate", "modifier_value": 5 },
        { "id": "up_supplier", "name": "Fast Supplier", "effect": "Click value +10", "cost": 500, "modifier_target": "click_value", "modifier_value": 10 }
    ],
    "event_triggers": { positive: { event_name: "", effect: "", duration: "" }, negative: { event_name: "", effect: "", duration: "" } }
  },
  {
    "business_id": "BIZ_16_IFIX",
    "name": "iFix It",
    "category": "Services & E-Commerce",
    "game_type": "matching_game",
    "description": "Match the correct parts to repair phones and tablets.",
    "visual_config": {
        "theme": "neon",
        "colors": { "primary": "#0EA5E9", "secondary": "#0284C7", "accent": "#FACC15", "background": "#F0F9FF" },
        "icon": "📱"
    },
    "entities": [
        { "id": "screen", "type": "resource", "name": "Screen", "emoji": "📲" },
        { "id": "battery", "type": "resource", "name": "Battery", "emoji": "🔋" },
        { "id": "chip", "type": "resource", "name": "Chip", "emoji": "💾" },
        { "id": "screw", "type": "resource", "name": "Screw", "emoji": "🔩" },
        { "id": "wire", "type": "resource", "name": "Wire", "emoji": "🔌" },
        { "id": "case", "type": "resource", "name": "Case", "emoji": "🛡️" }
    ],
    "upgrade_tree": [],
    "event_triggers": { positive: { event_name: "", effect: "", duration: "" }, negative: { event_name: "", effect: "", duration: "" } }
  },

  // --- Production & Manufacturing ---
  {
    "business_id": "BIZ_17_FACTORY",
    "name": "Toy Factory",
    "category": "Production & Manufacturing",
    "game_type": "simulation_tycoon",
    "description": "Manage the assembly line. Speed vs Quality.",
    "visual_config": {
        "theme": "realistic",
        "colors": { "primary": "#64748B", "secondary": "#475569", "accent": "#F59E0B", "background": "#F1F5F9" },
        "icon": "🏭"
    },
    "variables": {
        "resources": ["plastic", "paint", "boxes"],
        "dynamic_factors": ["machine_heat", "worker_energy"],
        "player_inputs": ["conveyor_speed", "qc_check", "batch_size"]
    },
    "upgrade_tree": [
        { "id": "up_robot", "name": "Robot Arm", "effect": "Speed +50%", "cost": 500 },
        { "id": "up_paint", "name": "Auto-Painter", "effect": "Quality +20%", "cost": 300 }
    ],
    "event_triggers": {
        "positive": { "event_name": "Holiday Rush", "effect": "Orders x3", "duration": "1d" },
        "negative": { "event_name": "Power Outage", "effect": "Speed -80%", "duration": "1d" }
    }
  },
  {
    "business_id": "BIZ_18_PRINTSHOP",
    "name": "3D Print Shop",
    "category": "Production & Manufacturing",
    "game_type": "matching_game",
    "description": "Match the filament color to the 3D model order.",
    "visual_config": {
        "theme": "neon",
        "colors": { "primary": "#8B5CF6", "secondary": "#7C3AED", "accent": "#C084FC", "background": "#F3E8FF" },
        "icon": "🖨️"
    },
    "entities": [
        { "id": "red_fil", "type": "resource", "name": "Red", "emoji": "🔴" },
        { "id": "blue_fil", "type": "resource", "name": "Blue", "emoji": "🔵" },
        { "id": "green_fil", "type": "resource", "name": "Green", "emoji": "🟢" },
        { "id": "yellow_fil", "type": "resource", "name": "Yellow", "emoji": "🟡" },
        { "id": "white_fil", "type": "resource", "name": "White", "emoji": "⚪" },
        { "id": "black_fil", "type": "resource", "name": "Black", "emoji": "⚫" }
    ],
    "upgrade_tree": [],
    "event_triggers": { positive: { event_name: "", effect: "", duration: "" }, negative: { event_name: "", effect: "", duration: "" } }
  },
  {
    "business_id": "BIZ_19_PUBLISHING",
    "name": "Book Publishing",
    "category": "Production & Manufacturing",
    "game_type": "simulation_tycoon",
    "description": "Print and sell bestsellers. Manage ink and paper.",
    "visual_config": {
        "theme": "light",
        "colors": { "primary": "#713F12", "secondary": "#451a03", "accent": "#FCD34D", "background": "#FFFBEB" },
        "icon": "📚"
    },
    "variables": {
        "resources": ["paper", "ink", "glue"],
        "dynamic_factors": ["trend", "reviews"],
        "player_inputs": ["print_quality", "cover_art_budget", "marketing_spend"]
    },
    "upgrade_tree": [
        { "id": "up_press", "name": "Offset Press", "effect": "Bulk printing cheaper", "cost": 400 },
        { "id": "up_editor", "name": "Star Editor", "effect": "Better reviews", "cost": 250 }
    ],
    "event_triggers": {
        "positive": { "event_name": "Book Club Pick", "effect": "Sales x2", "duration": "1d" },
        "negative": { "event_name": "Typo Found", "effect": "Reprint cost", "duration": "1d" }
    }
  },
  {
    "business_id": "BIZ_20_BATTERY",
    "name": "Eco Battery Co.",
    "category": "Production & Manufacturing",
    "game_type": "simulation_tycoon",
    "description": "Manufacture green batteries. Balance charge and safety.",
    "visual_config": {
        "theme": "eco",
        "colors": { "primary": "#16A34A", "secondary": "#15803D", "accent": "#22C55E", "background": "#F0FDF4" },
        "icon": "🔋"
    },
    "variables": {
        "resources": ["lithium", "metal", "plastic"],
        "dynamic_factors": ["charge_capacity", "heat"],
        "player_inputs": ["voltage", "safety_check", "production_speed"]
    },
    "upgrade_tree": [],
    "event_triggers": { positive: { event_name: "", effect: "", duration: "" }, negative: { event_name: "", effect: "", duration: "" } }
  },
  {
    "business_id": "BIZ_31_OFFICE",
    "name": "BizTycoon",
    "category": "Production & Manufacturing",
    "game_type": "simulation_tycoon",
    "description": "Manage a busy corporate office.",
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
  },

  // --- Creative & Events ---
  {
    "business_id": "BIZ_21_PARTY",
    "name": "Party Planner",
    "category": "Creative & Events",
    "game_type": "simulation_tycoon",
    "description": "Throw the best parties! Manage music, food, and vibes.",
    "visual_config": {
        "theme": "neon",
        "colors": { "primary": "#C026D3", "secondary": "#A21CAF", "accent": "#E879F9", "background": "#FAE8FF" },
        "icon": "🎉"
    },
    "variables": {
        "resources": ["balloons", "cake", "confetti"],
        "dynamic_factors": ["fun_meter", "noise_level"],
        "player_inputs": ["music_volume", "snack_variety", "decor_budget"]
    },
    "upgrade_tree": [
        { "id": "up_dj", "name": "Pro DJ", "effect": "Fun meter maxed", "cost": 300 },
        { "id": "up_lights", "name": "Laser Lights", "effect": "Cool factor +50%", "cost": 200 }
    ],
    "event_triggers": {
        "positive": { "event_name": "Celebrity Guest", "effect": "Reputation up", "duration": "1d" },
        "negative": { "event_name": "Rain on Parade", "effect": "Outdoor party ruined", "duration": "1d" }
    }
  },
  {
    "business_id": "BIZ_22_ROCKSTAR",
    "name": "Rock Star Tour",
    "category": "Creative & Events",
    "game_type": "rhythm_game",
    "description": "Play the guitar solo perfectly to wow the crowd.",
    "visual_config": {
        "theme": "dark",
        "colors": { "primary": "#EF4444", "secondary": "#991B1B", "accent": "#FCA5A5", "background": "#18181B" },
        "icon": "🎸"
    },
    "game_mechanics": { "spawn_rate": 1000 },
    "entities": [
        { "id": "note", "type": "item", "name": "Note", "emoji": "🎵" },
        { "id": "fire", "type": "item", "name": "Fire", "emoji": "🔥" }
    ],
    "upgrade_tree": [],
    "event_triggers": { positive: { event_name: "", effect: "", duration: "" }, negative: { event_name: "", effect: "", duration: "" } }
  },
  {
    "business_id": "BIZ_23_ARTDEALER",
    "name": "Art Dealer",
    "category": "Creative & Events",
    "game_type": "simulation_tycoon",
    "description": "Buy low, sell high! Spot the masterpieces.",
    "visual_config": {
        "theme": "light",
        "colors": { "primary": "#0F172A", "secondary": "#020617", "accent": "#64748B", "background": "#F1F5F9" },
        "icon": "🎨"
    },
    "variables": {
        "resources": ["canvas", "paint", "frames"],
        "dynamic_factors": ["trend", "artist_fame"],
        "player_inputs": ["bid_amount", "gallery_entry_fee", "wine_quality"]
    },
    "upgrade_tree": [],
    "event_triggers": { positive: { event_name: "", effect: "", duration: "" }, negative: { event_name: "", effect: "", duration: "" } }
  },
  {
    "business_id": "BIZ_24_CRAFT",
    "name": "Craft Corner",
    "category": "Creative & Events",
    "game_type": "simulation_tycoon",
    "description": "Make handmade jewelry. Precision matters.",
    "visual_config": {
        "theme": "pastel",
        "colors": { "primary": "#FBBF24", "secondary": "#D97706", "accent": "#FDE68A", "background": "#FFFBEB" },
        "icon": "🧵"
    },
    "variables": {
        "resources": ["beads", "string", "clasps"],
        "dynamic_factors": ["patience", "design"],
        "player_inputs": ["complexity", "price", "packaging"]
    },
    "upgrade_tree": [],
    "event_triggers": { positive: { event_name: "", effect: "", duration: "" }, negative: { event_name: "", effect: "", duration: "" } }
  },

  // --- Digital & Tech ---
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
    "business_id": "BIZ_26_CYBER",
    "name": "Cyber Defense",
    "category": "Digital & Tech",
    "game_type": "clicker_idle",
    "description": "Block hackers! Tap rapidly to build firewalls.",
    "visual_config": {
        "theme": "neon",
        "colors": { "primary": "#10B981", "secondary": "#059669", "accent": "#34D399", "background": "#022C22" },
        "icon": "🛡️"
    },
    "game_mechanics": { "click_value": 10, "auto_click_rate": 2 },
    "upgrade_tree": [],
    "event_triggers": { positive: { event_name: "", effect: "", duration: "" }, negative: { event_name: "", effect: "", duration: "" } }
  },
  {
    "business_id": "BIZ_27_YOUTUBE",
    "name": "Content Creator",
    "category": "Digital & Tech",
    "game_type": "simulation_tycoon",
    "description": "Record videos, edit, and upload. Gain subscribers!",
    "visual_config": {
        "theme": "light",
        "colors": { "primary": "#EF4444", "secondary": "#B91C1C", "accent": "#FCA5A5", "background": "#FFF1F2" },
        "icon": "📹"
    },
    "variables": {
        "resources": ["energy", "ideas", "storage"],
        "dynamic_factors": ["viral_chance", "burnout"],
        "player_inputs": ["video_length", "editing_quality", "clickbait_level"]
    },
    "upgrade_tree": [
        { "id": "up_camera", "name": "4K Camera", "effect": "Quality maxed", "cost": 500 },
        { "id": "up_editor", "name": "Editor Hire", "effect": "Speed +50%", "cost": 300 }
    ],
    "event_triggers": {
        "positive": { "event_name": "Viral Hit", "effect": "Views x10", "duration": "1d" },
        "negative": { "event_name": "Internet Down", "effect": "No uploads", "duration": "1d" }
    }
  },
  {
    "business_id": "BIZ_28_SPACE",
    "name": "Mars Colony Supply",
    "category": "Digital & Tech",
    "game_type": "simulation_tycoon",
    "description": "Manage oxygen and food for the colony.",
    "visual_config": {
        "theme": "dark",
        "colors": { "primary": "#EA580C", "secondary": "#9A3412", "accent": "#FDBA74", "background": "#431407" },
        "icon": "🚀"
    },
    "variables": {
        "resources": ["oxygen", "water", "potatoes"],
        "dynamic_factors": ["radiation", "morale"],
        "player_inputs": ["ration_size", "work_shift", "recycling_rate"]
    },
    "upgrade_tree": [],
    "event_triggers": { positive: { event_name: "", effect: "", duration: "" }, negative: { event_name: "", effect: "", duration: "" } }
  },

  // --- Social Impact ---
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
    "business_id": "BIZ_30_FAIRTRADE",
    "name": "Fair Trade Market",
    "category": "Social Impact",
    "game_type": "simulation_tycoon",
    "description": "Sell ethically sourced goods. Happiness > Profit.",
    "visual_config": {
        "theme": "eco",
        "colors": { "primary": "#15803D", "secondary": "#14532D", "accent": "#86EFAC", "background": "#ECFDF5" },
        "icon": "🤝"
    },
    "variables": {
        "resources": ["cocoa", "cotton", "coffee"],
        "dynamic_factors": ["farmer_trust", "customer_loyalty"],
        "player_inputs": ["farmer_pay", "price_markup", "community_donation"]
    },
    "upgrade_tree": [],
    "event_triggers": { positive: { event_name: "", effect: "", duration: "" }, negative: { event_name: "", effect: "", duration: "" } }
  },
  {
    "business_id": "BIZ_32_BIKE",
    "name": "Bike Repair",
    "category": "Social Impact",
    "game_type": "matching_game",
    "description": "Fix bikes to encourage green transport!",
    "visual_config": {
        "theme": "eco",
        "colors": { "primary": "#0D9488", "secondary": "#0F766E", "accent": "#5EEAD4", "background": "#F0FDFA" },
        "icon": "🚲"
    },
    "entities": [
        { "id": "wheel", "type": "resource", "name": "Wheel", "emoji": "🛞" },
        { "id": "chain", "type": "resource", "name": "Chain", "emoji": "🔗" },
        { "id": "pedal", "type": "resource", "name": "Pedal", "emoji": "🦶" }
    ],
    "upgrade_tree": [],
    "event_triggers": { positive: { event_name: "", effect: "", duration: "" }, negative: { event_name: "", effect: "", duration: "" } }
  },
  // --- New Tycoon Exclusive ---
  {
    "business_id": "BIZ_NEGOTIATION",
    "name": "Negotiation Battle",
    "category": "Tycoon Exclusive",
    "game_type": "negotiation_game",
    "description": "Master the art of the deal. Face tough suppliers and win.",
    "visual_config": {
        "theme": "dark",
        "colors": { "primary": "#EAB308", "secondary": "#A16207", "accent": "#1E293B", "background": "#0F172A" },
        "icon": "🤝"
    },
    "upgrade_tree": [],
    "variables": { resources: [], dynamic_factors: [], player_inputs: [] },
    "event_triggers": { positive: { event_name: "", effect: "", duration: "" }, negative: { event_name: "", effect: "", duration: "" } }
  }
];
