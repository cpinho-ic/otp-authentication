# OTP Authentication

This package simplifies the integration of one-time password (OTP) functionality into your Node.js project. It consists
of three main components:

- **OTP Generator**: Generates one-time passwords.
- **Cache Service**: Manages the storage of OTPs.
- **Delivery Service**: Sends OTPs via email or SMS.

By default, it utilizes the [otp-generator](https://www.npmjs.com/package/otp-generator) package for OTP generation,
[Redis](https://www.npmjs.com/package/redis) for caching, and [Nodemailer](https://www.npmjs.com/package/nodemailer)
and [Twilio](https://www.npmjs.com/package/twilio) for email and SMS delivery, respectively. However, you can also
implement custom solutions using abstract classes provided.

## Installation

```bash
npm install otp-authentication
```

## Configuration

The default configuration includes settings for Nodemailer, Twilio, and Redis. For Nodemailer and Twilio, additional
properties are available for email and SMS body templates, as explained below.

### EmailOTPAuthentication

```typescript
class EmailOTPAuthentication extends OTPAuthentication {
    constructor(redisOptions: RedisCacheServiceOptions, deliveryServiceOptions: {
        nodemailerOptions: NodemailerDeliveryServiceOptions;
        mailOptions: MailOptions;
    });
}
```

The default implementation for email delivery uses the `otp-generator` package to generate the OTP code, the `Redis`
package for the cache service and the `Nodemailer` package as the delivery service.

#### Cache Service Configuration

```typescript
type RedisCacheServiceOptions = RedisClientOptions<RedisModules, RedisFunctions, RedisScripts> & {
    prefix?: string;
};
```

You can configure the cache service using default Redis settings, with an optional prefix for keys

#### Delivery Service Configuration

```typescript
type NodemailerDeliveryServiceOptions = SMTPTransport.Options;
```

Configuration for Nodemailer follows its default settings.

```typescript
type MailOptions = {
    from: string;
    subject: string;
    html: string;
    text?: string;
};
```

Mail options are used to construct the email that will be sent.

| Property | Description                                                                                    |
| -------: | :--------------------------------------------------------------------------------------------- |
|     from | The sender's email address. Example: `Carlos Pinho <cpinho@imaginarycloud.com>`                |
|  subject | The email subject.                                                                             |
|     html | HTML template where `{{otp}}` or `{{OTP}}` will be replaced with the generated OTP code.       |
|     text | Plain text template where `{{otp}}` or `{{OTP}}` will be replaced with the generated OTP code. |

##### Example

```javascript
const otpAuth = new EmailOTPAuthentication(
    {
        socket: {
            host: Env.REDIS.HOST,
            port: Env.REDIS.PORT,
        },
    },
    {
        nodemailerOptions: {
            host: Env.SMTP.HOST,
            port: Env.SMTP.PORT,
            secure: Env.SMTP.PORT === 465,
            auth: {
                user: Env.SMTP.AUTH.USER,
                pass: Env.SMTP.AUTH.PASS,
            },
        },
        mailOptions: {
            from: 'Carlos Pinho <cpinho@imaginarycloud.com>',
            subject: 'OTP Code',
            html: '<b>OTP:</b> {{OTP}}',
            text: 'OTP: {{otp}}',
        },
    },
);
```

### SMSOTPAuthentication

```typescript
class SMSOTPAuthentication extends OTPAuthentication {
    constructor(redisOptions: RedisCacheServiceOptions, deliveryServiceOptions: {
        accountSid: string;
        authToken: string;
        opts: TwilioOpts;
    });
}
```

The default implementation for SMS delivery uses the `otp-generator` package to generate the OTP code, the `Redis`
package for the cache service and the `Twilio` package as the delivery service.

#### Cache Service Configuration

```typescript
type RedisCacheServiceOptions = RedisClientOptions<RedisModules, RedisFunctions, RedisScripts> & {
    prefix?: string;
};
```

The cache service configuration follows default Redis settings with an optional key prefix.

#### Delivery Service Configuration

```typescript
type TwilioOpts = ClientOpts & InnerOpts;
```

The delivery service configuration uses the default configuration of the `Twilio` package. Therefor the `accountSid`
and `authToken` properties are related with the `Twilio` package.

```typescript
type InnerOpts = {
    smsTemplate: string;
    from: string;
};
```

The inner options are used to construct how and were the SMS is sent..

|    Property | Description                                                                                    |
| ----------: | :--------------------------------------------------------------------------------------------- |
| smsTemplate | Plain text template where `{{otp}}` or `{{OTP}}` will be replaced with the generated OTP code. |
|        from | The SMS sender's number.                                                                       |

##### Example

```javascript
import { SMSOTPAuthentication } from 'otp-authentication';

const otpAuth = new SMSOTPAuthentication(
    {
        socket: {
            host: Env.REDIS.HOST,
            port: Env.REDIS.PORT,
        },
    },
    {
        accountSid: Env.TWILIO.ACCOUNT_SID,
        authToken: Env.TWILIO.AUTH_TOKEN,
        opts: {
            smsTemplate: 'OTP: {{otp}}',
            from: '+12563848581',
        },
    },
);
```

## Usage

Below is an example of how to use this package in an `Express.js` application, regardless on the chosen implementation.

### Request OTP code

```typescript
app.post('/api/auth', async (req, resp) => {
    const {
        body: { to },
    } = req;
    if (typeof to !== 'string') {
        return resp.status(400).send({ error: 'to string is mandatory' });
    }

    await otpAuth.request(to);

    return resp.sendStatus(200);
});
```

### Verify OTP code

```typescript
app.post('/api/auth/verify', async (req, resp) => {
    const {
        body: { to, otp },
    } = req;
    if (typeof to !== 'string') {
        return resp.status(400).send({ error: 'number string is mandatory' });
    }
    if (typeof otp !== 'string') {
        return resp.status(400).send({ error: 'OTP string is mandatory' });
    }

    const verified = await otpAuth.verify(to, otp);
    if (!verified) {
        return resp.status(401).send({ error: 'Invalid OTP' });
    }

    return resp.status(200).send({
        access: 'access-token',
        refres: 'refresh-token',
    });
});
```
