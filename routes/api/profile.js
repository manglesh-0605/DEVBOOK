const express = require('express');
const router = express.Router();
const config = require('config');
const request=require('request');
const auth = require('../../middleware/auth');
const { check, validationResult } = require('express-validator');

const Profile = require('../../models/Profile');
const User = require('../../models/User');
const { acceptsCharsets } = require('express/lib/request');
const { route } = require('./login');

//@route  GET api/profile/me
//@desc   get individual profile details
//@access private

router.get('/me', auth, async (req, res) => {
  try {
    let profile = await Profile.findOne({ user: req.user.id }).populate(
      'user',
      ['name', 'avatar']
    );

    if (!profile) {
      return res.status(400).json({ msg: 'There is no profile for this User' });
    }

    res.json(profile);
  } catch (err) {
    console.log({ error: err.message });
    res.status(500).send('Server error');
  }
});

//@route  POST api/profile
//@desc   Create or update a User profile
//@access private

router.post(
  '/',
  [
    auth,
    [
      check('status', 'Status is required').not().isEmpty(),
      check('skills', 'Skills is required').not().isEmpty(),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      company,
      website,
      location,
      bio,
      status,
      githubusername,
      skills,
      youtube,
      facebook,
      twitter,
      instagram,
      linkedin,
    } = req.body;

    //build profile object-
    const profileFields = {};
    profileFields.user = req.user.id;
    if (company) profileFields.company = company;
    if (website) profileFields.website = website;
    if (location) profileFields.location = location;
    if (bio) profileFields.bio = bio;
    if (status) profileFields.status = status;
    if (githubusername) profileFields.githubusername = githubusername;
    if (skills)
      profileFields.skills = skills.split(',').map((skill) => skill.trim());

    //build social object --
    profileFields.social = {};
    if (youtube) profileFields.social.youtube = youtube;
    if (twitter) profileFields.social.twitter = twitter;
    if (facebook) profileFields.social.facebook = facebook;
    if (linkedin) profileFields.social.linkedin = linkedin;
    if (instagram) profileFields.social.instagram = instagram;

    //build education object-
    profileFields.education = [];
    console.log('skills >>>>>', profileFields.skills);

    try {
      let profile = await Profile.findOne({ user: req.user.id });

      if (profile) {
        //update
        profile = await Profile.findOneAndUpdate(
          {
            user: req.user.id,
          },
          {
            $set: profileFields,
          },
          {
            new: true,
          }
        );

        return res.json({ msg: 'profile updated', Profile });
      }

      //create
      profile = new Profile(profileFields);
      await profile.save();
      res.json({ msg: 'profile created', Profile });
    } catch (err) {
      console.log(err.message);
      res.status(500).send('Server error');
    }
    res.json({ msg: 'profile created' });
  }
);

//@route  GET api/profile
//@desc   Get all profiles
//@access public
router.get('/', async (req, res) => {
  try {
    const profiles = await Profile.find().populate('user', ['name', 'avatar']);
    res.send(profiles);
  } catch (err) {
    console.log(err.message);
    res.status(500).send('Server error');
  }
});

//@route  GET api/profile/{userId}
//@desc   Get profile by userId
//@access public

router.get('/:user_id', async (req, res) => {
  try {
    let profile = await Profile.findOne({ user: req.params.user_id }).populate(
      'user',
      ['name', 'avatar']
    );

    if (!profile) {
      return res.status(400).json({ msg: 'Profile not found' });
    }
    res.send(profile);
  } catch (err) {
    console.log(err.message);
    if (err.kind == 'ObjectId') {
      return res.status(400).json({ msg: 'Profile not found' });
    }
    res.status(500).send('Server error');
  }
});

//@route  DELET api/profile
//@desc   Delete profile user & post
//@access Private

router.delete('/', auth, async (req, res) => {
  try {
    //TODO: remove user's posts-

    //Remove profile
    await Profile.findOneAndRemove({ user: req.user.id });
    //Remove user
    await User.findOneAndRemove({ _id: req.user.id });

    res.json({ msg: 'User deleted' });
  } catch (err) {
    console.log(err.message);
    res.status(500).send('Server error');
  }
});

//@route  PUT api/profile/experience
//@desc   Add experience in the user's profile
//@access Private
router.put(
  '/experience',
  [
    auth,
    [
      check('title', 'Title is required').not().isEmpty(),
      check('company', 'Company is required').not().isEmpty(),
      check('current', 'current cannot be empty').not().isEmpty(),
      check('from', 'From date is required and needs to be from the past')
        .not()
        .isEmpty(),
    ],
  ],
  async (req, res) => {
    let errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { title, company, location, from, to, current, description } =
      req.body;

    const newExp = {};
    if (title) newExp.title = title;
    if (company) newExp.company = company;
    if (location) newExp.location = location;
    if (from) newExp.from = from;
    if (to) newExp.to = to;
    if (current) newExp.current = current;
    if (description) newExp.description = description;

    try {
      const profile = await Profile.findOne({ user: req.user.id });
      profile.experiences = [...profile.experiences, newExp];
      await profile.save();
      res.json(profile);
    } catch (err) {
      console.log(err.message);
      res.status(500).send('Server error');
    }
  }
);

//@route  DELETE api/profile/experience
//@desc   Remove experience in the user's profile
//@access Private

router.delete('/experience/:id', auth, async (req, res) => {
  try {
    let profile = await Profile.findOne({ user: req.user.id });
    profile.experiences = profile.experiences.filter(
      (exp) => exp.id !== req.params.id
    );
    await profile.save();
    res.send(profile);
  } catch (err) {
    console.log(err.message);
    res.status(500).send('Server error');
  }
});

//@route  PUT api/profile/education
//@desc   Add education in the user's profile
//@access Private
router.put(
  '/education',
  [
    auth,
    [
      check('school', 'School is required').not().isEmpty(),
      check('degree', 'degree is required').not().isEmpty(),
      check('fieldOfStudy', 'fieldOfStudy cannot be empty').not().isEmpty(),
      check('from', 'From date is required and needs to be from the past')
        .not()
        .isEmpty(),
    ],
  ],
  async (req, res) => {
    let errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { school, degree, fieldOfStudy, from, to, current, description } =
      req.body;

    const newEducation = {};
    if (school) newEducation.school = school;
    if (degree) newEducation.degree = degree;
    if (fieldOfStudy) newEducation.fieldOfStudy = fieldOfStudy;
    if (from) newEducation.from = from;
    if (to) newEducation.to = to;
    if (current) newEducation.current = current;
    if (description) newEducation.description = description;

    try {
      const profile = await Profile.findOne({ user: req.user.id });
      profile.education = [...profile.education, newEducation];
      await profile.save();
      res.json(profile);
    } catch (err) {
      console.log(err.message);
      res.status(500).send('Server error');
    }
  }
);

//@route  DELETE api/profile/education
//@desc   Remove education in the user's profile
//@access Private

router.delete('/education/:id', auth, async (req, res) => {
  try {
    let profile = await Profile.findOne({ user: req.user.id });
    profile.education = profile.education.filter(
      (edu) => edu.id !== req.params.id
    );
    await profile.save();
    res.send(profile);
  } catch (err) {
    console.log(err.message);
    res.status(500).send('Server error');
  }
});

//@route  Get  api/profile/github/:username
//@desc   Get Users repos from github
//@access Public

router.get('/github/:username', async (req, res) => {
  try {
    const options = {
      uri:`https://api.github.com/users/${req.params.username}/repos?per_page=5&sort=created:asc&client_id=${config.get('githubClientId')}&client_secret=${config.get('githubSecret')}`,
      method: 'GET',
      headers: { 'user-agent': 'node.js' }
    };
    request(options, (error, response, body) => {
      if(error) console.error(error);
      if(response.statusCode !== 200) {
        return res.status(404).json({ msg: 'No Github profile found' });
      }
      res.json(JSON.parse(body));
    })
  } catch (err) {
    console.log(err.message);
    res.status(500).send('Server error');
  }
});



module.exports=router;