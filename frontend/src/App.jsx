import { useState, useEffect } from 'react';
import {
  Box, Button, useToast, Tooltip, Switch, VStack, Text,
  Modal, ModalOverlay, ModalContent, ModalHeader,
  ModalBody, ModalCloseButton, useDisclosure,
  Center
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import './index.css'; // Import du fichier CSS

// Composant pour les catégories de capacités
const AbilityCategory = ({ title, abilities, categoryKey, toggleModal }) => (
  <Box className="ability-category mb-8">
    <Text className="text-neon-blue mb-4 text-left text-lg font-bold ml-2">{title}</Text>
    <Box className="ability-list space-y-4">
      {abilities.map((ability, index) => (
        <Tooltip
          key={`${categoryKey}-${index}`}
          label={`Capacité de ${title.toLowerCase()}: ${ability}`}
          placement="top"
          bg="gray.800"
          color="gray.200"
          border="1px solid var(--neon-blue)"
        >
          <motion.div
            whileHover={{ scale: 1.05 }}
            onClick={() => toggleModal(`${categoryKey}-${index}`)}
            className="ability-item"
            tabIndex="0"
            aria-label={`Voir détails de la capacité ${ability}`}
          >
            {ability}
          </motion.div>
        </Tooltip>
      ))}
    </Box>
  </Box>
);

// Composant pour les statistiques
const StatItem = ({ stat, index, toggleModal }) => (
  <Tooltip label={stat.tooltip} placement="top" bg="gray.800" color="gray.200" border="1px solid var(--neon-blue)">
    <motion.div
      whileHover={{ scale: 1.05 }}
      onClick={() => toggleModal(`stat-${index}`)}
      className="stat-item"
    >
      <Text className="text-neon-blue text-xl mx-auto">{stat.icon}</Text>
      <Text className="text-xs text-gray-400">{stat.label}</Text>
      <Text className="text-sm text-gray-200">{stat.value}</Text>
    </motion.div>
  </Tooltip>
);

// Composant pour la barre de progression
const ProgressBar = ({ label, current, max, icon, color }) => (
  <Box className="bar-item">
    <Text className={`text-${color} text-lg`}>{icon}</Text>
    <Box className="bar-content">
      <Box className="flex justify-between text-xs text-gray-400">
        <Text>{label}</Text>
        <Text>{current}/{max}</Text>
      </Box>
      <Box 
        className={`bar ${label.toLowerCase()}-bar glow animate-pulse`} 
        style={{ width: `${(current / max) * 100}%` }} 
      />
    </Box>
  </Box>
);

// Composant pour les boutons d'action
const ActionButton = ({ onClick, label, icon, color }) => (
  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
    <Button
      onClick={onClick}
      className={`px-4 py-2 bg-gradient-to-r from-${color}-500 to-${color}-700 rounded-lg glow hover:from-${color}-600 hover:to-${color}-800 transition-all duration-300 animate-pulse`}
    >
      <Box className="flex items-center gap-2">
        <center><Text className="text-sm">{icon} {label}</Text></center>
      </Box>
    </Button>
  </motion.div>
);

function App() {
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const toast = useToast();

  const { isOpen: isIntroOpen, onOpen: onIntroOpen, onClose: onIntroClose } = useDisclosure();
  const [modalStates, setModalStates] = useState({});

  useEffect(() => {
    onIntroOpen();
    fetch('http://localhost:3001/api/profiles/VentNoir SecretSpy')
      .then(res => res.json())
      .then(data => {
        setProfile(data);
        setIsLoading(false);
      })
      .catch(err => {
        console.error(err);
        setIsLoading(false);
      });
  }, []);

  useEffect(() => {
    if (!profile) return;
    const interval = setInterval(() => {
      if (profile.inCombat && !profile.isKO) {
        const newHealth = Math.max(profile.health - 5, 0);
        updateProfile({ ...profile, health: newHealth, isKO: newHealth <= 0, inCombat: newHealth > 0 });
      }
    }, 5000);
    return () => clearInterval(interval);
  }, [profile]);

  const usePotion = (type) => {
    if (profile.isKO) {
      toast({
        title: "Action impossible",
        description: "Vous êtes KO !",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "top",
      });
      return;
    }
    const healAmount = profile.inCombat ? 15 : 35;
    const updatedProfile = type === "HP"
      ? { ...profile, health: Math.min(profile.health + healAmount, profile.maxHealth) }
      : { ...profile, stamina: Math.min(profile.stamina + healAmount, profile.maxStamina) };
    updateProfile(updatedProfile);
    toast({
      title: `Potion ${type} utilisée`,
      description: `Vous avez récupéré ${healAmount} ${type === "HP" ? "points de vie" : "points de stamina"}.`,
      status: "success",
      duration: 3000,
      isClosable: true,
      position: "top",
    });
  };

  const resurrect = () => {
    if (!profile.isKO) {
      toast({
        title: "Action impossible",
        description: "Vous n'êtes pas KO !",
        status: "warning",
        duration: 3000,
        isClosable: true,
        position: "top",
      });
      return;
    }
    updateProfile({ ...profile, isKO: false, health: 50, stamina: 50 });
    toast({
      title: "Résurrection réussie",
      description: "Vous êtes de retour dans la bataille !",
      status: "success",
      duration: 3000,
      isClosable: true,
      position: "top",
    });
  };

  const updateProfile = (newProfile) => {
    setProfile(newProfile);
    fetch('/api/profiles/VentNoir SecretSpy', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newProfile)
    });
  };

  const toggleModal = (key) => {
    setModalStates(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  if (isLoading) return (
    <Box className="flex justify-center items-center min-h-screen">
      <center><Text className="text-center text-3xl text-neon-blue animate-pulse">Chargement...</Text></center>
    </Box>
  );

  const stats = [
    { label: "Race", value: profile.race, icon: "🌌", tooltip: "La race de votre personnage",  color: "text-neon-blue" },
    { label: "Class", value: profile.class, icon: "⚙️", tooltip: "La classe de combat", color: "text-neon-purple" },
    { label: "Gender", value: profile.gender, icon: "👤", tooltip: "Genre du personnage", color: "text-neon-magenta" },
    { label: "Level", value: profile.level, icon: "⭐", tooltip: "Niveau actuel", color: "text-green-400" },
    { label: "XP", value: `${profile.xp}/${profile.xpToNextLevel}`, icon: "✨", tooltip: "Points d'expérience", color: "text-neon-blue" },
    { label: "Hit Chance", value: `${profile.hitChance}%`, icon: "🎲", tooltip: "Chance de toucher", color: "text-neon-purple" },
    { label: "Fortitude", value: profile.fortitude, icon: "🛡️", tooltip: "Résistance physique", color: "text-neon-magenta" },
    { label: "Endurance", value: profile.endurance, icon: "🏃", tooltip: "Endurance en combat", color: "text-green-400" },
    { label: "Strength", value: profile.strength, icon: "💪", tooltip: "Force physique", color: "text-neon-blue" },
    { label: "Will", value: profile.will, icon: "🧠", tooltip: "Volonté mentale", color: "text-neon-purple" },
    { label: "Intelligence", value: profile.intelligence, icon: "📚", tooltip: "Capacité intellectuelle", color: "text-neon-magenta" },
    { label: "Perception", value: profile.perception, icon: "👁️", tooltip: "Sens de l'observation", color: "text-green-400" },
    { label: "Finesse", value: profile.finesse, icon: "🎯", tooltip: "Précision et agilité", color: "text-neon-blue" },
    { label: "Power Pool", value: `${profile.racialPowerPool}`, icon: "⚡", tooltip: "Réserve d'énergie raciale", color: "text-neon-purple" },
  ];

  return (
    <Box className={`min-h-screen bg-space bg-cover bg-center flex flex-col items-center justify-center w-full ${isDarkMode ? 'dark-mode' : 'light-mode'}`}>
      {/* Intro Modal */}
      <Modal isOpen={isIntroOpen} onClose={onIntroClose} isCentered motionPreset="scale">
        <ModalOverlay backdropFilter="blur(10px)" />
        <ModalContent bg="#ef4444" border="2px solid var(--neon-blue)" borderRadius="lg" boxShadow="0 0 20px var(--neon-blue-glow)" w="90%" maxW="3xl">
          <ModalHeader className="text-neon-blue font-orbitron text-3xl text-center">Bienvenue sur Blackcherry Zeta Development</ModalHeader>
          <ModalCloseButton color="gray.400" />
          <ModalBody>
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ duration: 1.5, ease: "easeOut" }}
              className="flex justify-center mb-4"
            >
              <Box className="text-6xl">🚀</Box>
            </motion.div>
            <Text className="text-gray-300 text-center">Préparez-vous à explorer un univers de combat et de stratégie.</Text>
          </ModalBody>
        </ModalContent>
      </Modal>

      {/* Modals pour les stats */}
      {stats.map((stat, index) => (
        <Modal
          key={`stat-${index}`}
          isOpen={modalStates[`stat-${index}`] || false}
          onClose={() => toggleModal(`stat-${index}`)}
          motionPreset="none"
        >
          <ModalOverlay backdropFilter="blur(10px)" />
          <motion.div
            initial={{ y: -100, opacity: 0, rotate: Math.random() * 360 }}
            animate={{ y: 0, opacity: 1, rotate: 0 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: Math.random() * 0.5 }}
            style={{ marginTop: `${Math.random() * 20 + 10}vh`, marginLeft: `${Math.random() * 40 - 20}vw` }}
          >
            <ModalContent
              bg="#a83131"
              border={`2px solid var(${stat.color === "text-neon-blue" ? "--neon-blue" : stat.color === "text-neon-purple" ? "--neon-purple" : stat.color === "text-neon-magenta" ? "--neon-magenta" : "#00ff00"})`}
              borderRadius="lg"
              boxShadow={`0 0 20px var(${stat.color === "text-neon-blue" ? "--neon-blue-glow" : stat.color === "text-neon-purple" ? "--neon-purple" : stat.color === "text-neon-magenta" ? "--neon-magenta" : "#00ff00"})`}
              w="90%"
              maxW="md"
            >
              <ModalHeader className={`${stat.color} font-orbitron text-2xl text-center`}>{stat.label}</ModalHeader>
              <ModalCloseButton color="gray.400" />
              <ModalBody>
                <Text className={`${stat.color} text-center`}>{stat.tooltip}: {stat.value}</Text>
              </ModalBody>
            </ModalContent>
          </motion.div>
        </Modal>
      ))}

      {/* Modals pour les capacités */}
      {["offense", "support", "healing"].map((category, catIndex) => (
        profile.abilities[category].map((ability, index) => (
          <Modal
            key={`${category}-${index}`}
            isOpen={modalStates[`${category}-${index}`] || false}
            onClose={() => toggleModal(`${category}-${index}`)}
            motionPreset="none"
          >
            <ModalOverlay backdropFilter="blur(10px)" />
            <motion.div
              initial={{ y: -100, opacity: 0, rotate: Math.random() * 360 }}
              animate={{ y: 0, opacity: 1, rotate: 0 }}
              transition={{ duration: 0.8, ease: "easeOut", delay: Math.random() * 0.5 }}
              style={{ marginTop: `${Math.random() * 20 + 10}vh`, marginLeft: `${Math.random() * 40 - 20}vw` }}
            >
              <ModalContent
                bg="#a83131"
                border={`2px solid var(${category === "offense" ? "--neon-purple" : category === "support" ? "--neon-magenta" : "#00ff00"})`}
                borderRadius="lg"
                boxShadow={`0 0 20px var(${category === "offense" ? "--neon-purple" : category === "support" ? "--neon-magenta" : "#00ff00"})`}
                w="90%"
                maxW="md"
              >
                <ModalHeader className={`${category === "offense" ? "text-neon-purple" : category === "support" ? "text-neon-magenta" : "text-green-400"} font-orbitron text-2xl text-center`}>{ability}</ModalHeader>
                <ModalCloseButton color="gray.400" />
                <ModalBody>
                  <strong><Text className={`${category === "offense" ? "text-neon-purple" : category === "support" ? "text-neon-magenta" : "text-green-400"} text-center`}>Capacité {category}: {ability}</Text></strong>
                </ModalBody>
              </ModalContent>
            </motion.div>
          </Modal>
        ))
      ))}

      {/* Particules animées */}
      <Box className="particles absolute inset-0 pointer-events-none" />

      {/* Navigation */}
      <Box as="nav" className="fixed top-0 left-0 right-0 z-50 bg-gray-900/90 backdrop-blur-md border-b border-neon-blue/50 flex justify-between items-center px-8 py-4 w-full">
        <strong><center><Text className="text-3xl font-orbitron text-neon-blue glow">Blackcherry Zeta Development</Text></center></strong>
        <Box className="flex items-center gap-6">
          <Box align="center" className="flex gap-4">
            <a href="#" className="text-neon-blue hover:underline glow text-lg">Connexion</a>
            <a href="#" className="text-neon-blue hover:underline glow text-lg">Profil</a>
            <a href="#" className="text-neon-blue hover:underline glow text-lg">Contact</a>
            <Text className="text-sm text-gray-300 bg-gray-900/80 backdrop-blur-sm rounded-lg px-4 py-2">
              <center><strong className="status-text">Statut:</strong> <span className="status-text">{profile.isKO ? "💀 KO 💀" : profile.inCombat ? "⚔️ Combat" : "🕊️ Safe"}</span></center>
            </Text>
            <center><Text className="text-lg text-gray-300 hidden md:block">Player: {profile.name}</Text></center>
          </Box>
        </Box>
      </Box>

      {/* Main Content */}
      <div align="center"><Box as="main" className="flex-grow w-full max-w-screen-2xl flex flex-col items-center">
        <Box className="w-full bg-gray-900/90 backdrop-blur-md rounded-2xl shadow-2xl p-8 border border-neon-blue/50 flex flex-col items-center main-container">
          {isEditing ? (
            <Box className="w-full flex flex-col items-center justify-center min-h-[60vh]">
              <VStack spacing={6} w="full" maxW="md">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="w-full text-center">
                  <Text className="text-4xl font-orbitron text-neon-blue glow text-center mb-8">Modifier le profil</Text>
                </motion.div>
                <VStack w="full" spacing={8} className="items-center">
                  <VStack w="full" spacing={4}>
                    <Text className="block text-gray-300 text-xl text-center">Race</Text>
                    <input
                      type="text"
                      value={profile.race}
                      onChange={(e) => setProfile({ ...profile, race: e.target.value })}
                      className="w-full p-3 bg-gray-800 rounded-lg border border-neon-blue/30 text-white focus:outline-none focus:ring-2 focus:ring-neon-blue"
                    />
                  </VStack>
                  <VStack w="full" spacing={4}>
                    <Text className="block text-gray-300 text-xl text-center">Classe</Text>
                    <input
                      type="text"
                      value={profile.class}
                      onChange={(e) => setProfile({ ...profile, class: e.target.value })}
                      className="w-full p-3 bg-gray-800 rounded-lg border border-neon-blue/30 text-white focus:outline-none focus:ring-2 focus:ring-neon-blue"
                    />
                  </VStack>
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="mt-8">
                    <Button
                      onClick={() => {
                        updateProfile(profile);
                        setIsEditing(false);
                      }}
                      className="px-8 py-4 bg-gradient-to-r from-green-500 to-green-700 rounded-lg glow hover:from-green-600 hover:to-green-800 transition-all duration-300 animate-pulse"
                    >
                      <Box className="flex items-center gap-2">
                        <Text className="text-white text-lg">💾 Sauvegarder</Text>
                      </Box>
                    </Button>
                  </motion.div>
                </VStack>
              </VStack>
            </Box>
          ) : (
            <Box w="full" className="flex flex-col items-center">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                <Box className="text-center">
                  <center><Text className="text-sm text-gray-300 bg-gray-900/80 backdrop-blur-sm rounded-lg px-3 py-1 mt-2">UUID: {profile.uuid}</Text></center>
                </Box>
              </motion.div>

              <Box className="w-full grid grid-cols-1 lg:grid-cols-2 gap-8 justify-items-center">
                <motion.div initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7 }} className="stats-container">
                 <strong> <center><Text className="text-2xl font-orbitron text-neon-blue mb-4 text-center">Stats</Text></center></strong>
                  <Box className="stats-grid">
                    {stats.map((stat, index) => (
                      <StatItem key={index} stat={stat} index={index} toggleModal={toggleModal} />
                    ))}
                  </Box>
                  <Box align="center" className="bars-container mt-6">
                  <strong><center><ProgressBar label="Health" current={profile.health} max={profile.maxHealth} icon="❤️" color="neon-blue" /></center></strong>
                  <strong><center><ProgressBar label="Stamina" current={profile.stamina} max={profile.maxStamina} icon="🔷" color="neon-blue" /></center></strong>
                  </Box>
                </motion.div>
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }} className="buttons-container mt-8">
                  <ActionButton onClick={() => usePotion("HP")} label="HP" icon="❤️" color="red" />
                  <ActionButton onClick={() => usePotion("MP")} label="MP" icon="🔷" color="blue" />
                  <ActionButton onClick={resurrect} label="Res" icon="💫" color="purple" />
                  <ActionButton onClick={() => setIsEditing(true)} label="Edit" icon="✏️" color="yellow" />
                </motion.div>
                <motion.div initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7 }} className="abilities-container">
                <strong><Text className="text-2xl font-orbitron text-neon-blue mb-6 text-left ml-4 font-bold">Abilities</Text></strong>
                  <Box className="abilities-container mt-8 grid grid-cols-1 md:grid-cols-3 gap-12">
                    <AbilityCategory title="Offense" abilities={profile.abilities.offense} categoryKey="offense" toggleModal={toggleModal} />
                    <AbilityCategory title="Support" abilities={profile.abilities.support} categoryKey="support" toggleModal={toggleModal} />
                    <AbilityCategory title="Healing" abilities={profile.abilities.healing} categoryKey="healing" toggleModal={toggleModal} />
                  </Box>
                </motion.div>
              </Box>
            </Box>
          )}
        </Box>
      </Box></div>

      {/* Footer avec animation */}
      <motion.footer
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
        className="w-full bg-gray-900/90 backdrop-blur-md border-t border-neon-blue/50 glow flex flex-col items-center py-6"
      >
        <center><Text className="text-lg text-gray-300 mb-4 text-center">
          ©2025 Blackcherry and the Zeta Development.
        </Text></center>
       <center> <Box className="flex gap-6">
          <a href="#" className="text-neon-blue hover:underline glow text-lg">GitHub--</a>
          <a href="#" className="text-neon-blue hover:underline glow text-lg">Documentation--</a>
          <a href="#" className="text-neon-blue hover:underline glow text-lg">Support</a>
        </Box></center>
      </motion.footer>
    </Box>
  );
}

export default App;