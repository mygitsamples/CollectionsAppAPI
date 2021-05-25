
var path = require('path');
const dataPath = path.resolve('./app/data/dictionary.json');
const userRoutes = (app, fs) => {

    const readFile = (
        callback,
        returnJson = false,
        filePath = dataPath,
        encoding = 'utf8'
    ) => {
        fs.readFile(filePath, encoding, (err, data) => {
            if (err) {
                throw err;
            }

            callback(returnJson ? JSON.parse(data) : data);
        });
    };

    const writeFile = (
        fileData,
        callback,
        filePath = dataPath,
        encoding = 'utf8'
    ) => {
        fs.writeFile(filePath, fileData, encoding, err => {
            if (err) {
                throw err;
            }

            callback();
        });
    };

    app.get('/dictionary/:key?', (req, res) => {
        readFile(data => {
            const key = req.params["key"];
            let val = "";
            Object.keys(data).map(i => {

                if (data[i]["key"] === key) {

                    val = { i: data[i] };
                }
            })
            if (!key) {
                res.send(data);
            }
            else {
                if (val) {
                    res.send(val);
                }
                else {
                    res.status(204).send("key doesn't exist");
                }
            }
        }, true);
    });
    app.get('/dictionaryvalue/:value', (req, res) => {
        readFile(data => {
            const value = req.params["value"];
            let val = "";
            Object.keys(data).map(i => {

                if (data[i]["value"].includes(value)) {

                    val = { i: {key:data[i]["key"],value:value} };
                }
            })
            if (!val) {
                res.status(204).send("value doesn't exist");
            }
            else {
                if (val) {
                    res.send(val);
                }
            }
        }, true);
    });
    app.get('/dictionaryboth/:key/:value', (req, res) => {
        readFile(data => {
            const key = req.params["key"];
            const value = req.params["value"];
            let val = "";
            Object.keys(data).map(i => {

                if (data[i]["value"].includes(value) && data[i]["key"]===key) {
                    val={i:{key:key,value:value}}
                    
                }
            })
            
            if (!val) {
                res.status(204).send("value doesn't exist");
            }
            else {
                if (val) {
                    res.send(val);
                }
            }
        }, true);
    });

    app.get('/dictionaryall', (req, res) => {
        readFile(data => {
            res.status(200).send(data);
        }
        );
    });

    app.post('/dictionary', (req, res) => {
        try {
            readFile(data => {
                console.log(req.body)
                const val = req.body["key"];
                let bool = false;
                let item = 0;
                Object.keys(data).map(i => {
                    if (data[i]["key"] === val) {
                        item = i;
                        bool = true;
                    }
                })
                if (bool) {
                    if (data[item]["value"].includes(req.body["value"])) {
                        res.status(200).send('value already exists');
                    }
                    else {
                        
                        data[item]["value"] = [data[item]["value"], req.body["value"]];
                        writeFile(JSON.stringify(data, null, 2), () => {
                            res.status(200).send('value added');
                        });
                    }

                }
                else {
                    const unId = Object.keys(data).length + 1;
                    data[unId] = req.body;
                    writeFile(JSON.stringify(data, null, 2), () => {
                        res.status(200).send('keys added');
                    });
                }
            }, true)
        }
        catch (e) {
            console.log(e);
        }
    });

    app.post('/deletedictionary', (req, res) => {
        readFile(data => {
            const val = req.body["key"];
            let bool = false;
            let item = 0;
            Object.keys(data).map(i => {
                if (data[i]["key"] === val) {
                    item = i;
                    bool = true;
                }
            })

            if (bool) {
                const isArray = Array.isArray(data[item]["value"]);
                if (isArray) {

                    data[item]["value"] = data[item]["value"].filter(e => e !== req.body["value"]);
                    if (data[item]["value"].length === 0) {
                        delete data[item]
                    }
                    writeFile(JSON.stringify(data, null, 2), () => {
                        res.status(200).send(`value:${req.body["value"]} removed`);
                    });
                }
                else {
                    delete data[item];
                    writeFile(JSON.stringify(data, null, 2), () => {
                        res.status(200).send(`key:${val} removed`);
                    });
                }
            }
            else {
                res.status(200).send(`key:${val} doesn't exist`);
            }


        }, true);
    });
    app.post('/deletealldictionary', (req, res) => {
        const data = {}
        writeFile(JSON.stringify(data, null, 2), () => {
            res.status(200).send(`deleted all records`);
        });
    });
};



module.exports = userRoutes;