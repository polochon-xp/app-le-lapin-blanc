from fastapi import FastAPI, APIRouter, HTTPException, Depends, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, EmailStr
from typing import List, Optional
import uuid
from datetime import datetime, timedelta
from passlib.context import CryptContext
import jwt
from jwt.exceptions import InvalidTokenError
import random


ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# JWT Configuration
SECRET_KEY = "your-secret-key-here-change-in-production"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

# Password hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
security = HTTPBearer()

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Static game data
ATTACKS_DATA = [
    {"id": 1, "name": "Frappe éclair", "description": "Une attaque rapide qui réduit temporairement une stat ciblée", "effect_type": "stat_reduce", "effect_value": 10, "duration_hours": 24},
    {"id": 2, "name": "Brèche mentale", "description": "Diminue la concentration d'un adversaire pour 24h", "effect_type": "concentration_loss", "effect_value": 15, "duration_hours": 24},
    {"id": 3, "name": "Blocage d'énergie", "description": "Vide une partie de la jauge d'énergie adverse", "effect_type": "energy_drain", "effect_value": 30, "duration_hours": 0},
    {"id": 4, "name": "Fardeau caché", "description": "Ajoute un handicap de progression sur une mission", "effect_type": "mission_handicap", "effect_value": 50, "duration_hours": 24},
    {"id": 5, "name": "Piège temporel", "description": "Retarde l'effet des missions accomplies de 12h", "effect_type": "mission_delay", "effect_value": 12, "duration_hours": 12},
    {"id": 6, "name": "Drain d'effort", "description": "Réduit de 10% l'EXP gagnée par l'ennemi ce jour", "effect_type": "exp_reduction", "effect_value": 10, "duration_hours": 24},
    {"id": 7, "name": "Surcharge", "description": "L'adversaire doit dépenser 2 missions pour en valider 1", "effect_type": "mission_cost", "effect_value": 2, "duration_hours": 24},
    {"id": 8, "name": "Confusion", "description": "Réduit aléatoirement une stat (sport, travail, etc.)", "effect_type": "random_stat_loss", "effect_value": 5, "duration_hours": 24},
    {"id": 9, "name": "Silence", "description": "Empêche l'usage d'une attaque dans une stat pendant 24h", "effect_type": "attack_block", "effect_value": 1, "duration_hours": 24},
    {"id": 10, "name": "Malédiction", "description": "L'adversaire perd 5 ELO à minuit", "effect_type": "elo_loss", "effect_value": 5, "duration_hours": 0},
    {"id": 11, "name": "Douleur résiduelle", "description": "Réduit les PV du joueur attaqué de 10%", "effect_type": "health_percentage", "effect_value": 10, "duration_hours": 0},
    {"id": 12, "name": "Brise-armure", "description": "Diminue l'effet d'un badge de défense", "effect_type": "defense_break", "effect_value": 1, "duration_hours": 24},
    {"id": 13, "name": "Poison lent", "description": "-2 ELO par jour pendant 3 jours", "effect_type": "elo_poison", "effect_value": 2, "duration_hours": 72},
    {"id": 14, "name": "Fissure intérieure", "description": "Annule la prochaine mission validée", "effect_type": "mission_cancel", "effect_value": 1, "duration_hours": 24},
    {"id": 15, "name": "Voleur d'âme", "description": "Vole 5 ELO d'un adversaire", "effect_type": "elo_steal", "effect_value": 5, "duration_hours": 0},
    {"id": 16, "name": "Blocage mental", "description": "L'adversaire ne peut plus progresser en 'création'", "effect_type": "stat_block", "effect_value": 1, "duration_hours": 24, "target_stat": "creation"},
    {"id": 17, "name": "Brûlure de l'esprit", "description": "Retire un titre bonus pendant 1 jour", "effect_type": "title_disable", "effect_value": 1, "duration_hours": 24},
    {"id": 18, "name": "Entrave physique", "description": "L'adversaire perd un bonus en 'sport'", "effect_type": "stat_malus", "effect_value": 20, "duration_hours": 24, "target_stat": "sport"},
    {"id": 19, "name": "Érosion", "description": "Réduit de 50% l'effet de la prochaine mission", "effect_type": "mission_efficiency", "effect_value": 50, "duration_hours": 24},
    {"id": 20, "name": "Paralysie", "description": "L'adversaire ne peut plus jouer de carte pendant 24h", "effect_type": "card_block", "effect_value": 1, "duration_hours": 24},
    {"id": 21, "name": "Vol de temps", "description": "L'adversaire doit attendre 1h de plus avant d'utiliser une carte", "effect_type": "card_cooldown", "effect_value": 1, "duration_hours": 24},
    {"id": 22, "name": "Régression", "description": "Fait baisser une stat d'un rang temporairement", "effect_type": "stat_regression", "effect_value": 1, "duration_hours": 24},
    {"id": 23, "name": "Siphon d'énergie", "description": "Prend 20% d'énergie de l'ennemi", "effect_type": "energy_steal", "effect_value": 20, "duration_hours": 0},
    {"id": 24, "name": "Choc brutal", "description": "-10 PV directs", "effect_type": "health_loss", "effect_value": 10, "duration_hours": 0},
    {"id": 25, "name": "Coup ciblé", "description": "Vise une stat précise et bloque sa progression 24h", "effect_type": "targeted_block", "effect_value": 1, "duration_hours": 24},
    {"id": 26, "name": "Fatigue", "description": "Réduit les points gagnés en 'travail'", "effect_type": "stat_malus", "effect_value": 15, "duration_hours": 24, "target_stat": "travail"},
    {"id": 27, "name": "Perturbation", "description": "Annule l'effet positif de la dernière mission", "effect_type": "mission_reverse", "effect_value": 1, "duration_hours": 0},
    {"id": 28, "name": "Lien brisé", "description": "Désactive une combinaison de badges", "effect_type": "badge_disable", "effect_value": 1, "duration_hours": 24},
    {"id": 29, "name": "Griffes de l'ombre", "description": "Attaque surprise (-3 ELO)", "effect_type": "elo_loss", "effect_value": 3, "duration_hours": 0},
    {"id": 30, "name": "Voile toxique", "description": "Réduit de moitié la récupération de santé", "effect_type": "health_regen_malus", "effect_value": 50, "duration_hours": 24},
    {"id": 31, "name": "Tempête intérieure", "description": "Annule 2 missions en cours", "effect_type": "mission_cancel_multiple", "effect_value": 2, "duration_hours": 0},
    {"id": 32, "name": "Souffle glacial", "description": "Empêche la progression en 'adaptabilité'", "effect_type": "stat_block", "effect_value": 1, "duration_hours": 24, "target_stat": "adaptabilite"},
    {"id": 33, "name": "Frappe spectrale", "description": "Ignore les défenses et inflige -5 ELO", "effect_type": "elo_loss_pierce", "effect_value": 5, "duration_hours": 0},
    {"id": 34, "name": "Hémorragie", "description": "Perte de 1 PV par mission validée", "effect_type": "health_loss_per_mission", "effect_value": 1, "duration_hours": 24},
    {"id": 35, "name": "Douleur fantôme", "description": "Double le coût énergétique d'une mission", "effect_type": "energy_cost_double", "effect_value": 2, "duration_hours": 24},
    {"id": 36, "name": "Impact écrasant", "description": "Réduit tous les gains de la journée de 20%", "effect_type": "global_malus", "effect_value": 20, "duration_hours": 24},
    {"id": 37, "name": "Détournement", "description": "La prochaine mission adverse profite à l'attaquant", "effect_type": "mission_steal", "effect_value": 1, "duration_hours": 24},
    {"id": 38, "name": "Châtiment", "description": "Inflige -1 ELO pour chaque mission validée ce jour", "effect_type": "elo_loss_per_mission", "effect_value": 1, "duration_hours": 24},
    {"id": 39, "name": "Épine invisible", "description": "Toute mission validée coûte 1 PV", "effect_type": "health_cost_per_mission", "effect_value": 1, "duration_hours": 24},
    {"id": 40, "name": "Sabotage", "description": "Empêche un badge de s'activer", "effect_type": "badge_sabotage", "effect_value": 1, "duration_hours": 24},
    {"id": 41, "name": "Silence pesant", "description": "L'adversaire ne peut pas envoyer d'attaque", "effect_type": "attack_silence", "effect_value": 1, "duration_hours": 24},
    {"id": 42, "name": "Sacrifice noir", "description": "Le joueur perd 5 PV mais vole 10 ELO", "effect_type": "sacrifice_steal", "effect_value": 10, "duration_hours": 0, "cost_health": 5},
    {"id": 43, "name": "Inversion", "description": "Transforme le gain d'EXP en perte", "effect_type": "exp_inversion", "effect_value": 1, "duration_hours": 24},
    {"id": 44, "name": "Paralysie des sens", "description": "Empêche une stat de progresser jusqu'à minuit", "effect_type": "stat_paralysis", "effect_value": 1, "duration_hours": 24},
    {"id": 45, "name": "Frappe du chaos", "description": "Effet aléatoire parmi 3 (perte PV, ELO ou énergie)", "effect_type": "chaos_strike", "effect_value": 1, "duration_hours": 0},
    {"id": 46, "name": "Tourment", "description": "-2 ELO par attaque subie", "effect_type": "elo_loss_per_attack", "effect_value": 2, "duration_hours": 24},
    {"id": 47, "name": "Dague cachée", "description": "Inflige -1 ELO en secret", "effect_type": "elo_loss_hidden", "effect_value": 1, "duration_hours": 0},
    {"id": 48, "name": "Déferlante", "description": "Attaque massive, -5% sur toutes les stats", "effect_type": "all_stats_malus", "effect_value": 5, "duration_hours": 24},
    {"id": 49, "name": "Faim de victoire", "description": "Vole une mission validée", "effect_type": "mission_steal_completed", "effect_value": 1, "duration_hours": 0},
    {"id": 50, "name": "Ruine", "description": "Réinitialise l'énergie de l'ennemi à zéro", "effect_type": "energy_reset", "effect_value": 0, "duration_hours": 0}
]

DEFENSES_DATA = [
    {"id": 1, "name": "Bouclier de fer", "description": "Annule la première attaque reçue chaque jour", "protection_type": "attack_block", "effect_value": 1},
    {"id": 2, "name": "Aura protectrice", "description": "Réduit de moitié les effets des malédictions", "protection_type": "curse_reduce", "effect_value": 50},
    {"id": 3, "name": "Régénération", "description": "Rend 5 PV à chaque mission validée", "protection_type": "health_regen", "effect_value": 5},
    {"id": 4, "name": "Mur de volonté", "description": "Empêche les pertes d'ELO pendant 24h", "protection_type": "elo_immunity", "effect_value": 24},
    {"id": 5, "name": "Armure d'esprit", "description": "Immunité à une stat (choisie)", "protection_type": "stat_immunity", "effect_value": 1},
    {"id": 6, "name": "Grâce divine", "description": "Une attaque reçue est renvoyée à l'expéditeur", "protection_type": "reflect", "effect_value": 1},
    {"id": 7, "name": "Esprit combatif", "description": "Chaque attaque subie donne +1 ELO", "protection_type": "elo_gain", "effect_value": 1},
    {"id": 8, "name": "Stabilité", "description": "Les missions ne peuvent plus être annulées", "protection_type": "mission_immunity", "effect_value": 1},
    {"id": 9, "name": "Gardien", "description": "Bloque toutes les attaques liées à l'énergie", "protection_type": "energy_immunity", "effect_value": 1},
    {"id": 10, "name": "Ancre de réalité", "description": "Neutralise les effets aléatoires", "protection_type": "random_immunity", "effect_value": 1}
]

TITLES_DATA = [
    {"level_required": 1, "name": "Novice", "description": "Découvre le système, gains normaux", "bonus_type": "none", "bonus_value": 0},
    {"level_required": 5, "name": "Initié", "description": "+1% gains sur toutes missions", "bonus_type": "all_missions", "bonus_value": 1},
    {"level_required": 10, "name": "Disciple", "description": "Peut stocker 2 cartes d'attaque", "bonus_type": "attack_storage", "bonus_value": 2},
    {"level_required": 20, "name": "Combattant", "description": "+2% gains en sport et travail", "bonus_type": "sport_travail", "bonus_value": 2},
    {"level_required": 30, "name": "Érudit", "description": "Bonus +2% en lecture et création", "bonus_type": "lecture_creation", "bonus_value": 2},
    {"level_required": 40, "name": "Stratège", "description": "Peut bloquer une stat ennemie 1 fois/semaine", "bonus_type": "stat_block", "bonus_value": 1},
    {"level_required": 50, "name": "Maître", "description": "+5% sur toutes missions", "bonus_type": "all_missions", "bonus_value": 5},
    {"level_required": 75, "name": "Champion", "description": "Annule une attaque aléatoire par jour", "bonus_type": "attack_immunity", "bonus_value": 1},
    {"level_required": 100, "name": "Légende", "description": "+10% sur toutes missions et immunité 1 fois/semaine", "bonus_type": "legend", "bonus_value": 10}
]

# Create the main app without a prefix
app = FastAPI()

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

# Authentication functions
def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password):
    return pwd_context.hash(password)

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    try:
        token = credentials.credentials
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Could not validate credentials",
                headers={"WWW-Authenticate": "Bearer"},
            )
    except InvalidTokenError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    user = await db.users.find_one({"username": username})
    if user is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )
    return User(**user)


# Define Models
class StatusCheck(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    client_name: str
    timestamp: datetime = Field(default_factory=datetime.utcnow)

class StatusCheckCreate(BaseModel):
    client_name: str

# Attack/Defense/Title Models
class Attack(BaseModel):
    id: int
    name: str
    description: str
    effect_type: str  # "elo_loss", "stat_block", "energy_drain", etc.
    effect_value: int
    target_stat: Optional[str] = None  # "travail", "sport", etc. ou None si global
    duration_hours: int = 0  # 0 = instantané, 24 = 1 jour, etc.

class Defense(BaseModel):
    id: int
    name: str
    description: str
    protection_type: str
    effect_value: int

class Title(BaseModel):
    level_required: int
    name: str
    description: str
    bonus_type: str
    bonus_value: int

class UserAttack(BaseModel):
    attack_id: int
    obtained_at: datetime = Field(default_factory=datetime.utcnow)
    used: bool = False
    used_at: Optional[datetime] = None

class AttackAction(BaseModel):
    target_username: str
    attack_id: int
    target_stat: Optional[str] = None
    effect_target: str  # "elo" ou "level"

# User Models (updated)
class UserCreate(BaseModel):
    username: str
    email: EmailStr
    password: str

class UserLogin(BaseModel):
    username: str
    password: str

class User(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    username: str
    email: EmailStr
    created_at: datetime = Field(default_factory=datetime.utcnow)
    is_online: bool = False
    last_login: Optional[datetime] = None
    stats: dict = Field(default_factory=lambda: {
        "travail": {"level": 0, "xp": 0, "maxXp": 100, "elo": 1200},
        "sport": {"level": 0, "xp": 0, "maxXp": 100, "elo": 1200},
        "creation": {"level": 0, "xp": 0, "maxXp": 100, "elo": 1200},
        "lecture": {"level": 0, "xp": 0, "maxXp": 100, "elo": 1200},
        "adaptabilite": {"level": 0, "xp": 0, "maxXp": 100, "elo": 1200}
    })
    friends: List[str] = Field(default_factory=list)
    club_id: Optional[str] = None
    attacks: List[UserAttack] = Field(default_factory=list)
    defenses: List[int] = Field(default_factory=list)
    current_title: Optional[str] = "Novice"
    health: int = 100
    energy: int = 100

class Token(BaseModel):
    access_token: str
    token_type: str

class UserProfile(BaseModel):
    id: str
    username: str
    stats: dict
    is_online: bool
    last_login: Optional[datetime] = None

# Attack/Card endpoints
@api_router.get("/attacks")
async def get_all_attacks():
    """Récupère toutes les attaques disponibles"""
    return ATTACKS_DATA

@api_router.get("/defenses")
async def get_all_defenses():
    """Récupère toutes les défenses disponibles"""
    return DEFENSES_DATA

@api_router.get("/titles")
async def get_all_titles():
    """Récupère tous les titres disponibles"""
    return TITLES_DATA

@api_router.get("/user/attacks")
async def get_user_attacks(current_user: User = Depends(get_current_user)):
    """Récupère les attaques d'un utilisateur"""
    available_attacks = []
    for user_attack in current_user.attacks:
        if not user_attack.used:
            attack_data = next((a for a in ATTACKS_DATA if a["id"] == user_attack.attack_id), None)
            if attack_data:
                available_attacks.append({
                    **attack_data,
                    "obtained_at": user_attack.obtained_at
                })
    return available_attacks

@api_router.post("/user/attack")
async def use_attack(attack_action: AttackAction, current_user: User = Depends(get_current_user)):
    """Utilise une attaque contre un autre joueur"""
    # Vérifier que l'utilisateur possède cette attaque
    user_attack = next((ua for ua in current_user.attacks if ua.attack_id == attack_action.attack_id and not ua.used), None)
    if not user_attack:
        raise HTTPException(status_code=400, detail="Attaque non disponible")
    
    # Vérifier que la cible existe
    target_user = await db.users.find_one({"username": attack_action.target_username})
    if not target_user:
        raise HTTPException(status_code=404, detail="Utilisateur cible non trouvé")
    
    # Marquer l'attaque comme utilisée
    await db.users.update_one(
        {"username": current_user.username, "attacks.attack_id": attack_action.attack_id},
        {"$set": {"attacks.$.used": True, "attacks.$.used_at": datetime.utcnow()}}
    )
    
    # Créer l'action d'attaque (sera appliquée à minuit ou à la connexion)
    attack_effect = {
        "attacker": current_user.username,
        "target": attack_action.target_username,
        "attack_id": attack_action.attack_id,
        "target_stat": attack_action.target_stat,
        "effect_target": attack_action.effect_target,
        "created_at": datetime.utcnow(),
        "applied": False
    }
    
    await db.attack_actions.insert_one(attack_effect)
    
    return {"message": f"Attaque envoyée vers {attack_action.target_username}", "attack_id": attack_action.attack_id}

@api_router.post("/user/level-up")
async def level_up_user(stat_name: str, current_user: User = Depends(get_current_user)):
    """Fait monter un utilisateur de niveau et lui donne une attaque aléatoire"""
    if stat_name not in current_user.stats:
        raise HTTPException(status_code=400, detail="Stat non valide")
    
    # Incrémenter le niveau
    current_stat = current_user.stats[stat_name]
    new_level = current_stat["level"] + 1
    
    # Donner une attaque aléatoire
    random_attack_id = random.randint(1, 50)
    new_attack = UserAttack(attack_id=random_attack_id)
    
    # Mettre à jour en base
    await db.users.update_one(
        {"username": current_user.username},
        {
            "$set": {f"stats.{stat_name}.level": new_level},
            "$push": {"attacks": new_attack.dict()}
        }
    )
    
    attack_info = next((a for a in ATTACKS_DATA if a["id"] == random_attack_id), None)
    
    return {
        "message": f"Niveau augmenté en {stat_name}",
        "new_level": new_level,
        "attack_gained": attack_info
    }

@api_router.get("/user/pending-attacks")
async def get_pending_attacks(current_user: User = Depends(get_current_user)):
    """Récupère les attaques en attente d'application pour l'utilisateur"""
    pending = await db.attack_actions.find({"target": current_user.username, "applied": False}).to_list(100)
    
    attack_details = []
    for attack in pending:
        attack_data = next((a for a in ATTACKS_DATA if a["id"] == attack["attack_id"]), None)
        if attack_data:
            attack_details.append({
                "attacker": attack["attacker"],
                "attack": attack_data,
                "target_stat": attack.get("target_stat"),
                "effect_target": attack.get("effect_target"),
                "created_at": attack["created_at"]
            })
    
    return attack_details

@api_router.post("/user/apply-pending-attacks")
async def apply_pending_attacks(current_user: User = Depends(get_current_user)):
    """Applique toutes les attaques en attente pour l'utilisateur connecté"""
    pending = await db.attack_actions.find({"target": current_user.username, "applied": False}).to_list(100)
    
    effects_applied = []
    current_stats = current_user.stats.copy()
    current_health = current_user.health
    current_energy = current_user.energy
    
    for attack in pending:
        attack_data = next((a for a in ATTACKS_DATA if a["id"] == attack["attack_id"]), None)
        if not attack_data:
            continue
            
        effect_type = attack_data["effect_type"]
        effect_value = attack_data["effect_value"]
        target_stat = attack.get("target_stat")
        effect_target = attack.get("effect_target", "elo")
        
        # Appliquer l'effet selon le type
        if effect_type == "elo_loss":
            if target_stat and target_stat in current_stats:
                current_stats[target_stat]["elo"] = max(0, current_stats[target_stat]["elo"] - effect_value)
            else:
                # Appliquer sur toutes les stats
                for stat_name in current_stats:
                    current_stats[stat_name]["elo"] = max(0, current_stats[stat_name]["elo"] - effect_value)
        
        elif effect_type == "elo_steal":
            if target_stat and target_stat in current_stats:
                stolen = min(effect_value, current_stats[target_stat]["elo"])
                current_stats[target_stat]["elo"] -= stolen
                # Créditer l'attaquant (à implémenter si nécessaire)
        
        elif effect_type == "health_loss":
            current_health = max(0, current_health - effect_value)
        
        elif effect_type == "health_percentage":
            current_health = max(0, current_health - (current_health * effect_value // 100))
        
        elif effect_type == "energy_drain":
            current_energy = max(0, current_energy - effect_value)
        
        elif effect_type == "energy_reset":
            current_energy = 0
        
        elif effect_type == "energy_steal":
            stolen = min(effect_value, current_energy)
            current_energy -= stolen
        
        effects_applied.append({
            "attack_name": attack_data["name"],
            "attacker": attack["attacker"],
            "effect": attack_data["description"]
        })
    
    # Mettre à jour l'utilisateur en base
    await db.users.update_one(
        {"username": current_user.username},
        {
            "$set": {
                "stats": current_stats,
                "health": current_health,
                "energy": current_energy
            }
        }
    )
    
    # Marquer les attaques comme appliquées
    await db.attack_actions.update_many(
        {"target": current_user.username, "applied": False},
        {"$set": {"applied": True, "applied_at": datetime.utcnow()}}
    )
    
    return {"effects_applied": effects_applied, "total_attacks": len(pending)}

@api_router.get("/user/titles")
async def get_user_titles(current_user: User = Depends(get_current_user)):
    """Récupère les titres disponibles pour l'utilisateur selon son niveau"""
    # Calculer le niveau total de l'utilisateur
    total_level = sum(stat["level"] for stat in current_user.stats.values())
    
    available_titles = []
    for title in TITLES_DATA:
        if total_level >= title["level_required"]:
            available_titles.append({
                **title,
                "unlocked": True,
                "current": title["name"] == current_user.current_title
            })
        else:
            available_titles.append({
                **title,
                "unlocked": False,
                "current": False
            })
    
    return {
        "total_level": total_level,
        "current_title": current_user.current_title,
        "titles": available_titles
    }

@api_router.post("/user/select-title")
async def select_title(title_name: str, current_user: User = Depends(get_current_user)):
    """Permet à l'utilisateur de choisir un titre"""
    # Calculer le niveau total
    total_level = sum(stat["level"] for stat in current_user.stats.values())
    
    # Vérifier que le titre est disponible
    title = next((t for t in TITLES_DATA if t["name"] == title_name), None)
    if not title:
        raise HTTPException(status_code=404, detail="Titre non trouvé")
    
    if total_level < title["level_required"]:
        raise HTTPException(status_code=400, detail="Niveau insuffisant pour ce titre")
    
    # Mettre à jour le titre actuel
    await db.users.update_one(
        {"username": current_user.username},
        {"$set": {"current_title": title_name}}
    )
    
    return {"message": f"Titre '{title_name}' sélectionné", "title": title}

# Authentication endpoints
@api_router.post("/auth/register", response_model=Token)
async def register(user_data: UserCreate):
    # Vérifier si l'utilisateur existe déjà
    existing_user = await db.users.find_one({"$or": [{"username": user_data.username}, {"email": user_data.email}]})
    if existing_user:
        if existing_user.get("username") == user_data.username:
            raise HTTPException(status_code=400, detail="Nom d'utilisateur déjà pris")
        else:
            raise HTTPException(status_code=400, detail="Email déjà utilisé")
    
    # Créer le nouvel utilisateur
    hashed_password = get_password_hash(user_data.password)
    user_dict = User(
        username=user_data.username,
        email=user_data.email
    ).dict()
    user_dict["password"] = hashed_password
    
    await db.users.insert_one(user_dict)
    
    # Créer le token
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user_data.username}, expires_delta=access_token_expires
    )
    
    return {"access_token": access_token, "token_type": "bearer"}

@api_router.post("/auth/login", response_model=Token)
async def login(user_data: UserLogin):
    # Trouver l'utilisateur
    user = await db.users.find_one({"username": user_data.username})
    if not user or not verify_password(user_data.password, user["password"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Nom d'utilisateur ou mot de passe incorrect",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Mettre à jour le statut en ligne
    await db.users.update_one(
        {"username": user_data.username},
        {"$set": {"is_online": True, "last_login": datetime.utcnow()}}
    )
    
    # Créer le token
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user_data.username}, expires_delta=access_token_expires
    )
    
    return {"access_token": access_token, "token_type": "bearer"}

@api_router.get("/auth/me", response_model=UserProfile)
async def get_me(current_user: User = Depends(get_current_user)):
    return UserProfile(
        id=current_user.id,
        username=current_user.username,
        stats=current_user.stats,
        is_online=current_user.is_online,
        last_login=current_user.last_login
    )

@api_router.post("/auth/logout")
async def logout(current_user: User = Depends(get_current_user)):
    # Mettre à jour le statut hors ligne
    await db.users.update_one(
        {"username": current_user.username},
        {"$set": {"is_online": False}}
    )
    return {"message": "Déconnexion réussie"}

# User management endpoints
@api_router.get("/users/search/{username}")
async def search_user(username: str, current_user: User = Depends(get_current_user)):
    user = await db.users.find_one({"username": {"$regex": username, "$options": "i"}})
    if not user:
        raise HTTPException(status_code=404, detail="Utilisateur non trouvé")
    
    return UserProfile(
        id=user["id"],
        username=user["username"],
        stats=user["stats"],
        is_online=user.get("is_online", False),
        last_login=user.get("last_login")
    )

# Add your routes to the router instead of directly to app
@api_router.get("/")
async def root():
    return {"message": "Hello World"}

@api_router.post("/status", response_model=StatusCheck)
async def create_status_check(input: StatusCheckCreate):
    status_dict = input.dict()
    status_obj = StatusCheck(**status_dict)
    _ = await db.status_checks.insert_one(status_obj.dict())
    return status_obj

@api_router.get("/status", response_model=List[StatusCheck])
async def get_status_checks():
    status_checks = await db.status_checks.find().to_list(1000)
    return [StatusCheck(**status_check) for status_check in status_checks]

# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
