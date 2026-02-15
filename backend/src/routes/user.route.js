import express from 'express'
import {
    acceptFriendRequest,
    getFriendRequests,
    getMyFriends,
    getOutgoingFriendRequests,
    getRecommendedUsers,
    rejectFriendRequests,
    sendFriendRequest
} from '../controllers/user.controller.js'
import { protectRoute } from '../middleware/auth.middleware.js'


const router= express.Router()

// apply auth middleware to all routes defined in this router
router.use(protectRoute)

router.get("/",getRecommendedUsers)
router.get("/friends",getMyFriends)

router.post("/friend-request/:id",sendFriendRequest)
router.put("/friend-request/:id/accept",acceptFriendRequest)
router.put("/friend-request/:id/reject",rejectFriendRequests)

router.get("/friend-requests",getFriendRequests)
router.get("/outgoing-friend-requests",getOutgoingFriendRequests)

export default router