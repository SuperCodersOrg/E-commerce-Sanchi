const Subscription = require('../models/subscription');

async function getMembershipBenifits(userId){

    const subscribedUsers = await Subscription.findOne({
        paymentStatus : 'paid',
        userId,
        expiresAt : { $gt : new Date() }
    }).sort({ createdAt : -1 })

    if (!subscribedUsers) {
        return {
            plan: null,
            discountPercent: 0,
            deliveryDiscountPercent: 0,
            freeDelivery: false
        };
    }

    if(subscribedUsers.plan === 'Essential'){
        return {
            plan : 'Essential',
            discountPercent : 5,
            deliveryDiscountPercent : 5,
            freeDelivery : false
        }
    }

    if(subscribedUsers.plan === 'Premium'){
        return {
            plan : 'Premium',
            discountPercent : 10,   
            deliveryDiscountPercent : 100,
            freeDelivery : true
        }
    }
}

module.exports = getMembershipBenifits;