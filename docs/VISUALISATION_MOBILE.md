   # 📱 Guide de Visualisation Mobile - APX

## Option 1 : Chrome DevTools (RECOMMANDÉ - Le plus simple)

### Étapes :

1. **Ouvrir Chrome** et aller sur `http://localhost:3000`

2. **Ouvrir les DevTools** :
   - Windows/Linux : `F12` ou `Ctrl + Shift + I`
   - Mac : `Cmd + Option + I`

3. **Activer le mode Device** :
   - Cliquer sur l'icône de téléphone/tablette en haut à gauche
   - Ou appuyer sur `Ctrl + Shift + M` (Windows) / `Cmd + Shift + M` (Mac)

4. **Sélectionner iPhone** dans le menu déroulant :
   - iPhone 14 Pro Max (430 x 932)
   - iPhone 14 Pro (393 x 852)
   - iPhone 13 (390 x 844)
   - iPhone SE (375 x 667)

5. **Activer "Show device frame"** pour voir le cadre de l'iPhone

### Raccourcis utiles :
- `Cmd/Ctrl + R` : Recharger
- `Cmd/Ctrl + Shift + R` : Recharger sans cache
- Rotation : Cliquer sur l'icône de rotation

---

## Option 2 : Safari Responsive Design Mode (Mac uniquement)

### Étapes :

1. Ouvrir **Safari** et aller sur `http://localhost:3000`

2. Activer le **mode développeur** :
   - Safari → Préférences → Avancé
   - Cocher "Afficher le menu Développement dans la barre des menus"

3. **Entrer en mode Responsive** :
   - Menu Développement → Entrer en mode de design adaptatif
   - Ou `Cmd + Option + R`

4. Sélectionner **iPhone** dans la liste des appareils

---

## Option 3 : Tester sur un vrai iPhone

### Via Safari (iPhone sur même réseau WiFi)

1. **Sur ton Mac**, trouver ton adresse IP locale :
   ```bash
   ifconfig | grep "inet " | grep -v 127.0.0.1
   ```
   Exemple de résultat : `192.168.1.10`

2. **Sur l'iPhone**, ouvrir Safari et aller sur :
   ```
   http://192.168.1.10:3000
   ```
   (Remplace par ton IP)

3. **Sauvegarder sur l'écran d'accueil** :
   - Appuyer sur le bouton Partager
   - Choisir "Sur l'écran d'accueil"
   - L'app s'ouvre maintenant en plein écran comme une vraie app !

### Via Expo Go (si tu veux simuler une vraie app native)

Pour une expérience encore plus proche d'une app native, tu peux utiliser **Expo Go** mais cela nécessite de migrer vers React Native. Pour l'instant, la méthode Safari est suffisante.

---

## Option 4 : Utiliser Responsively App (Gratuit)

1. Télécharger **Responsively App** : https://responsively.app/

2. Lancer l'application

3. Entrer `http://localhost:3000` dans la barre d'adresse

4. Visualiser simultanément sur plusieurs tailles d'iPhone

---

## Option 5 : Firefox Responsive Design Mode

1. Ouvrir **Firefox** et aller sur `http://localhost:3000`

2. Activer le mode adaptatif :
   - `Ctrl + Shift + M` (Windows/Linux)
   - `Cmd + Option + M` (Mac)

3. Sélectionner **iPhone** dans la liste

---

## Tailles d'écran iPhone de référence

| Modèle | Largeur | Hauteur | Ratio |
|--------|---------|---------|-------|
| iPhone 14 Pro Max | 430px | 932px | 19.5:9 |
| iPhone 14 Pro | 393px | 852px | 19.5:9 |
| iPhone 14 | 390px | 844px | 19.5:9 |
| iPhone 13 Mini | 375px | 812px | 19.5:9 |
| iPhone SE | 375px | 667px | 16:9 |

---

## Configuration actuelle de l'app

L'application APX est maintenant configurée pour :

✅ **Viewport mobile optimal**
- Largeur = largeur de l'appareil
- Pas de zoom utilisateur
- Adaptation à l'écran iPhone (notch, safe area)

✅ **Apple Web App capable**
- Mode plein écran sur iPhone
- Barre de statut noire translucide
- Pas de barre Safari visible

✅ **Optimisations tactiles**
- Boutons assez grands pour le touch
- Pas de scroll horizontal
- Navigation adaptée

---

## Recommandation

**Pour tester rapidement** : Chrome DevTools (Option 1)
- Le plus rapide
- Le plus facile
- Parfait pour le développement

**Pour tester comme une vraie app** : iPhone réel + Safari (Option 3)
- Expérience la plus fidèle
- Test des gestes tactiles
- Sauvegarde sur écran d'accueil

---

## Capture d'écran

Pour faire des captures d'écran en mode iPhone :

1. Ouvrir Chrome DevTools en mode Device
2. Sélectionner iPhone 14 Pro
3. Activer "Show device frame"
4. `Cmd + Shift + P` (Mac) ou `Ctrl + Shift + P` (Windows)
5. Taper "Capture screenshot"
6. Choisir "Capture node screenshot" ou "Capture full size screenshot"

---

## Problèmes courants

### L'app ne s'affiche pas correctement sur mobile

**Solution** : Vider le cache
- Chrome : `Cmd/Ctrl + Shift + R`
- Safari : `Cmd + Option + E` puis `Cmd + R`

### Les touches tactiles ne fonctionnent pas en mode device

**Solution** : Utiliser la souris normalement, Chrome simule le touch automatiquement

### L'app est trop large sur mobile

**Solution** : Vérifier que le viewport est bien configuré (c'est fait maintenant !)

---

**L'app APX est maintenant prête pour une visualisation mobile optimale ! 🚀**

