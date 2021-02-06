const express = require('express'),
    index = require('../middleware/filter/index'),
    bdd = require('../modele/index'),
    avatar = require("../middleware/filter/avatar"),
    bcrypt = require('bcrypt')

exports.register = async(req, res) => {
    const data = req.body

    // Vérification de si les données sont bien présentes dans le body
    let error = false

    //utilisateur
    if (index.exist(data.email) == false || index.exist(data.password) == false || index.exist(data.nom) == false || index.exist(data.prenom) == false)
        error = true
    if (index.exist(data.date_naissance) == false || index.exist(data.civilite) == false)
        error = true

    if (error == true) {
        index.sendReturn(res, 403, {
            error: true,
            message: "L'une ou plusieurs données obligatoire sont manquantes"
        })
    } else {
        // Vérification
        if (index.dateFormatEn(data.date_naissance) == false || index.emailFormat(data.email) == false || (data.civilite != "Homme" && data.civilite != "Femme") ||
            index.textFormat(data.prenom) == false || index.textFormat(data.nom) == false) {
            index.sendReturn(res, 409, {
                error: true,
                message: "L'une des données obligatoire ne sont pas conformes"
            })
        } else {
            // Vérification de si l'email existe déjà
            if (await index.emailExist(data.email)) {
                index.sendReturn(res, 422, {
                    error: true,
                    message: "Votre email n'est pas correct (existe déjà)"
                })
            } else {
                // Encryptage du mot de passe
                data.password = await new Promise(resolve => {
                    bcrypt.genSalt(10, async(err, salt) => {
                        return await bcrypt.hash(data.password, salt, (err, hash) => {
                            resolve(hash)
                        });
                    });
                })
                toInsert = {
                    email: data.email.trim().toLowerCase(),
                    password: data.password,
                    nom: data.nom.trim(),
                    prenom: data.prenom.trim(),
                    date_naissance: data.date_naissance,
                    civilite: data.civilite.trim(),
                    adresse: index.exist(data.adresse) == false ? data.adresse = "" : index.textFormat(data.adresse) == false ? index.sendReturn(res, 409, { error: true, message: "Adresse non conforme" }) : data.adresse.trim(),
                    portable: index.exist(data.portable) == false ? "" : data.portable.trim(),
                    avatar: avatar.getAvatar(true),
                    isAdmin: data.isAdmin === true || parseInt(data.isAdmin) === 1 ? parseInt(1) : parseInt(0)
                };
                bdd.query("INSERT INTO utilisateur SET ?", toInsert, (error, results) => {
                    if (error) {
                        console.log(error)
                        index.sendReturn(res, 401, {
                            error: true,
                            message: "La requête d'inscription en base de donnée n'a pas fonctionné"
                        })
                    } else {
                        index.sendReturn(res, 201, { error: false, message: "L'utilisateur a bien été crée avec succès", email: data.email.trim().toLowerCase() })
                    }
                });
            }
        }

    }
}

exports.getUtilisateurs = (req, res) => {
    bdd.query("SELECT * FROM utilisateur", (error, results, fields) => {
        // Si erreur dans la requête
        if (error) {
            console.log(error)
            index.sendReturn(res, 400, { error: false, message: "Erreur dans la requête" });
        }
        // Si le resultat n'existe pas
        else if (results === undefined)
            index.sendReturn(res, 400, { error: false, message: "Aucun résultat pour la requête" });
        // Si la liste des utilises est vide
        else if (results.length == 0)
            index.sendReturn(res, 409, { error: true, message: "Aucun résultat" })
        else {
            if (results.length > 0) {
                results.map(item => {
                    delete item.token;
                    item.date_naissance = JSON.stringify(item.date_naissance).substr(1, 10);
                    delete item.password;
                    item.createdAt = JSON.stringify(item.createdAt).split('T')[0].split('"')[1] + ' ' + JSON.stringify(item.createdAt).split("T")[1].split('.')[0];
                    item.updateAt = JSON.stringify(item.updateAt).split('T')[0].split('"')[1] + ' ' + JSON.stringify(item.updateAt).split("T")[1].split('.')[0];
                    item.lastLogin = JSON.stringify(item.lastLogin).split('T')[0].split('"')[1] + ' ' + JSON.stringify(item.lastLogin).split("T")[1].split('.')[0];
                    delete item.attempt;
                    delete item.isChecked;
                    return item; // Retour le nouvel element item => results[i] = item
                })
                index.sendReturn(res, 200, {
                    error: false,
                    users: results
                })
            } else {
                index.sendReturn(res, 401, {
                    error: true,
                    message: "La requête en base de donnée n'a pas fonctionné"
                })
            }
        }
    });
}

exports.getUtilisateur = (req, res) => {
    index.verifId(req.params.id, res); //id_user

    bdd.query("SELECT * FROM utilisateur WHERE id = '" + req.params.id + "'", (error, results, fields) => {
        // Si erreur dans la requête
        if (error) {
            console.log(error)
            index.sendReturn(res, 400, { error: false, message: "Erreur dans la requête" });
        }
        // Si le resultat n'existe pas
        else if (results === undefined)
            index.sendReturn(res, 400, { error: false, message: "Aucun résultat pour la requête" });
        // Si la liste des utilises est vide
        else if (results.length == 0)
            index.sendReturn(res, 409, { error: true, message: "Aucun résultat" })
        else {
            if (results.length > 0) {
                results.map(item => {
                    delete item.token;
                    item.date_naissance = JSON.stringify(item.date_naissance).substr(1, 10);
                    delete item.password;
                    item.createAt = JSON.stringify(item.createdAt).split('T')[0].split('"')[1] + ' ' + JSON.stringify(item.createdAt).split("T")[1].split('.')[0];
                    item.updateAt = JSON.stringify(item.updateAt).split('T')[0].split('"')[1] + ' ' + JSON.stringify(item.updateAt).split("T")[1].split('.')[0];
                    item.lastLogin = JSON.stringify(item.lastLogin).split('T')[0].split('"')[1] + ' ' + JSON.stringify(item.lastLogin).split("T")[1].split('.')[0];
                    delete item.attempt;
                    delete item.isChecked;
                    return item; // Retour le nouvel element item => results[i] = item
                })
                index.sendReturn(res, 200, {
                    error: false,
                    user: results[0]
                })
            } else {
                index.sendReturn(res, 401, {
                    error: true,
                    message: "La requête en base de donnée n'a pas fonctionné"
                })
            }
        }
    });
}

exports.updateUtilisateur = async(req, res) => {
    index.verifId(req.params.id, res); //id_user
    const id_user = req.params.id;
    const data = req.body;

    // Vérification de si les données sont bien présentes dans le body
    let error = false

    //utilisateur
    if (index.exist(data.email) == false /*|| index.exist(data.password) == false*/ || index.exist(data.nom) == false || index.exist(data.prenom) == false)
        error = true
    if (index.exist(data.date_naissance) == false || index.exist(data.civilite) == false)
        error = true

    if (error === true) {
        index.sendReturn(res, 403, {
            error: true,
            message: "L'une ou plusieurs données obligatoire sont manquantes"
        })
    } else {
        if (index.dateFormatEn(data.date_naissance) == false || index.emailFormat(data.email) == false || (data.civilite != "Homme" && data.civilite != "Femme") ||
            index.textFormat(data.prenom) == false || index.textFormat(data.nom) == false) {
            index.sendReturn(res, 409, {
                error: true,
                message: "L'une des données obligatoire ne sont pas conformes"
            })
        } else {
            // update de l'utilisateur en base de données
            toUpdate = {
                email: data.email.trim().toLowerCase(),
                nom: data.nom.trim(),
                prenom: data.prenom.trim(),
                date_naissance: data.date_naissance,
                civilite: data.civilite.trim(),
                adresse: index.exist(data.adresse) == false ? data.adresse = "" : index.textFormat(data.adresse) == false ? index.sendReturn(res, 409, { error: true, message: "Adresse non conforme" }) : data.adresse.trim(),
                portable: index.exist(data.portable) == false ? "" : data.portable.trim(),
                updateAt: new Date(),
                isAdmin: parseInt(data.isAdmin)
            };
            if (index.exist(data.password) && data.password !== "") {
                data.password = await new Promise(resolve => {
                    bcrypt.genSalt(10, async(err, salt) => {
                        return await bcrypt.hash(data.password, salt, (err, hash) => {
                            resolve(hash)
                        });
                    });
                });
                toUpdate.password = data.password; // ou toUpdate["password"] = data.password;
            }
            bdd.query("UPDATE `utilisateur` SET ? WHERE `utilisateur`.`id` = '" + id_user + "'", toUpdate, (error, results) => {
                if (results.affectedRows != 0) {
                    index.sendReturn(res, 200, { error: false, message: "L'utilisateur a été modifiée avec succès" })
                } else if (results.affectedRows == 0) {
                    index.sendReturn(res, 409, { error: true, message: "L'id envoyez n'existe pas" })
                } else {
                    index.sendReturn(res, 400, { error: true, message: "Modification Impossible" })
                }
            });
        }
    }
}


exports.deleteUtilisateur = async(req, res) => {
    index.verifId(req.params.id, res); // id_user a supprimé

    // Suppression de l'utilisateur en base de donnée
    bdd.query("DELETE FROM `utilisateur` WHERE `utilisateur`.`id` = '" + req.params.id + "'", (error, results) => {
        if (results.affectedRows != 0) {
            index.sendReturn(res, 200, { error: false, message: "L'utilisateur a été supprimé avec succès" })
        } else if (results.length == undefined) {
            index.sendReturn(res, 409, { error: true, message: "L'id envoyé n'existe pas" })
        } else {
            index.sendReturn(res, 400, { error: true, message: "Erreur lors de la suppression de l' utilisateur" })
        }
    })
}