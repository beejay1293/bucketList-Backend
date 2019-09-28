import express from 'express';
import bucketListController from '../../controllers/BucketListController';
import Auth from '../../middlewares/isAuth';

const { verifyToken, trimmer } = Auth;

const router = express.Router();

const {
  createBucketList, getAllBucketLists, getSingleBucketList, updateBucketList, deleteBucketLits,
  createBucketListItem, getBucketListItems, getSingleBucketListItem,
  deleteSingleBucketListItem, updateSingleBucketListItem,
} = bucketListController;

router.post('/bucketlists', trimmer, verifyToken, createBucketList);
router.get('/bucketlists', verifyToken, getAllBucketLists);
router.get('/bucketlists/:bucketId', verifyToken, getSingleBucketList);
router.put('/bucketlists/:bucketId', verifyToken, updateBucketList);
router.delete('/bucketlists/:bucketId', verifyToken, deleteBucketLits);
router.post('/bucketlists/:bucketId/items', trimmer, verifyToken, createBucketListItem);
router.get('/bucketlists/:bucketId/items', verifyToken, getBucketListItems);
router.get('/bucketlists/:bucketId/items/:itemId', verifyToken, getSingleBucketListItem);
router.put('/bucketlists/:bucketId/items/:itemId', verifyToken, updateSingleBucketListItem);
router.delete('/bucketlists/:bucketId/items/:itemId', verifyToken, deleteSingleBucketListItem);


export default router;
