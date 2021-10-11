# FastPark
https://fastpark-16a52.firebaseapp.com

```
# Auteurs
Almeida Pierre-Arnaud
Rolin Christopher
Simeonov Martin
```
* **Fastpark** - *Travail d'equipe* - 
## Importation et test en local

> Permet apres l'import du projet de telecharger toutes les librairies/modules necessaire lancer les deux commandes suivantes :
```
$ npm install
$ npm update -g ionic
```

> Permet de lancer l'application en local sur un navigateur web
```
$ ionic serve
```

## Déployer sur Firebase afin d'y avoir accès via Internet
### Avant de déployer, lisez ce qui suit :
L'application comporte des plugins cordova (android et ios) qui ne marcheront donc pas lors des tests via un navigateur Web.
Ainsi avant de déployer, il faut mettre en commentaire certains _providers_ présents dans le fichier app.module.ts (il faut mettre en commentaire tous les providers provenant de plugins installés) comme par exemple :
```
File,
FileTransfer,
FileOpener,
FileChooser,
FilePath 
```
De ce fait, les pages qui utilisent un de ces providers ne seront pas disponibles.

### Commandes à effectuer :
```
$ firebase login
$ ionic build --prod
$ firebase list
```
> La commande permet de voir tous les projets :
```
$ firebase use --add
```
> Choisir fast-park

> En alias mettre : fast-park
> Permet de déployer tous sauf les fonctions et permettra dans notre cas de déployer : firestore & hosting
```
$ firebase deploy --except functions
```

## Les collections sur Firebase pour stocker les données
### 1. users
Permet de conserver les données personnelles (sauf l'adresse mail et le mot de passe) des utilisateurs

## Créer des triggers pour Firebase
Les triggers sont à créer dans le fichier index.ts du dossier _functions_


## Quelques commandes
> Permet de lancer l'application sur son téléphone connecter au PC à l'aide d'un cable USB (**Le mode _Débogage USB_ doit être activé sur le téléphone**)
```
$ ionic cordova run android
ou
$ ionic cordova run ios
```

> Permet d'ajouter android et/ou ios comme plateforme de déployement :
```
$ ionic cordova platform add android
ou
$ ionic cordova platform add ios
```

> Permet de créer le build et par la suite générer l'apk avec AndroidStudio/XCode :
```
$ ionic cordova build android
ou
$ ionic cordova build ios
```

> Déployer des fonctions (triggers) firebase sur le cloud
```
$ firebase deploy --only functions
```