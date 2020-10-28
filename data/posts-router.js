const express = require('express')
// import express library

const Posts = require('./db')
// import Posts modules

const router = express.Router()
// brings Router function

// POST add posts 
router.post('/', (req, res) => {
   const { title , contents } = req.body

   if(!title || !contents){
      res.status(400).json({
         errorMessage: "Please provide title and contents for the post."
      })
   } else {
      Posts.insert(req.body)
         .then(data => {
            console.log(data)
            res.status(201).json(data)
         })
         .catch(error => {
            res.status(500).json({ 
               error: "There was an error while saving the post to the database" 
            })
         })
   }
})

// POST add comments at specific posts
router.post('/:id/comments', (req, res) => {
   const { id } = req.params
   const { text } = req.body
   console.log(id, text)

   if(!id){
      res.status(404).json({ 
         message: "The post with the specified ID does not exist." 
      })
   } else if(!text){
      res.status(400).json({ 
         errorMessage: "Please provide text for the comment." 
      })
   } else {
      Posts.insertComment(req.body)
         .then(data => {
            res.status(201).json(data)
         })
         .catch(error => {
            res.status(500).json({ 
               error: "There was an error while saving the comment to the database" 
            })
         })
   }
})

// GET all posts
router.get('/', (req, res) => {
   Posts.find(req.query)
      .then(posts => {
         res.status(200).json({
            query: req.query, data: posts
         })
      })
      .catch(error => {
         res.status(500).json({ 
            error: "The posts information could not be retrieved." 
         })
      })
})

// GET specific posts informatioin
router.get('/:id', (req, res) => {
   const { id } = req.params

   if(!id){
      res.status(404).json({
         message: "The post with the specified ID does not exist."
      })
   } else {
      Posts.findById(id)
         .then(data => {
            console.log(data)
            res.status(201).json(data)
         })
         .catch(error => {
            res.status(500).json({
               error: "The post information could not be retrieved."
            })
         })
   }
})

// GET comments from specific posts
router.get('/:id/comments', (req, res) => {
   const { id } = req.params

   if(!id){
      res.status(404).json({
         message: "The post with the specified ID does not exist."
      })
   } else {
      Posts.findPostComments(id)
         .then(data => {
            console.log(data)
            res.status(200).json(data)
         })
         .catch(error => {
            res.status(500).json({
               error: "The comments information could not be retrieved."
            })
         })
   }
})

// DELETE specific posts
router.delete('/:id', (req, res) => {
   const { id } = req.params

   if(!id){
      res.status(404).json({
         message: "The post with the specified ID does not exist."
      })
   } else {
      Posts.remove(id)
         .then(data => {
            console.log(data)
            res.status(201).json({
               message: 'Successfully Deleted'
            })
         })
         .catch(error => {
            res.status(500).json({
               error: "The post could not be removed"
            })
         })
   }
})

router.put('/:id', (req, res) => {
   const { id } = req.params
   const { title, contents } = req.body
   const updatedPosts = req.body


   if(!id){
      res.status(404).json({
         message: "The post with the specified ID does not exist."
      })
   } else if(!title || !contents) {
      res.status(400).json({
         errorMessage: "Please provide title and contents for the post."
      })
   } else {
      Posts.update(id, updatedPosts)
         .then(data => {
            console.log(data)
            // returning an updated data
            // You must execute function before it response to client.
            // Once it response to client, you won't be able to make another response.
            Posts.findById(id)
            .then(data => {
               console.log(data)
               res.status(201).json(data)
            })
            .catch(error => {
               res.status(500).json({
                  message: 'Something went wrong!!'
               })
            })
         })
         .catch(error => {
            res.status(500).json({
               error: "The post information could not be modified."
            })
         })
   }
})

module.exports = router

/*


Post Data Structure

{
   title: "The post title", // String, required
   contents: "The post contents", // String, required
   created_at: Mon Aug 14 2017 12:50:16 GMT-0700 (PDT) // Date, defaults to current date
   updated_at: Mon Aug 14 2017 12:50:16 GMT-0700 (PDT) // Date, defaults to current date
}

Comment Data Structure

{
   text: "The text of the comment", // String, required
   post_id: "The id of the associated post", // Integer, required, must match the id of a post entry in the database
   created_at: Mon Aug 14 2017 12:50:16 GMT-0700 (PDT) // Date, defaults to current date
   updated_at: Mon Aug 14 2017 12:50:16 GMT-0700 (PDT) // Date, defaults to current date
}

 */