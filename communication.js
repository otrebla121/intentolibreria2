/* 
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/ClientSide/javascript.js to edit this template
 */


const globalObjetos = new Map();
const globalSystemObjetos = new Map();
var horaVersion;

class communicator{
    getGlobalObjetos() {
        return globalObjetos;
    }

    addElemento(netName, entidad) {
        if (this.isKeyInGlobalObjetos(netName) || this.isKeyInGlobalSystemObjetos(entidad["sReferencia"])) {
            return;
        }

        globalObjetos.set(netName, entidad);
        globalSystemObjetos.set(entidad["sReferencia"], entidad);
    }

    setGlobalObjetos(datos) {
        for (var clave in datos) {
            this.addElemento(clave, datos[clave]);
        }
    }

    getNetNameElemento(netName) {
        return globalObjetos.get(netName);
    }

    getSystemElemento(referenciaObj) {
        return globalSystemObjetos.get(referenciaObj);
    }

    getHoraVersion() {
        return horaVersion;
    }

    setHoraVersion(version) {
        horaVersion = version;
    }

    isKeyInGlobalObjetos(key) {
        if (globalObjetos === undefined) {
            return false;
        }

        return globalObjetos.get(key) !== undefined;
    }

    isKeyInGlobalSystemObjetos(key) {
        if (globalSystemObjetos === undefined) {
            return false;
        }

        return globalSystemObjetos.get(key) !== undefined;
    }

    getSize() {
        return globalObjetos.size;
    }

    reloadData(netName, atributo, valor, win) {
        if (atributo === "ORDENCLIENTE") {
            // TODO generar evento cliente, no hay cambio como tal
        } else if (atributo === "CAMBIORED") {
            for (var datoAux in valor) {
                var innerCambio = valor[datoAux];
                this.reloadData(innerCambio["elemento"], innerCambio["atributo"], innerCambio["valor"], win);
            }
        } else {
            var nodo = this.getNetNameElemento(netName);
            nodo.htPropiedades[atributo] = valor;

            if (win !== undefined) {
                win.webContents.send("cambio-dato", [nodo["sReferencia"], atributo, valor]);
            }
        }
    }
}

module.exports = { communicator };