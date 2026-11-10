# Planning Ostéo

Copie indépendante du Planning Imagerie (base Firebase séparée, aucune donnée du service d'origine).

## Mise en route
1. Créer un projet Firebase (ex. « planning-osteo »), activer **Firestore** (mode production) et **Cloud Messaging**.
2. Paramètres du projet → application Web : noter apiKey, projectId, messagingSenderId, appId ; Cloud Messaging → clé VAPID (certificat Web Push).
3. `python3 configurer.py API_KEY PROJECT_ID SENDER_ID APP_ID VAPID_KEY`
4. Créer un dépôt GitHub `osteo`, y déposer tous les fichiers, activer GitHub Pages (branche main).
5. Rappels push : ajouter le secret `FIREBASE_SERVICE_ACCOUNT` (clé de service du projet) dans Settings → Secrets du dépôt.
6. Copier les règles Firestore du projet d'origine dans le nouveau projet (ou me demander).
7. Au premier lancement : créer les postes (Réglages → Trame), les médecins, et définir le code admin.
