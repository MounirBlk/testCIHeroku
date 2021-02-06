const bdd = require('../../modele/index');

/**
 * Function qui fait un retour d'une donnée
 * @param {Response} res 
 * @param {Number} status 
 * @param {Object} data 
 */
exports.sendReturn = (res, status = 500, data = { error: true, message: "Processing error" }) => {
    res.setHeader('Content-Type', 'application/json')
    try {
        res.status(status).json(data)
    } catch (error) {
        let sendError = { error: true, message: "Processing error" }
        res.status(500).json(sendError)
    }
}

// Function qui vérifie l'existence d'une data
exports.exist = (data) => {
    if (data == undefined || data.trim().length == 0)
        return false
    else
        return true
}

// Function vérification de si la date est dans le bon format à l'envoi
exports.dateFormat = (data) => {
    let regexDate = /^(?:(?:31(\/|-|\.)(?:0?[13578]|1[02]|(?:Jan|Mar|May|Jul|Aug|Oct|Dec)))\1|(?:(?:29|30)(\/|-|\.)(?:0?[1,3-9]|1[0-2]|(?:Jan|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec))\2))(?:(?:1[6-9]|[2-9]\d)?\d{2})$|^(?:29(\/|-|\.)(?:0?2|(?:Feb))\3(?:(?:(?:1[6-9]|[2-9]\d)?(?:0[48]|[2468][048]|[13579][26])|(?:(?:16|[2468][048]|[3579][26])00))))$|^(?:0?[1-9]|1\d|2[0-8])(\/|-|\.)(?:(?:0?[1-9]|(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep))|(?:1[0-2]|(?:Oct|Nov|Dec)))\4(?:(?:1[6-9]|[2-9]\d)?\d{2})$/
    if (data.match(regexDate) == null)
        return false
    else
        return true
}
exports.dateFormatEn = (data) => {
        let regexDate = /^([12]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01]))$/
        if (data.match(regexDate) == null)
            return false
        else
            return true
    }
    // Function vérification de si l'email est dans le bon format
exports.emailFormat = (data) => {
    let regexEmail = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i
    if (data.match(regexEmail) == null)
        return false
    else
        return true
}

//Function vérification password
exports.passwordFormat = (data) => {
    let regexPassword = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/
    return data.match(regexPassword) == null || data === undefined ? false : true
}

// Function vérification de si le zip est dans le bon format
exports.zipFormat = (data) => {
    let regexZip = /^(([0-8][0-9])|(9[0-5]))[0-9]{3}$/
    if (data.match(regexZip) == null)
        return false
    else
        return true
}

// Function vérification de si le text est dans le bon format
exports.textFormat = (data) => {
    let regexText = /^[^@"()!_$*€£`+=;?#]+$/ // regex:  /^[^@&"()!_$*€£`+=\/;?#]+$/
    if (data.match(regexText) == null)
        return false
    else
        return true
}
exports.numberFormat = (data) => {
    let regexNumber = /^[0-9]+$/
    if (data.match(regexNumber) == null)
        return false
    else
        return true
}

exports.floatFormat = (data) => {
    let regexFloat = /^[0-9]+(\.[0-9]{0,})$/
    if (data.match(regexFloat) == null)
        return false
    else
        return true
}

// Function vérification de si l'email existe en base de données
exports.emailExist = async(data) => {
    let toReturn = false
    toReturn = await new Promise(resolve => {
        bdd.query("SELECT * FROM `utilisateur` WHERE `email` LIKE '" + data.trim().toLowerCase() + "'", (error, results) => {
            resolve((results.length > 0) ? true : false)
        })
    })
    return toReturn
}

// Function qui change le format de la date pour l'insertion en base de donnée
exports.changeDateForSQL = (data) => {
    data = data.substr(6, 4) + "-" + data.substr(3, 2) + "-" + data.substr(0, 2) + " 12:00:00";
    return data
};

// Function qui change le format de la date pour le renvoi de la requête
exports.changeDateForSend = (data) => {
    data = data.substr(9, 2) + "-" + data.substr(6, 2) + "-" + data.substr(1, 4);
    return data
}

// Function qui vérifie si l'id existe et si il est conforme
exports.verifId = (data, res) => {
    if (data === undefined)
        this.sendReturn(res, 403, { error: true, message: "Veuillez insérer un id" })
    else if (data.match(/^[0-9]*$/gm) == null)
        this.sendReturn(res, 400, { error: true, message: "L'id envoyé n'est pas conforme" })
}

/**
 * Shuffles array in place.
 * @param {Array} a items An array containing the items.
 */
exports.shuffle = (a) => {
    let j, x, i;
    for (i = a.length - 1; i > 0; i--) {
        j = Math.floor(Math.random() * (i + 1));
        x = a[i];
        a[i] = a[j];
        a[j] = x;
    }
    return a;
}