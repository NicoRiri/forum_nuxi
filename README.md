# 📃 Forum Nuxi

## 👨‍🎓 Auteurs

- Nicolas Bernardet
- Clément Oudin

## 🚀 Déploiement

### ⚙️ [Optionel] Customisation des variables env

````shell
# Renommer le fichier
mv .env.example .env
````

````js
//Mot de pas root de la BDD
MARIADB_ROOT_PASSWORD:mot_de_passe_a_changer

//Nom d'utilisateur du nouvel utilisateur de la BDD
MARIADB_USER:username_a_changer

//Mot de passe du nouvel utilisateur de la BDD
MARIADB_PASSWORD:mot_de_passe_a_changer
````



### 🔥 Lancement
```shell
# Lancer les containeurs
docker compose run -d
```

## 💁‍♂️ Compte
Par défaut il y a un compte créé :
- username : admin
- password : admin
