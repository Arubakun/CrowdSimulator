var DIRECTION = {
    "BAS": 2,
    "GAUCHE": 3,
    "DROITE": 1,
    "HAUT": 0
}
var DUREE_ANIM = 4; // nombre de fois que la frame a été dessinée, après X fois, on passe a la frame suivante de l'animation
var DUREE_DEPLACEMENT = 15;

function Personnage(url, x, y, direction) {
    this.x = x; //en cases et non pas en pixel
    this.y = y;
    this.direction = direction;
    this.etatAnimation = 1;

    //on charge l'image
    this.image = new Image();
    this.image.referenceDuPerso = this;
    this.image.onload = function () {
        if (!this.complete)
            throw "Erreur lors du chargement du sprite " + url;
        this.referenceDuPerso.largeur = this.width / 12;
        this.referenceDuPerso.hauteur = this.height / 8;
    }
    this.image.src = "sprites/" + url + ".png";
}

Personnage.prototype.drawPersonnage = function (context) {

    var frame = 0; // Numéro de l'image à prendre pour l'animation
    var decalageX = 0,
        decalageY = 0; // Décalage à appliquer à la position du personnage
    if (this.etatAnimation >= DUREE_DEPLACEMENT) {
        // Si le déplacement a atteint ou dépassé le temps nécessaire pour s'effectuer, on le termine
        this.etatAnimation = -1;

    } else if (this.etatAnimation >= 0) {

        // On calcule l'image (frame) de l'animation à afficher
        frame = Math.floor(this.etatAnimation / DUREE_ANIM);
        if (frame > 2) {
            frame %= 3;
        }

        // Pixels restant à parcourir entre les deux cases
        var pixelsAParcourir = 26 - (26 * (this.etatAnimation / DUREE_DEPLACEMENT));

        // À partir de ce nombre, on définit le décalage en x et y.
        if (this.direction == DIRECTION.HAUT) {
            decalageY = pixelsAParcourir;
        } else if (this.direction == DIRECTION.BAS) {
            decalageY = -pixelsAParcourir;
        } else if (this.direction == DIRECTION.GAUCHE) {
            decalageX = pixelsAParcourir;
        } else if (this.direction == DIRECTION.DROITE) {
            decalageX = -pixelsAParcourir;
        }
        this.etatAnimation++;
    }
    //On dessine le sprite 
    context.drawImage(
        this.image, this.largeur * frame, // changer la deuxieme valeur pour changer de pokemon (+24 pour changer de colonne)
        this.direction * this.hauteur, // Point d'origine de la zone a prendre dans notre image de sprite
        this.largeur, this.hauteur, // taille de la zone (taille du perso)
        (this.x * 26) - (this.largeur / 2) + 13 + decalageX, (this.y * 26) - this.hauteur + 24 + decalageY, // point de destination (toujours en fonction de la taille du perso) 
        this.largeur,
        this.hauteur // taille de la zone de destination (perso)
    )
}

Personnage.prototype.getCoordonneesAdjacentes = function (direction) {
    var coord = {
        'x': this.x,
        'y': this.y
    };
    switch (direction) {
    case DIRECTION.BAS:
        coord.y++;
        break;
    case DIRECTION.GAUCHE:
        coord.x--;
        break;
    case DIRECTION.DROITE:
        coord.x++;
        break;
    case DIRECTION.HAUT:
        coord.y--;
        break;
    }
    return coord;
}

Personnage.prototype.deplacer = function (direction, map) {
    // On ne peut pas se déplacer si un mouvement est déjà en cours 
  /*  if (this.etatAnimation >= 0) {
        return false;
    }*/

    // On change la direction du personnage
    this.direction = direction;

    // On vérifie que la case demandée est bien située dans la carte
    var prochaineCase = this.getCoordonneesAdjacentes(direction);
    if (prochaineCase.x < 0 || prochaineCase.y < 0 || prochaineCase.x >= map.getLargeur() || prochaineCase.y >= map.getHauteur()) {
        return false;
    }

    this.etatAnimation = 1;
    this.x = prochaineCase.x;
    this.y = prochaineCase.y;

    return true;
}