const chai = require('chai');
const axios = require('axios');

var expect = chai.expect;

function getFridgeProduct(product, userID) {
    return new Promise(function(resolve, reject) {
        axios.post("http://localhost:5000/getFridgeProduct", { product: product, userID: userID })
        .then(res => resolve(res.data))
    })
}

function getUserProfile(userID) {
    return new Promise(function(resolve, reject) {
        axios.post("http://localhost:5000/getUserProfile", { userID: userID})
        .then(res => resolve(res.data))
    })
}

function getUserProfilesByName(name) {
    return new Promise(function(resolve, reject) {
        axios.post("http://localhost:5000/getUserProfilesByName", { name: name})
        .then(res => resolve(res.data))
    })
}

function getUserProfilesByEmail(email) {
    return new Promise(function(resolve, reject) {
        axios.post("http://localhost:5000/getUserProfilesByEmail", { email: email})
        .then(res => resolve(res.data))
    })
}

function getProduct(product, userID) {
    return new Promise(function(resolve, reject) {
        axios.post("http://localhost:5000/getProduct", { product: product, userID: userID })
        .then(res => resolve(res.data))
    })
}

function getDateAsString(date) {
    var dateString = date ? new Date(date) : new Date();
    return dateString.getFullYear() + "/" + (dateString.getMonth() + 1) + "/" + dateString.getDate();
}

describe('Add and remove product functionality', function() {
    var fridgeProduct;
    describe('When checking a product in the user\'s fridge, it', function() {
      it('should return no results when the item has not yet been added', async function() {
        fridgeProduct = await getFridgeProduct('carrots', 1);
        expect(fridgeProduct).to.be.empty;
      });
      it('should return the product after it has been added to the fridge', async function() {
        await axios.post("http://localhost:5000/addProduct", { product: 'carrots', quantity: '2' })
        .then(async () => {
            fridgeProduct = await getFridgeProduct('carrots', 1);
            expect(fridgeProduct).to.be.not.empty;
        })
      });
      it('should correctly recognize the quantity that was added', async function() {
        expect(fridgeProduct[0].qty).to.equal(2);
      });
      it('should have today\'s date as the input date', async function() {
        input_date = getDateAsString(fridgeProduct[0].input_dt);
        today_date = getDateAsString();
        expect(input_date).to.equal(today_date);
      });
      it('should not exist in the fridges of other users', async function() {
        fridgeProduct = await getFridgeProduct('carrots', 2);
        expect(fridgeProduct).to.be.empty;
      });
      it('should return no results after the product has been deleted from the fridge', async function() {
        await axios.post("http://localhost:5000/removeProduct", { product: 'carrots' })
        .then(async () => {
            fridgeProduct = await getFridgeProduct('carrots', 1);
            expect(fridgeProduct).to.be.empty;
        })
      });
    });
  });

  describe('Edit user profile functionality', function() {
    var userProfile;
    describe('When checking a user profile it', function() {
        it('should return a result for that user before it edits the profile', async function() {
            userProfile = await getUserProfile(1);
            expect(userProfile).to.be.not.empty;
        });
        it('should have initial name', async function() {
            expect(userProfile[0].name).to.equal('First Test');
        });
        it('should have initial email', async function() {
            expect(userProfile[0].email).to.equal('test1@gmail.com');
        });
        it('should have initial postal code', async function() {
            expect(userProfile[0].postal_code).to.equal('A1A 1A1');
        });
        it('should return a result for that user after it edits the profile', async function() {
            await axios.post("http://localhost:5000/editProfile", { username: 'Second Test', email: 'test2@gmail.com', postal_code: 'B0B 0B0' })
            .then(async () => {
                userProfile = await getUserProfile(1);
                expect(userProfile).to.be.not.empty;
            })
        });
        it('should correctly recognize the name that was edited', async function() {
            expect(userProfile[0].name).to.equal('Second Test');
        });
        it('should correctly recognize the email that was edited', async function() {
            expect(userProfile[0].email).to.equal('test2@gmail.com');
        });
        it('should correctly recognize the postal code that was edited', async function() {
            expect(userProfile[0].postal_code).to.equal('B0B 0B0');
        });
        it('should not edit other users\' names', async function() {
            userProfile = await getUserProfilesByName('Second Test');
            expect(userProfile).to.be.empty;
        });
        it('should not edit other users\' email', async function() {
            userProfile = await getUserProfilesByEmail('test2@gmail.com');
            expect(userProfile).to.be.empty;
        });
        it('should reset profile to initial information', async function() {
            await axios.post("http://localhost:5000/editProfile", { username: 'First Test', email: 'test1@gmail.com', postal_code: 'A1A 1A1' })
            .then(async () => {
                userProfile = await getUserProfile(1);
                expect(userProfile).to.be.not.empty;
            })
        });
    });
});

describe('Edit product functionality', function() {
    var fridgeProduct;
    describe('A newly added product', function() {
        it('should initially have the specified quantity', async function() {
            // similar to above in add/remove products, need to add a product and then check that its quantity equals what was specified
            await axios.post("http://localhost:5000/addProduct", { product: 'tomatoes', quantity: '4' })
            .then(async () => {
                fridgeProduct = await getFridgeProduct('tomatoes', 1);
                expect(fridgeProduct[0].qty).to.equal(4);
            })
        });
        it('should initially have the default expiry date', async function() {
            // need to check if the expiry date = the input date + lifetime
            // to do this, get the expiry and input dates (as Date objects) and add the lifetime in days using the setDate() function
            // because of by reference/by value problems, you will need apply the function getTime() to both dates before attempting to compare them
            
            expiry_date = new Date(fridgeProduct[0].exp_dt).getTime();
            input_date = new Date(fridgeProduct[0].input_dt);            

            input_date.setDate(input_date.getDate() + fridgeProduct[0].lifetime);
            input_date = input_date.getTime();
            expect(expiry_date).to.equal(input_date);
        });
    });
    describe('After editing the product with a new expiry date and quantity, it', async function() {
        it('should have the new quantity', async function() {
            // use axios to make a post http request to /editFridgeItem, with parameters called 'quantity' and 'expirydate' with the desired updated dates
            // after this is done, update the value of the fridgeProduct variable using the await getFridgeProduct('tomatoes', 1) function, as done above, and check the quantity again to see if it matches
            await axios.post("http://localhost:5000/editFridgeItem", { product: 'tomatoes', quantity: '6', expirydate: '2021-01-07' })
            .then(async () => {
                fridgeProduct = await getFridgeProduct('tomatoes', 1);
                expect(fridgeProduct[0].qty).to.equal(6);
            })
        });
        it('should have the new expiry date', async function() {
            // create a new date object with the same date as the date you specified (i.e. var expiryDate = new Date(2020, 11, 25) returns a date equal to December 25, 2020)
            // again convert using the getTime() function, and compare it to the exp_date value from the fridgeProduct object
            expiry_date = new Date(fridgeProduct[0].exp_dt).getTime();
            expected_date = new Date(2021, 0, 7).getTime();
            expect(expiry_date).to.equal(expected_date);
        });
        it('should return no longer exist after the product has been deleted from the fridge', async function() {
            // delete the product afterward so that future test runs don't break
            await axios.post("http://localhost:5000/removeProduct", { product: 'tomatoes' })
            .then(async () => {
                fridgeProduct = await getFridgeProduct('tomatoes', 1);
                expect(fridgeProduct).to.be.empty;
            })
        });
    })
})

describe('Add custom product functionality', function() {
    var fridgeProduct;
    var customProduct;
    describe('Before adding a new custom product', async function() {
        it('the product should not yet exist in the products table', async function() {
            // check the products table for a custom product that does not yet exist using the getProduct() function
            // it should return an empty array
            // this should look similar to the first test in add/remove products, except with getProduct() instead of getFridgeProduct()
            customProduct = await getProduct('carrot cake', 1);
            expect(customProduct).to.be.empty;
        });
    });
    describe('After adding a new custom product, it', async function() {
        it('should have the name that was specified', async function() {
            // use the getProduct() function to check that the product you added does exist now; save it to the customProduct variable so you won't have to call this function again
            await axios.post("http://localhost:5000/addCustom", { product_name: 'carrot cake', type: 'baked goods', life: '8', quantity: '4' })
            .then(async () => {
                customProduct = await getProduct('carrot cake', 1);
                expect(customProduct).to.be.not.empty;
            })
        });
        it('should have the type that was specified', async function() {
            // check the customProduct variable's type field and see if it matches what you specified
            expect(customProduct[0].type).to.equal('baked goods');
        });
        it('should have the lifetime that was specified', async function() {
            // check the customProduct variable's variable field and see if it matches what you specified
            expect(customProduct[0].lifetime).to.equal(8);
        });
        it('should not appear in other user\'s products lists', async function() {
            // call getProduct() again on the customProduct variable, but this time pass a different user ID than the one you passed originally
            // the returned array should be empty as the product should not exist for that user
            // should look similar to how it was done for add/remove products
            customProduct = await getProduct('carrot cake', 2);
            expect(customProduct).to.be.empty;
        });
        it('should appear in the user\'s fridge', async function() {
            // call getFridgeProduct() and assign its results to the fridgeProduct variable, and ensure that the result is not empty
            // should look essentially identical to the second test in add/remove products
            fridgeProduct = await getFridgeProduct('carrot cake', 1);
            expect(fridgeProduct).to.be.not.empty;
        })
    })
    
    it('should return no results after the custom product has been deleted from the fridge', async function() {
        // delete the custom product afterward so that future test runs don't break
        // will need to make an axios http post request to /removeProduct first and then to /removeCustom, otherwise the foreign keys won't let you
        // call getProduct one last time and check that it is empty
        await axios.post("http://localhost:5000/removeProduct", { product: 'carrot cake', userID: '1' }).then(async() => {
            await axios.post("http://localhost:5000/removeCustom", { product: 'carrot cake', userID: '1' }).then(async() => {
                customProduct = await getProduct('carrot cake', 1);
                expect(customProduct).to.be.empty;
            })
        })
    });
})
