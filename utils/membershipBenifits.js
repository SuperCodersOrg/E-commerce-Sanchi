const Subscription = require('../models/subscription');

async function getMembershipBenifits(userId){

    const subscribedUsers = await Subscription.findOne({
        paymentStatus : 'paid',
        userId,
        expiresAt : { $gt : Date.now() }
    })

    if (!subscribedUsers) {
        return {
            plan: null,
            discountPercent: 0,
            deliveryDiscountPercent: 0,
            freeDelivery: false,
            couponCode: null,
        };
    }

    if(subscribedUsers.plan === 'Essential'){
        return {
            plan : 'Essential',
            discountPercent : 5,
            deliveryDiscountPercent : 5,
            freeDelivery : false,
            couponCode : VELNORA5,
        }
    }

    if(subscribedUsers.plan === 'Premium'){
        return {
            plan : 'Premium',
            discountPercent : 10,   
            deliveryDiscountPercent : 10,
            freeDelivery : true,
            couponCode : VELNORA10,
        }
    }
}

module.exports = getMembershipBenifits;