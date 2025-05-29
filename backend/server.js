const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Données simulées
let profiles = [
    {
        name: "VentNoir SecretSpy",
        uuid: "Secret",
        race: "Scripter++",
        class: "WebMaster++",
        gender: "Male",
        health: 10,
        maxHealth: 1000,
        stamina: 10,
        maxStamina: 1000,
        fortitude: 37,
        endurance: 25,
        strength: 99,
        will: 120,
        intelligence: 20,
        perception: 99,
        finesse: 10,
        hitChance: 97,
        racialPowerPool: 5,
        abilities: {
            offense: ["Charge", "Cyclone-I", "Fracture-I"],
            support: ["Cruelty-I", "Mech-I"],
            healing: ["FirstAid-I"]
        },
        inCombat: false,
        isKO: false,
        level: 1,
        xp: 0,
        xpToNextLevel: 100
    }
];

// Routes
app.get('/', (req, res) => {
  res.json({ message: 'Bienvenue sur l\'API VentNoir' });
});

app.get('/api/profiles/:name', (req, res) => {
    const profile = profiles.find(p => p.name === req.params.name);
    if (!profile) return res.status(404).json({ error: "Profile not found" });
    res.json(profile);
});

app.put('/api/profiles/:name', (req, res) => {
    const profileIndex = profiles.findIndex(p => p.name === req.params.name);
    if (profileIndex === -1) return res.status(404).json({ error: "Profile not found" });
    profiles[profileIndex] = { ...profiles[profileIndex], ...req.body };
    res.json(profiles[profileIndex]);
});

// Démarrer le serveur
app.listen(port, () => {
    console.log(`Serveur démarré sur http://localhost:${port}`);
}); 