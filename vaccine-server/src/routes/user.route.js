"use strict";
const router = require('express').Router();
const { AuthGuard } = require('./../guards');
const { UserController } = require('../controllers');
const upload = require('./../upload');


router.get('/user-info/:user_id', UserController.getUserInfo);

router.use(AuthGuard);

router.get('/user-info-email/:email', UserController.getUserInfoByEmail);
router.get('/basic', UserController.getUserById);
router.get('/basic/:id', UserController.getUserById);
router.put('/update-basic-details', UserController.updateUserBasicDetails);
router.put('/upload-avatar', upload.single, UserController.uploadAvatar);
router.put('/update-password', UserController.updatePassword);
router.put('/set-password', UserController.setPassword);
router.get('/get-work-details', UserController.getWorkDetails);
router.get('/get-education-details', UserController.getEducationDetails);
router.put('/save-or-update-work-details', UserController.saveOrUpdateWorkDetails);
router.put('/save-or-update-education-details', UserController.saveOrUpdateEducationDetails);
router.delete('/delete-work-details/:workDetailsId', UserController.deleteWorkDetails);
router.delete('/delete-education-details/:educationDetailsId', UserController.deleteEducationDetails);
router.get('/get-counts', UserController.getDashboardCounts);
router.put('/update-identity', upload.single, UserController.updateIdentity);
router.get('/liked-properties', UserController.getLikedProperties);
router.get('/wishlist-properties', UserController.getWishlistProperties);

module.exports = router;