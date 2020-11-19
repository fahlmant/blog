Useful OpenSSL commands
=======================



.. author:: Taylor
.. categories:: none
.. tags:: openssl, cert, certificate, pfx, key, pem, crt, ssl
.. comments::

Here a few useful commands I found when working with certs lately

Covert a pfx file into a pem::

    openssl pkcs12 -in foo.pfx -out foo.pem -nodes

Extract the key out of a pem::

    openssl pkey -in foo.pem -out foo.key

Extrct CA cert chain out of a pem::
    
    openssl crl2pkcs7 -nocrl -certfile foo.pem | openssl pkcs7 -print_certs -out foo.chain.crt

Extract cert out of a pem::
    
    openssl x509 -in foo.pem -outform DER -out foo.crt

