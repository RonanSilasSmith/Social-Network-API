const { User, Reaction, Thought } = require('../models');
//     getAllThoughts,
//     getThoughtbyId,
//     createThought,
//     updateThought,
//     deleteThought
//     checklist^^^^
const thoughtController = {
    getAllThoughts(req, res){
        Thought.find({})
            .then(dbThoughtData => res.json(dbThoughtData))
            .catch(err => {
                console.log(err);
                res.status(400).json(err);
            });
    },
    getThoughtbyId({params}, res) {
        Thought.findOne({ _id: params.id })
            .then(dbThoughtData => {
                if(!dbThoughtData){
                    res.status(404).json({ message: 'No thoughts found with this id!' });
                    return;
                }
                res.json(dbThoughtData);
            })
            .catch(err => {
                console.log(err);
                res.status(400).json(err);
            });
    },
    createThought({body}, res) {
        Thought.create(body)
        .then(dbThoughtData=>{
            User.findOneAndUpdate(
                { _id: body.userId },
                { $push: { thoughts: dbThoughtData._id } },
                { new: true }
            ).then(dbUserData => res.json(dbUserData))
            //res.json(dbThoughtData)
        })
        .catch(err => res.status(400).json(err))
    },
    updateThought({params, body}, res) {
        Thought.findOneAndUpdate({ _id: params.id }, body, { new: true, runValidators: true })
            .then(dbThoughtData => {
                if (!dbThoughtData) {
                    res.status(404).json({ message: 'No thoughts found with this id!' });
                    return;
                }
                res.json(dbThoughtData);
            })
            .catch(err => res.status(400).json(err));
    },
    deleteThought({params}, res) {
        Thought.findOneAndDelete({ _id: params.id })
            .then(dbThoughtData => {
                if (!dbThoughtData) {
                    res.status(404).json({ message: 'no thought with this id' })
                    return;
                }
                res.json(dbThoughtData)
            })
            .catch(err => res.status(400).json(err));
    },
    createReaction({ params, body }, res){
        Reaction.create(body)
            .then(dbReactionData => {
                Thought.findOneAndUpdate(
                    {_id: params.thoughtId},
                    {$push: {reactions: dbReactionData._id}},
                    {new: true}
                )
                res.json(dbReactionData)
            })
            .catch(err => res.status(400).json(err))
    },
    deleteReaction({params}, res){
        Reaction.findOneAndDelete({_id: params.reactionId})
            .then(dbReactionData => {
                if (!dbReactionData) {
                    res.status(404).json({ message: 'no reaction with this id' })
                    return;
                }
                res.json(dbReactionData)
            })
            .catch(err => res.status(400).json(err));
    }
}

module.exports = thoughtController;