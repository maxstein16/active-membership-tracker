const SamlStrategy = require('@node-saml/passport-saml').Strategy;
const fs = require('fs');

const BASE_URL = 'https://gccis-dio.gccis.rit.edu/';
const SP_ENTITY_ID = 'https://gccis-dio.gccis.rit.edu/saml2/';
const SP_PVK = fs.readFileSync('/var/www/html/active-membership-tracker/business-layer/cert/service.key', { encoding: 'utf8' });
const SP_CERT = fs.readFileSync('/var/www/html/active-membership-tracker/business-layer/cert/service.crt', { encoding: 'utf8' });

const IDP_SSO_URL = 'https://shibboleth.main.ad.rit.edu/idp/profile/SAML2/Redirect/SSO';
const IDP_CERT = fs.readFileSync('/var/www/html/active-membership-tracker/business-layer/cert/cert_idp.pem', { encoding: 'utf8' });

/* settings example */
const defaultSamlStrategy = new SamlStrategy(
    {
        name: 'saml',
        callbackUrl: BASE_URL + 'saml2/acs',
        identifierFormat: 'urn:oasis:names:tc:SAML:2.0:nameid-format:transient',
        entryPoint: IDP_SSO_URL,
        issuer: SP_ENTITY_ID,
        idpCert: IDP_CERT,
        decryptionPvk: SP_PVK,
        decryptionCert: SP_CERT,

        signMetadata: true,
        wantAssertionsSigned: true,
        wantAuthnResponseSigned: true,
        disableRequestedAuthnContext: true
    },
    /* acs callback */
    (profile, done) => {
        // Called after successful authentication, parse
        // the attributes in profile.
        const attributes = profile.attributes;
        // attributes and create
        const email = attributes['urn:oid:0.9.2342.19200300.100.1.3']; // Email
        const firstName = attributes['urn:oid:2.5.4.42']; // First Name
        const lastName = attributes['urn:oid:2.5.4.4']; // Last Name
        const username = attributes['urn:oid:0.9.2342.19200300.100.1.1']; // Username
        // Process or store the attributes
        const user = {
            email,
            firstName,
            lastName,
            username
        };
        console.log('SAML Attributes:', profile.attributes);
        console.log('EMAIl', email, 'FName', firstName, lastName, username);
        // or update a local user. Then return that user.
        return done(null, user)
    }
    /* end acs callback */
)

module.exports = {
    defaultSamlStrategy,
    IDP_CERT,
    SP_PVK,
    SP_CERT
};

/* end settings example */
