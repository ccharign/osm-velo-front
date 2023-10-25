
import L from "leaflet"
import "leaflet.awesome-markers/dist/leaflet.awesome-markers";
//import "leaflet.icon.glyph/Leaflet.Icon.Glyph"

import { GéométrieOsm } from "./types.ts";
import markerIcon from "../../node_modules/leaflet/dist/images/marker-icon.png";
import { iconeFa } from "./iconeFa.ts";










// Pour envoyer au serveur
export type PourDjango = {
    type_étape: string,
    pk?: number,
    num?: boolean,
    lon?: number,
    lat?: number,
    adresse?: string,
}


// Charger l’icone de base pour les marqueurs
L.Marker.prototype.setIcon(L.icon({
    iconUrl: markerIcon,
    iconSize: [24, 36],
    iconAnchor: [12, 36]
}))


export function géomOsmVersLeaflet(g: GéométrieOsm): L.LatLng[] {
    return g.map(x => new L.LatLng(x[1], x[0]));
}

function sommetMédian(g: GéométrieOsm): L.LatLng {
    const sommet_médian = g[g.length >> 2];
    return new L.LatLng(sommet_médian[1], sommet_médian[0]);
}



export class Vecteur {

    x: number;
    y: number;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    produitScalaire(autre_vecteur: Vecteur) {
        return this.x * autre_vecteur.x + this.y * autre_vecteur.y;
    }
}


export abstract class Lieu {

    static R_terre = 6360000; // en mètres
    static coeff_rad = Math.PI / 180; // Multiplier par ceci pour passer en radians

    coords: L.LatLng;
    leaflet_layer: L.Layer; // L’objet leaflet à dessiner sur la carte. (Sera un polyline pour les rues, un marqueur sinon.)
    nom: string;


    abstract pourDjango(): PourDjango;

    // Crée l’objet mais aussi un marqueur. Le marqueur n’est pas lié à la carte.
    constructor(géom: GéométrieOsm, nom: string) {
        this.coords = sommetMédian(géom);
        this.leaflet_layer = new L.Marker(this.coords, { icon: iconeFa() });
        this.leaflet_layer.bindPopup(nom);
        this.nom = nom;
    }


    setLatlng(ll: L.LatLng) {
        this.coords = ll;
    }


    vecteurVers(autreLieu: Lieu) {
        return this.vecteurVersLatLng(autreLieu.coords);
    }


    vecteurVersLatLng(ll2: L.LatLng): Vecteur {
        const ll1 = this.coords;
        const dx = Lieu.R_terre * Math.cos(ll1.lat * Math.PI / 180) * (ll2.lng - ll1.lng) * Math.PI / 180;
        const dy = Lieu.R_terre * (ll2.lat - ll1.lat) * Math.PI / 180;
        return new Vecteur(dx, dy);
    }



}











