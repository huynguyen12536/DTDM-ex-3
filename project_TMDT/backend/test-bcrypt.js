const bcrypt = require('bcryptjs');

const hash = '$2a$10$Dzglqps2LWnUeH7L7iq9yu1r6eNyhAUgB8b2lA1J3mI3FpaDU2JMO';
const password = '123456';

bcrypt.compare(password, hash).then(res => {
    console.log('Match:', res);
});
