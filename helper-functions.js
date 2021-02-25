const helpers = {

    /* takes a string and returns true if it's a valid phone number, false if not */
    phone: function(string){
        let re = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im
        return re.test(string)
    },

    /* takes a string and returns true if it's a valid email address, false if not */
    email: function(string) {
        const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(string).toLowerCase());
    },

    /* takes an object of any depth and returns an array of all empty properties, 
    and all properties called 'phone' or 'email' that contain an invalid phone number 
    or email address. */

    validateProperties: object => {
        let badProperties = []

        for(const x in object){
            // if it's empty, push it into the badProperties array
            object[x] === '' && badProperties.push(x)
            // if it's called phone or email and ocntains an invalid phone or email push it into badProperties
            if((x === 'phone' || x === 'email') && !helpers[x](object[x])) badProperties.push(x)
            // if it's an object, run this function on it and push the return value into badProperties
            if(typeof(object[x]) === 'object') badProperties.push(...helpers.validateProperties(object[x]))           
        }

        return badProperties
    },
}


module.exports = helpers