const express = require("express")
const Post = require("../models/posts")
const multer = require("multer")

const router = express.Router()

const MIME_TYPE_MAP = {
    'image/png': 'png',
    'image/jpeg': 'jpg',
    'image/jpg': 'jpg',
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const isValid = MIME_TYPE_MAP[file.mimetype]
        let error = new Error("Invalid mimetype!")
        if (isValid) {
            error = null
        }
        cb(error, "backend/images")
    },
    filename: (req, file, cb) => {
        const name = file.originalname.toLowerCase().split(' ').join('-')
        const ext = MIME_TYPE_MAP[file.mimetype]
        cb(null, name + '-' + Date.now() + '.' + ext)
    }
})

router.post('', multer({storage: storage}).single("image"), (req, res, next) => {
    const url = req.protocol + "://" + req.get("host")
    const post = new Post({
        title: req.body.title,
        content: req.body.content,
        imagePath: url + "/images/" + req.file.filename
    })
    post.save().then((createdPost) => {
        console.log("createdPost--",createdPost);
        
        res.status(201).json({
            message: 'Post added successfully',
            post: {
                id: createdPost._id,
                title: createdPost.title,
                content: createdPost.content,
                imagePath: createdPost.imagePath,
            }
        })
    }).catch((error) => {
        res.status(500).json({
            message: "Something went wrong!",
            error: error
        })
    })
})

router.get('', (req, res, next) => {
    const pageSize = +req.query.pagesize
    const currentPage = +req.query.page
    let fetchedPosts
    const postQuery = Post.find()
    
    if(pageSize && currentPage) {
        
        postQuery.skip(pageSize * (currentPage - 1)).limit(pageSize)
    }
    postQuery.then(documents => {
        fetchedPosts = documents
        return Post.countDocuments()
    }).then(count => {
        res.status(200).json({
            message: "Posts fetched successfully!",
            posts: fetchedPosts,
            maxPosts: count,
            currentPage: currentPage,
        })
    }).catch((error) => {
        res.status(500).json({
            message: "Something went wrong!",
            error: error
        })
    })
})

router.get('/:id', (req, res, next) => {
    const post = Post.findById(req.params.id).then((document) => {
        if(document) {
            res.status(200).json({
                message: "Post fetched successfully!",
                post: document
            })
        } else {
            res.status(404).json({
                message: "Post not found!",
                error: error
            })
        }
    }).catch((error) => {
        res.status(500).json({
            message: "Something went wrong!",
            error: error
        })
    })
})

router.put('/:id', multer({storage: storage}).single("image"), (req, res, next) => {
    let imagePath = req.body.imagePath
    
    if(req.file) {
        const url = req.protocol + "://" + req.get("host")
        imagePath = url + "/images/" + req.file.filename
    }

    const post = new Post({
        _id: req.params.id,
        title: req.body.title,
        content: req.body.content,
        imagePath: imagePath,
    })
    Post.updateOne({_id: req.params.id}, post).then((updatedPost) => {
        res.status(200).json({
            message: "Posts updated successfully!",
            post: {
                id: updatedPost._id,
                title: updatedPost.title,
                content: updatedPost.content,
                imagePath: updatedPost.imagePath,
            }
        })
    }).catch((error) => {
        res.status(500).json({
            message: "Something went wrong!",
            error: error
        })
    })
})

router.delete('/:id', (req, res, next) => {
    Post.deleteOne({_id: req.params.id}).then((result) => {
        res.status(200).json({ message: 'Post deleted!' })
    }).catch((error) => {
        res.status(500).json({
            message: "Something went wrong!",
            error: error
        })
    })
})

module.exports = router