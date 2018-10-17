const Joi = require('joi');
const express = require('express');
const router = express.Router();

let songs = [];

//Song API
//return list of all songs
router.get('/', (req, res, next) => {
    res.status(200).json(songs);
});

//create a new song, and return new song
router.post('/', (req, res) => {
    //create some schema
    //name: is a string, is required, min 2 char long
    //artist: is a string, is required, min 4 char long
    const schema = Joi.object().keys({
        name: Joi.string().min(2).required(),
        artist: Joi.string().min(4).required(),
    })

    //check that the req.body is valid with joi
    const result = Joi.validate(req.body, schema);

    //if valid continue to create song
    if (result.error === null){
        let newSong = {
            id: songs.length + 1,
            name: req.body.name,
            artist: req.body.artist 
        }
        songs.push(newSong);
        res.status(201).json(newSong);
    }
    //if not valid return 400 with the error message from joi validation result
    // next(new Error("Unable to create song"))
    res.status(400);
    const err = new Error(result.error);
    console.log(err.message);
    res.send(err.message);
});

//return a song with id 
router.get('/:id', (req, res, next) => {

    let song = songs.find(song => song.id == parseInt(req.params.id));
    if(song) {
        res.status(200).json(song);
    }
    next(new Error(`Unable to find song with id: ${req.params.id}`))
});

//update a song with id, and return edited song
router.put('/:id', (req, res, next) => {
    let song = songs.find(song => song.id === parseInt(req.params.id));
    if (song) {
        song.name = req.body.name;
        song.artist = req.body.artist;
        res.status(200).json(song);
    }
    next(new Error(`Unable to update song with id: ${req.params.id}`))
});

//delete a song with id, and return deleted song
router.delete("/:id", (req, res, next) => {
    let songToDelete = songs.find(song => song.id === parseInt(req.params.id));
    if(songToDelete){
        let index = songs.indexOf(songToDelete);
        songs.splice(index, 1);
        res.status(200).json(songToDelete);
    }
    next(new Error(`Unable to delete song with id: ${req.params.id}`))
});

//Add error handler for songs router to return 404 on failure at any route
router.use((err, req, res, next) => {
    res.status(404).json({ message: err.message });
});

module.exports = router;