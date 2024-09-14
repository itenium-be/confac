set -e

if [ -z "${MONGO_POWERBI_USER}" ]; then
  exit 0
fi

mongo <<EOF
use $MONGO_INITDB_DATABASE
db.createUser({
  user: '$MONGO_POWERBI_USER',
  pwd: '$MONGO_POWERBI_PWD',
  roles: [{
    role: 'read',
    db: '$MONGO_INITDB_DATABASE'
  }]
})
EOF
