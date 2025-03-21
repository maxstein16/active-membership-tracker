const SamlStrategy = require('@node-saml/passport-saml').Strategy;
const fs = require('fs');

const BASE_URL = 'http://gccis-dio.gccis.rit.edu/';
const SP_ENTITY_ID = 'http://gccis-dio.gccis.rit.edu/saml2/';
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
        // the attributes in profile.attributes and create
        // or update a local user. Then return that user.
        return done(null, profile.attributes)
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
