const Mailjet = require('node-mailjet');

const mailjet = Mailjet.apiConnect(
    process.env.MAILJET_API_KEY,
    process.env.MAILJET_SECRET_KEY,
);

async function sendEmail(to,subject,text,html){
    const response = await mailjet
        .post('send',{ version : 'v3.1' })
        .request({
            Messages : [{
                From : {
                    Email : process.env.MAILJET_EMAIL_ID,
                    Name : 'VELNORA'
                },
                To : [{ Email : to }],
                Subject : subject,
                TextPart : text,
                HTMLPart : html
            }]
        });

    return response.body;
}

module.exports = {
    sendEmail
}