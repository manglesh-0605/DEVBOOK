const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');

const auth = require('../../middleware/auth');
const Post = require('../../models/Post');
const Profile = require('../../models/Profile');
const User = require('../../models/User');

//@route  POST api/posts
//@desc   to create a post
//@access Private
router.post(
  '/',
  [auth, [check('text', 'Text is required').not().isEmpty()]],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { text } = req.body;

    const user = await User.findById(req.user.id).select('-password');
    const newPost = {
      text,
      name: user.name,
      avatar: user.avatar,
      user: req.user.id,
    };
    try {
      const post = new Post(newPost);

      await post.save();
      res.json(post);
    } catch (err) {
      console.log(err.message);
      res.status(500).json({ msg: 'Server Error' });
    }
  }
);

//@route  GET api/posts
//@desc   to get all posts
//@access
router.get('/', auth, async (req, res) => {
  try {
    const posts = await Post.find().sort({ date: -1 });
    if (!posts) {
      return res.status(400).json({ msg: 'No posts found' });
    }
    res.json(posts);
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ msg: 'Server Error' });
  }
});

//@route  GET api/posts/:id
//@desc   to get  post by id
//@access Private
router.get('/:id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(400).json({ msg: 'Post not found' });
    }
    res.json(post);
  } catch (err) {
    console.log(err.message);
    if (err.kind == 'ObjectId') {
      return res.status(400).json({ msg: 'Post not found' });
    }
    res.status(500).json({ msg: 'Server Error' });
  }
});

//@route  DELETE api/posts/:id
//@desc   to detele  post by id
//@access Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(400).json({ msg: 'Post not found' });
    }

    if (post.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized' });
    }

    await post.remove();
    res.json({ msg: 'Post removed' });
  } catch (err) {
    console.log(err.message);
    if (err.kind == 'ObjectId') {
      return res.status(400).json({ msg: 'Post not found' });
    }
    res.status(500).json({ msg: 'Server Error' });
  }
});

//@route  PUT api/posts/like/:id
//@desc   like a post
//@access Private
router.put('/like/:id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (
      post.likes.filter((like) => like.user.toString() === req.user.id).length >
      0
    ) {
      console.log('Entered here');
      post.likes = post.likes.filter(
        (like) => like.user.toString() !== req.user.id
      );
      await post.save();
      return res.json({ msg: 'Post unliked' });
    }
    post.likes.unshift({ user: req.user.id });
    await post.save();
    res.json(post.likes);
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ msg: 'Server Error' });
  }
});

//@route  PUT api/posts/comment/:id
//@desc   comment on a post
//@access Private
router.put(
  '/comment/:post_id',
  [auth, check('text', 'text is required').not().isEmpty()],
  async (req, res) => {
    let errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { text } = req.body;
    try {
      const user = await User.findById(req.user.id).select('-password');
      const post = await Post.findById(req.params.post_id);

      const newComment = {
        text,
        name: user.name,
        avatar: user.avatar,
        user: req.user.id,
      };
      post.comments.unshift(newComment);
      await post.save();
      res.json(post.comments);
    } catch (err) {
      console.log(err.message);
      res.status(500).json({ msg: 'Server Error' });
    }
  }
);

//@route  DELETE api/posts/comment/:post_id/:comment_id
//@desc   to delete a comment from a post from a user
//@access Private
router.delete('/comment/:post_id/:comment_id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.post_id);

    let commentToDetele = post.comments.find(
      (comment) => comment.id === req.params.comment_id
    );
    if (!commentToDetele) {
      return res.status(404).json({ msg: 'Comment not found' });
    }
    if (commentToDetele.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized' });
    }
    post.comments = post.comments.filter(
      (comment) => comment.id !== req.params.comment_id
    );
    await post.save();
    res.json(post.comments);
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ msg: 'Server Error' });
  }
});
module.exports = router;
