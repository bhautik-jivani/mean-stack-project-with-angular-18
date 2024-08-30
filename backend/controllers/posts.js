const multer = require("multer")

const Post = require("../models/posts")

exports.getPosts = (req, res, next) => {
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
}

exports.createPost = (req, res, next) => {
    const url = req.protocol + "://" + req.get("host")
    const post = new Post({
        title: req.body.title,
        content: req.body.content,
        imagePath: url + "/images/" + req.file.filename,
        creator: req.userData.userId,
    })
    post.save().then((createdPost) => {
        res.status(201).json({
            message: 'Post added successfully',
            post: {
                id: createdPost._id,
                title: createdPost.title,
                content: createdPost.content,
                imagePath: createdPost.imagePath,
                creator: createdPost.creator
            }
        })
    }).catch((error) => {
        res.status(500).json({
            message: "Something went wrong!",
            error: error
        })
    })
}

exports.getPost = (req, res, next) => {
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
}

exports.updatePost = (req, res, next) => {
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
    Post.updateOne({_id: req.params.id, creator: req.userData.userId}, post).then((updatedPost) => {
        if (updatedPost.modifiedCount > 0 || updatedPost.matchedCount > 0) {
            res.status(200).json({
                message: "Posts updated successfully!",
                post: {
                    id: updatedPost._id,
                    title: updatedPost.title,
                    content: updatedPost.content,
                    imagePath: updatedPost.imagePath,
                }
            })
        } else {
            res.status(401).json({
                message: "You are not authorized to perform this action!"
            })
        }
    }).catch((error) => {
        res.status(500).json({
            message: "Something went wrong!",
            error: error
        })
    })
}

exports.deletePost = (req, res, next) => {
    Post.deleteOne({_id: req.params.id, creator: req.userData.userId}).then((result) => {
        if (result.deletedCount > 0) {
            res.status(200).json({ message: 'Post deleted!' })
        } else {
            res.status(401).json({
                message: "You are not authorized to perform this action!"
            })
        }
    }).catch((error) => {
        res.status(500).json({
            message: "Something went wrong!",
            error: error
        })
    })
}